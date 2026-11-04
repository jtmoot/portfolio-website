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
 * (x below the box) or its front-right face (y beyond the box). A box marked `open: "+x"` (the
 * reading chair's front layer: its seat opens toward +x, away from the camera) also counts a point
 * past that side as in front, so he stays whole while he walks up to the seat and only goes behind
 * the chair's back and near arm once he is in it.
 */
export const inFront = (p, f) => p.x < f.x || p.y > f.y + f.h || (f.open === "+x" && p.x >= f.x + f.w);

/**
 * True when box a is nearer the viewer than box b: entirely before it in x, or past it in y. A flat
 * box (a mat, the gym's tiles) lies under everything, so it is never in front and always behind.
 */
const boxInFront = (a, b) => !a.flat && (Boolean(b.flat) || a.footprint.x + a.footprint.w <= b.footprint.x || a.footprint.y >= b.footprint.y + b.footprint.h);
const centreDepth = (f) => depthKey({ x: f.x + f.w / 2, y: f.y + f.h / 2 });

/**
 * Paint order for stations: every box comes after each box it stands in front of. Boxes with no
 * clear relation (overlapping footprints, such as a wall chart above a shelf) fall back to depth.
 * @template {{ footprint: { x: number, y: number, w: number, h: number }, flat?: boolean }} T
 * @param {T[]} boxes
 * @returns {T[]}
 */
export function stackOrder(boxes) {
  const left = [...boxes].sort((a, b) => centreDepth(a.footprint) - centreDepth(b.footprint));
  const out = [];
  while (left.length) {
    const i = left.findIndex((a) => !left.some((b) => b !== a && boxInFront(a, b)));
    out.push(left.splice(i === -1 ? 0 : i, 1)[0]);
  }
  return out;
}

/** Half the width he is drawn at, in floor units along the screen's x axis (where x + y is constant). */
export const HALF_WIDTH = 6.5;

/** How many of his screen columns a box's drawing can share (floor units along x + y); 0 or less when none. */
const covered = (p, f) => {
  const s = p.x + p.y;
  return Math.min(f.x + f.w + f.y + f.h, s + HALF_WIDTH) - Math.max(f.x + f.y, s - HALF_WIDTH);
};

/** True when a box's drawing can share screen columns with his: its footprint spans x + y near his feet's. */
export const overlaps = (p, f) => covered(p, f) > 0;

/**
 * Paint order of the stations with the figure slotted in, as ids ("figure" for him). The boxes
 * keep the order stackOrder gives them; he goes after the last box he stands in front of and
 * before the first box he stands behind (a flat box is always under him), counting only boxes
 * that can overlap him on screen. The pairwise rule is approximate off a box's corners, and a
 * box that cannot touch him (the reading chair, from the kitchen; the rack, from just past the
 * end of its bar) used to demand an order that contradicted the ones that could, which drew him
 * over the rack he was walking behind.
 * @param {{ id: string, footprint: { x: number, y: number, w: number, h: number }, flat?: boolean }[]} boxes
 * @param {{ x: number, y: number }} p his feet
 * @returns {string[]}
 */
export function paintOrder(boxes, p) {
  const order = stackOrder(boxes);
  // Each box that can touch him asks for a side: in front of him (drawn before him) or behind.
  const wants = [];
  order.forEach((b, i) => {
    const c = covered(p, b.footprint);
    if (c > 0) wants.push({ i, c, front: Boolean(b.flat) || inFront(p, b.footprint) });
  });
  // His slot is the one that disappoints the least of him: when boxes disagree (the pairwise
  // rule is approximate off their corners), the sliver of a table's corner gives way to the
  // chair he is walking up to. Ties go to the later slot.
  let slot = order.length;
  let least = Infinity;
  for (let k = order.length; k >= 0; k--) {
    let cost = 0;
    for (const w of wants) if (w.front ? w.i >= k : w.i < k) cost += w.c;
    if (cost < least) {
      least = cost;
      slot = k;
    }
  }
  const ids = order.map((b) => b.id);
  ids.splice(slot, 0, "figure");
  return ids;
}
