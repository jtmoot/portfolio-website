import { collides } from "./floor.js";

const CELL = 2;
const MARGIN = 1.2;
/** How far off furniture he prefers to walk: cells inside this lane cost more, so routes keep clear. */
const LANE = 4;

const grow = (f, m) => ({ x: f.x - m, y: f.y - m, w: f.w + 2 * m, h: f.h + 2 * m });

/** True when the straight walk from a to b keeps clear of every (grown) footprint. */
function lineClear(a, b, boxes) {
  const n = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 0.5));
  for (let i = 1; i <= n; i++) {
    const p = { x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n };
    if (boxes.some((f) => collides(p, f))) return false;
  }
  return true;
}

/**
 * A walking route from `from` to `to` that goes round furniture: waypoints, ending at `to`.
 * A* over a 2-unit grid of the room, preferring cells a lane's width off the furniture, then
 * straightened (keeping that lane where it can) so he walks in long lines, not stairs or along edges.
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 * @param {{ x: number, y: number, w: number, h: number }[]} footprints
 * @param {{ w: number, h: number }} room
 * @returns {{ x: number, y: number }[] | null} null when `to` is inside furniture or unreachable
 */
export function findPath(from, to, footprints, room) {
  if (footprints.some((f) => collides(to, f))) return null;
  const soft = footprints.map((f) => grow(f, MARGIN / 2));
  if (lineClear(from, to, footprints)) return [{ ...to }];

  const hard = footprints.map((f) => grow(f, MARGIN));
  const lane = footprints.map((f) => grow(f, MARGIN + LANE));
  const near = footprints.map((f) => grow(f, MARGIN + LANE / 2));
  const cols = Math.ceil(room.w / CELL) + 1;
  const rows = Math.ceil(room.h / CELL) + 1;
  const centre = (i, j) => ({ x: Math.min(room.w, i * CELL), y: Math.min(room.h, j * CELL) });
  const free = (i, j) => i >= 0 && j >= 0 && i < cols && j < rows && !hard.some((f) => collides(centre(i, j), f));
  const snap = (p) => {
    const i0 = Math.round(p.x / CELL);
    const j0 = Math.round(p.y / CELL);
    for (let r = 0; r < 6; r++)
      for (let dj = -r; dj <= r; dj++)
        for (let di = -r; di <= r; di++) if (free(i0 + di, j0 + dj)) return [i0 + di, j0 + dj];
    return null;
  };
  const s = snap(from);
  const g = snap(to);
  if (!s || !g) return null;

  const key = (i, j) => j * cols + i;
  const h = (i, j) => Math.hypot(i - g[0], j - g[1]);
  const open = new Map([[key(...s), { i: s[0], j: s[1], g: 0, f: h(...s), parent: null }]]);
  const done = new Map();
  let end = null;
  while (open.size) {
    let cur = null;
    for (const n of open.values()) if (!cur || n.f < cur.f) cur = n;
    open.delete(key(cur.i, cur.j));
    done.set(key(cur.i, cur.j), cur);
    if (cur.i === g[0] && cur.j === g[1]) {
      end = cur;
      break;
    }
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const i = cur.i + di;
        const j = cur.j + dj;
        const k = key(i, j);
        if (done.has(k) || !free(i, j)) continue;
        if (di && dj && (!free(cur.i + di, cur.j) || !free(cur.i, cur.j + dj))) continue; // no corner cutting
        const c = centre(i, j);
        const crowd = near.some((f) => collides(c, f)) ? 1.6 : lane.some((f) => collides(c, f)) ? 0.6 : 0;
        const cost = cur.g + (di && dj ? Math.SQRT2 : 1) + crowd;
        const prev = open.get(k);
        if (!prev || cost < prev.g) open.set(k, { i, j, g: cost, f: cost + h(i, j), parent: cur });
      }
  }
  if (!end) return null;

  const cells = [];
  for (let n = end; n; n = n.parent) cells.unshift(centre(n.i, n.j));
  cells[cells.length - 1] = { ...to };
  // Straighten: from each point, jump to the furthest point still in plain sight.
  const route = [];
  let at = from;
  let i = 0;
  while (i < cells.length) {
    let j = cells.length - 1;
    while (j > i && !lineClear(at, cells[j], j === cells.length - 1 ? soft : lane.map((f, n) => (collides(at, f) || collides(cells[j], f) ? soft[n] : f)))) j--;
    route.push(cells[j]);
    at = cells[j];
    i = j + 1;
  }
  return route;
}
