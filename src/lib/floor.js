import { FLOOR } from "./floorView.js";

export { FLOOR };

/** Side of a walk-off tile, in floor units. */
export const TILE = 6;

/** True when the point is on Joshua's pad (the room floor). */
export const onPad = ({ x, y }) => x >= 0 && y >= 0 && x <= FLOOR.w && y <= FLOOR.h;

/** Column,row of the tile containing p. */
export const tileKey = ({ x, y }) => `${Math.floor(x / TILE)},${Math.floor(y / TILE)}`;

/** The 3 by 3 block of tile keys around p. */
export function tilesAround({ x, y }) {
  const cx = Math.floor(x / TILE);
  const cy = Math.floor(y / TILE);
  const keys = [];
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) keys.push(`${cx + i},${cy + j}`);
  return keys;
}

/** True when p is inside the footprint rectangle. */
export const collides = (p, f) => p.x > f.x && p.x < f.x + f.w && p.y > f.y && p.y < f.y + f.h;

/** The step from `from` to `to`, refused (stays at `from`) if `to` lands inside any footprint. */
export const resolveCollision = (from, to, footprints) => (footprints.some((f) => collides(to, f)) ? from : to);

/** Distance from p to a footprint's edge (0 inside). */
export function distanceTo(p, f) {
  const dx = Math.max(f.x - p.x, 0, p.x - (f.x + f.w));
  const dy = Math.max(f.y - p.y, 0, p.y - (f.y + f.h));
  return Math.hypot(dx, dy);
}

/**
 * The closest station whose footprint is within `radius` of p, or null.
 * @param {{ x: number, y: number }} p
 * @param {{ id: string, footprint: { x: number, y: number, w: number, h: number } }[]} stations
 */
export function nearestStation(p, stations, radius = 6) {
  let best = null;
  let bestD = radius;
  for (const s of stations) {
    const d = distanceTo(p, s.footprint);
    if (d <= bestD) {
      best = s;
      bestD = d;
    }
  }
  return best;
}

/** Larger is nearer the viewer: the iso floor's screen depth. */
export const depthKey = ({ x, y }) => y - x;

/** In front (10) when the feet are further forward than the footprint's back edge, else behind (1). */
export const zIndexFor = (footprintTopY, feetY) => (feetY > footprintTopY ? 10 : 1);

/**
 * True when a point on the floor is nearer the viewer than a footprint box. The camera looks in
 * from small x and large y, so a point is in front when it is past the box's front-left face
 * (x below the box) or its front-right face (y beyond the box).
 */
export const inFront = (p, f) => p.x < f.x || p.y > f.y + f.h;

const boxInFront = (a, b) => a.x + a.w <= b.x || a.y >= b.y + b.h;
const centreDepth = (f) => depthKey({ x: f.x + f.w / 2, y: f.y + f.h / 2 });

/**
 * Paint order for stations: every box comes after each box it stands in front of. Boxes with no
 * clear relation (overlapping footprints, such as a wall chart above a shelf) fall back to depth.
 * @template {{ footprint: { x: number, y: number, w: number, h: number } }} T
 * @param {T[]} boxes
 * @returns {T[]}
 */
export function stackOrder(boxes) {
  const left = [...boxes].sort((a, b) => centreDepth(a.footprint) - centreDepth(b.footprint));
  const out = [];
  while (left.length) {
    const i = left.findIndex((a) => !left.some((b) => b !== a && boxInFront(a.footprint, b.footprint)));
    out.push(left.splice(i === -1 ? 0 : i, 1)[0]);
  }
  return out;
}

/**
 * Paint order of the stations with the figure slotted in, as ids ("figure" for him). He goes
 * after every box he stands in front of and before every box he stands behind; boxes keep the
 * order stackOrder gives them among themselves.
 * @param {{ id: string, footprint: { x: number, y: number, w: number, h: number } }[]} boxes
 * @param {{ x: number, y: number }} p his feet
 * @returns {string[]}
 */
export function paintOrder(boxes, p) {
  const fig = { id: "figure" };
  // b must be drawn before a?
  const mustPrecede = (b, a) => {
    if (a === fig) return inFront(p, b.footprint);
    if (b === fig) return !inFront(p, a.footprint);
    return boxInFront(a.footprint, b.footprint);
  };
  const left = [...stackOrder(boxes), fig];
  const out = [];
  while (left.length) {
    const i = left.findIndex((a) => !left.some((b) => b !== a && mustPrecede(b, a)));
    out.push(left.splice(i === -1 ? 0 : i, 1)[0].id);
  }
  return out;
}
