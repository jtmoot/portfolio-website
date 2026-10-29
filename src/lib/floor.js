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
