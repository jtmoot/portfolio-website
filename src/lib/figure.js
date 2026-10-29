import { onPad, tileKey, tilesAround, resolveCollision, FLOOR } from "./floor.js";
import { findPath } from "./path.js";

/** Floor units per second at 1x on the speed wheel: round 1's 2x (0.9 m/s, a brisk walk). */
export const SPEED = 18;
export const IDLE_RESUME_MS = 6000;
export const PAUSE_MS = 4000;
export const TILE_FADE_MS = 4000;
export const RESPAWN_MS = 1000;
/** Frames in each gait cycle (w1..w6 walking, j1..j6 jogging). */
export const GAIT_FRAMES = 6;
/** Floor units walked per frame: the frames advance with distance, so the feet keep pace with the ground. */
export const WALK_STEP = 2.4;
export const JOG_STEP = 3.6;
/** Speed-wheel multiplier from which he jogs instead of walking. */
export const JOG_AT = 1.4;

/**
 * The sprite frame to show: an action pose, a walk or jog frame, or idle.
 * @param {{ pose?: string | null, frame: number, gait?: "w" | "j" }} s
 */
export const frameName = (s) => s.pose || (s.frame ? `${s.gait || "w"}${s.frame}` : "idle");
/** How long he waves at the screen when the room opens. */
export const GREET_MS = 3800;
const WAVE_MS = 320;

/**
 * What he does at each station during the stop, as sprite poses (f-{facing}-{pose}) and their
 * durations. `facing` is the one direction those poses are drawn for: towards the station.
 * Looping actions repeat for the whole stop; the rest play once and hold their last frame.
 */
export const ACTIONS = {
  desk: { facing: "ul", loop: true, frames: [["type1", 260], ["type2", 260]] },
  library: { facing: "ul", frames: [["book1", 700], ["book2", 1300], ["book3", 450], ["book2", 900], ["book1", 550]] },
  kitchen: { facing: "ur", frames: [["cook1", 700], ["cook2", 260], ["cook3", 260], ["cook2", 260], ["cook3", 260], ["cook2", 260], ["cook1", 900]] },
  plants: { facing: "ul", frames: [["water1", 600], ["water2", 380], ["water3", 380], ["water2", 380], ["water3", 380], ["water2", 380], ["water3", 380], ["water1", 600]] },
  chess: { facing: "dr", over: true, frames: [["chess1", 900], ["chess2", 1500], ["chess3", 1100]] },
  gym: { facing: "dr", loop: true, frames: [["kb1", 380], ["kb2", 160], ["kb3", 420], ["kb2", 160]] },
};

/**
 * Poses whose reaching arm is drawn on its own layer (f-{facing}-{pose}-over) above the station:
 * at the chess table he stands behind it, so the table hides his legs but not his arm on the board.
 */
export const OVER_POSES = new Set(Object.values(ACTIONS).flatMap((a) => (a.over ? a.frames.map(([n]) => n) : [])));

/**
 * The pose for a station's action, t ms into the stop; null for stations with no action.
 * @param {string} id
 * @param {number} t
 */
export function poseAt(id, t) {
  const a = ACTIONS[id];
  if (!a) return null;
  const total = a.frames.reduce((sum, [, ms]) => sum + ms, 0);
  let at = a.loop ? ((t % total) + total) % total : Math.min(t, total - 1);
  for (const [name, ms] of a.frames) {
    if (at < ms) return name;
    at -= ms;
  }
  return a.frames.at(-1)[0];
}
const ARRIVE = 0.02;
const RESPAWN_FALLBACK = { x: 54, y: 26 };

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

/**
 * @param {{ x: number, y: number }} start
 * @param {{ greet?: boolean }} [opts] greet: wave at the screen before setting off (off under reduced motion)
 */
export function initialFigure(start, { greet = true } = {}) {
  return {
    greeting: greet,
    greetLeft: greet ? GREET_MS : 0,
    pose: greet ? "wave1" : null,
    pos: { ...start },
    facing: "dr",
    frame: 0,
    gait: "w",
    stepDist: 0,
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

/** The screen facing that looks from p towards the middle of a footprint. */
const facingToward = (p, f) => facingOf({ dx: f.x + f.w / 2 - p.x, dy: f.y + f.h / 2 - p.y });

/** The point just in front of a station, where the idle walk stops. */
export function standPoint(station) {
  if (station.standAt) return { ...station.standAt };
  const f = station.footprint;
  return { x: f.x + f.w / 2, y: Math.min(FLOOR.h - 1, f.y + f.h + 2) };
}

/** Back walls block: no walking past y = 0 or x = FLOOR.w. The open front edges do not. */
const clampWalls = (p) => ({ x: Math.min(p.x, FLOOR.w), y: Math.max(p.y, 0) });

/**
 * Advances the figure by dt seconds. Pure: returns a new state.
 * @param {ReturnType<typeof initialFigure>} state
 * @param {{ dir: { dx: number, dy: number } | null, tapTarget: { x: number, y: number } | null, hold?: boolean, dt?: number }} input
 *   hold: a station card is open, so the idle tour waits where it is (the keyboard still steers)
 * @param {{ stations: { id: string, footprint: object }[], footprints: object[], respawn?: { x: number, y: number }, speed?: number }} ctx
 *   stations: the idle tour (empty to stay put); respawn: where he reappears after a fall;
 *   speed: walk-speed multiplier from the speed wheel (default 1)
 * @param {number} [dtArg] seconds
 */
export function stepFigure(state, input, ctx, dtArg) {
  const dt = input.dt ?? dtArg ?? 1 / 60;
  const ms = dt * 1000;
  const speed = SPEED * (ctx.speed ?? 1);
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

  // The hello: he faces the screen and waves until the greeting ends or someone steers.
  if (s.greeting) {
    if (input.dir || input.tapTarget) {
      s.greeting = false;
      s.greetLeft = 0;
      s.pose = null;
    } else {
      s.greetLeft -= ms;
      s.facing = "dr";
      s.frame = 0;
      s.pose = Math.floor((GREET_MS - s.greetLeft) / WAVE_MS) % 2 ? "wave2" : "wave1";
      if (s.greetLeft <= 0) {
        s.greeting = false;
        s.pose = null;
      }
      return s;
    }
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
    step = { dx: (input.dir.dx / len) * speed * dt, dy: (input.dir.dy / len) * speed * dt };
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
    const holding = input.hold && s.control === "idle";
    let goal = holding ? null : s.route[0] || s.target;
    if (!goal && s.control === "idle" && ctx.stations.length && s.pauseLeft > 0) {
      // At a station: face it and do its little action. An open card (hold) keeps him there,
      // still at it; he moves on once the stop is over and nothing holds him.
      const st = ctx.stations[s.idleIndex];
      s.facing = ACTIONS[st.id]?.facing ?? facingToward(s.pos, st.footprint);
      s.actT = (s.actT || 0) + ms;
      s.pose = poseAt(st.id, s.actT);
      s.pauseLeft = Math.max(holding ? 1 : 0, s.pauseLeft - ms);
      if (s.pauseLeft <= 0) {
        s.idleIndex = (s.idleIndex + 1) % ctx.stations.length;
        s.pose = null;
        s.actT = 0;
      }
    } else if (!goal && !holding && s.control === "idle" && ctx.stations.length && !s.route.length) {
      goal = standPoint(ctx.stations[s.idleIndex]);
    }
    if (goal) {
      const dx = goal.x - s.pos.x;
      const dy = goal.y - s.pos.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= ARRIVE) {
        if (s.route.length) s.route.shift();
        else if (s.target) {
          // A tap on a station: once there, do its action, then pick the tour up from it.
          const at = ctx.stations.findIndex((st) => Math.hypot(standPoint(st).x - s.target.x, standPoint(st).y - s.target.y) < 0.5);
          s.target = null;
          if (at >= 0) {
            s.control = "idle";
            s.idleIndex = at;
            s.pauseLeft = PAUSE_MS;
            s.actT = 0;
          }
        } else {
          s.pauseLeft = PAUSE_MS;
          s.actT = 0;
        }
      } else {
        const reach = Math.min(dist, speed * dt);
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
        // Walking to a goal and blocked: find a way round the furniture.
        const end = s.target || (s.control === "idle" && ctx.stations.length ? standPoint(ctx.stations[s.idleIndex]) : null);
        const route = end ? findPath(s.pos, end, ctx.footprints, FLOOR) : null;
        if (route) s.route = route;
        else if (s.target) s.target = null;
        else s.pauseLeft = PAUSE_MS;
      } else {
        s.route = [];
        if (s.target) s.target = null; // the detour is blocked too: give up on the tap
        else s.pauseLeft = PAUSE_MS; // idle: skip to the next station after a pause
      }
    }
    const didMove = moved !== s.pos;
    const walked = Math.hypot(moved.x - s.pos.x, moved.y - s.pos.y);
    s.pos = { x: moved.x, y: moved.y };
    if (didMove) {
      s.pose = null;
      s.facing = facingOf(step);
      const gait = (ctx.speed ?? 1) >= JOG_AT ? "j" : "w";
      if (gait !== s.gait) s.stepDist = 0;
      s.gait = gait;
      if (!s.frame) s.frame = 1;
      s.stepDist += walked;
      const per = gait === "j" ? JOG_STEP : WALK_STEP;
      while (s.stepDist >= per) {
        s.stepDist -= per;
        s.frame = (s.frame % GAIT_FRAMES) + 1;
      }
      if (!onPad(s.pos)) for (const key of tilesAround(s.pos)) s.tiles.set(key, s.now);
    } else {
      s.frame = 0;
    }
  } else {
    s.frame = 0;
    s.stepDist = 0;
  }
  return s;
}
