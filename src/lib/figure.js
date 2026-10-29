import { onPad, tileKey, tilesAround, resolveCollision, FLOOR } from "./floor.js";

/** Floor units per second (spec 5.5: 9 cqw/s). */
export const SPEED = 9;
export const IDLE_RESUME_MS = 6000;
export const PAUSE_MS = 1500;
export const TILE_FADE_MS = 4000;
export const RESPAWN_MS = 1000;
const FRAME_MS = 120;
const ARRIVE = 0.02;
const RESPAWN_FALLBACK = { x: 44, y: 26 };

const S = Math.SQRT1_2;
const KEYS = {
  ArrowUp: { dx: S, dy: -S },
  ArrowDown: { dx: -S, dy: S },
  ArrowLeft: { dx: -S, dy: -S },
  ArrowRight: { dx: S, dy: S },
};
KEYS.w = KEYS.W = KEYS.ArrowUp;
KEYS.s = KEYS.S = KEYS.ArrowDown;
KEYS.a = KEYS.A = KEYS.ArrowLeft;
KEYS.d = KEYS.D = KEYS.ArrowRight;

/** Screen-direction keys as floor vectors (right = screen-right). Null for any other key. */
export const keyToDir = (key) => KEYS[key] || null;

/** Which way the figure faces on screen for a floor movement. */
export function facingOf({ dx, dy }) {
  const sx = dx + dy; // screen right
  const sy = dy - dx; // screen down
  return (sy >= 0 ? "d" : "u") + (sx >= 0 ? "r" : "l");
}

/** @param {{ x: number, y: number }} start */
export function initialFigure(start) {
  return {
    pos: { ...start },
    facing: "dr",
    frame: 0,
    frameClock: 0,
    control: "idle",
    idleIndex: 0,
    pauseLeft: 0,
    sinceInput: IDLE_RESUME_MS,
    target: null,
    route: [],
    tiles: new Map(),
    falling: false,
    fallLeft: 0,
    now: 0,
  };
}

/** The open aisle across the room, used to detour around furniture. */
const AISLE_Y = 28;

/** The point just in front of a station, where the idle walk stops. */
export function standPoint(station) {
  if (station.standAt) return { ...station.standAt };
  const f = station.footprint;
  return { x: f.x + f.w / 2, y: Math.min(FLOOR.h - 1, f.y + f.h + 2) };
}

/** Back walls block: no walking past y = 0 or x = 100. The open front edges do not. */
const clampWalls = (p) => ({ x: Math.min(p.x, FLOOR.w), y: Math.max(p.y, 0) });

/**
 * Advances the figure by dt seconds. Pure: returns a new state.
 * @param {ReturnType<typeof initialFigure>} state
 * @param {{ dir: { dx: number, dy: number } | null, tapTarget: { x: number, y: number } | null, dt?: number }} input
 * @param {{ stations: { id: string, footprint: object }[], footprints: object[], respawn?: { x: number, y: number } }} ctx
 *   stations: the idle tour (empty to stay put); respawn: where he reappears after a fall
 * @param {number} [dtArg] seconds
 */
export function stepFigure(state, input, ctx, dtArg) {
  const dt = input.dt ?? dtArg ?? 1 / 60;
  const ms = dt * 1000;
  const s = { ...state, pos: { ...state.pos }, route: [...(state.route || [])], tiles: new Map(state.tiles), now: state.now + ms };

  if (s.falling) {
    s.fallLeft -= ms;
    if (s.fallLeft <= 0) {
      const desk = ctx.stations.find((st) => st.id === "desk") || ctx.stations[0];
      s.pos = ctx.respawn ? { ...ctx.respawn } : desk ? standPoint(desk) : { ...RESPAWN_FALLBACK };
      s.falling = false;
      s.fallLeft = 0;
      s.control = "idle";
      s.idleIndex = 0;
      s.pauseLeft = 0;
      s.target = null;
      s.route = [];
      s.tiles = new Map();
      s.frame = 0;
    }
    return s;
  }

  // Walk-off tiles fade; standing on a faded one off the pad means a fall.
  for (const [key, seen] of s.tiles) if (s.now - seen > TILE_FADE_MS) s.tiles.delete(key);
  if (!onPad(s.pos) && !s.tiles.has(tileKey(s.pos))) {
    s.falling = true;
    s.fallLeft = RESPAWN_MS;
    return s;
  }

  // Who is steering.
  let step = null;
  if (input.dir) {
    s.control = "user";
    s.sinceInput = 0;
    s.target = null;
    s.route = [];
    const len = Math.hypot(input.dir.dx, input.dir.dy) || 1;
    step = { dx: (input.dir.dx / len) * SPEED * dt, dy: (input.dir.dy / len) * SPEED * dt };
  } else {
    if (input.tapTarget) {
      s.control = "user";
      s.sinceInput = 0;
      s.target = { ...input.tapTarget };
      s.route = [];
    } else {
      s.sinceInput += ms;
      if (s.control === "user" && !s.target && s.sinceInput >= IDLE_RESUME_MS) {
        s.control = "idle";
        s.pauseLeft = 0;
        s.route = [];
      }
    }
    let goal = s.route[0] || s.target;
    if (!goal && s.control === "idle" && ctx.stations.length) {
      if (s.pauseLeft > 0) {
        s.pauseLeft -= ms;
        if (s.pauseLeft <= 0) s.idleIndex = (s.idleIndex + 1) % ctx.stations.length;
      } else if (!s.route.length) {
        goal = standPoint(ctx.stations[s.idleIndex]);
      }
    }
    if (goal) {
      const dx = goal.x - s.pos.x;
      const dy = goal.y - s.pos.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= ARRIVE) {
        if (s.route.length) s.route.shift();
        else if (s.target) s.target = null;
        else s.pauseLeft = PAUSE_MS;
      } else {
        const reach = Math.min(dist, SPEED * dt);
        step = { dx: (dx / dist) * reach, dy: (dy / dist) * reach };
      }
    }
  }

  if (step && (step.dx || step.dy)) {
    const next = clampWalls({ x: s.pos.x + step.dx, y: s.pos.y + step.dy });
    let moved = resolveCollision(s.pos, next, ctx.footprints);
    if (moved === s.pos && input.dir) {
      // Keyboard steering slides along the obstacle: try each axis on its own.
      const xOnly = clampWalls({ x: s.pos.x + step.dx, y: s.pos.y });
      const yOnly = clampWalls({ x: s.pos.x, y: s.pos.y + step.dy });
      moved = resolveCollision(s.pos, xOnly, ctx.footprints);
      if (moved === s.pos) moved = resolveCollision(s.pos, yOnly, ctx.footprints);
    }
    if (moved === s.pos && !input.dir) {
      if (!s.route.length) {
        // Walking to a goal and blocked: detour down to the open aisle, across, then on.
        const end = s.target || (s.control === "idle" && ctx.stations.length ? standPoint(ctx.stations[s.idleIndex]) : null);
        if (end) s.route = [{ x: s.pos.x, y: AISLE_Y }, { x: end.x, y: AISLE_Y }];
      } else {
        s.route = [];
        if (s.target) s.target = null; // the detour is blocked too: give up on the tap
        else s.pauseLeft = PAUSE_MS; // idle: skip to the next station after a pause
      }
    }
    const didMove = moved !== s.pos;
    s.pos = { x: moved.x, y: moved.y };
    if (didMove) {
      s.facing = facingOf(step);
      s.frameClock += ms;
      if (s.frameClock >= FRAME_MS) {
        s.frameClock = 0;
        s.frame = (s.frame % 4) + 1;
      }
      if (!onPad(s.pos)) for (const key of tilesAround(s.pos)) s.tiles.set(key, s.now);
    } else {
      s.frame = 0;
    }
  } else {
    s.frame = 0;
    s.frameClock = 0;
  }
  return s;
}
