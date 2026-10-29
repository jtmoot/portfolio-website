/**
 * The room's floor, in floor units (cqw of the poster box; 1 unit = 5 cm). The poster, 100 by 78,
 * is the front-left part of it; in creative mode the paper grows out to the whole room.
 */
export const FLOOR = { w: 130, h: 100 };
export const POSTER = { w: 100, h: 78 };
/** The room the view's scale is fitted to: the original one, so drawings keep today's size. */
const REF = POSTER;
/** Height of the back walls in floor units (230 cm). */
const WALL = 46;

/** Spec 5.1 view: true isometric (tilt 54.7, spin -45), scaled and dropped a little. */
export const VIEW = { scale: 0.62, tilt: 54.7, spin: -45, drop: 6 };

const ORIGIN = { x: POSTER.w / 2, y: POSTER.h / 2 };
const RAD = Math.PI / 180;

/** Height of the drawn scene in cqw per unit of scale: the floor diamond plus 230 cm walls. */
const SCENE_PER_SCALE = 2 * ((REF.w + REF.h) / 2) * Math.SQRT1_2 * Math.cos(54.7 * RAD) + WALL * 0.8165;
/** Distance from the floor centre up to the top of the walls, per unit of scale. */
const TOP_PER_SCALE = ((REF.w + REF.h) / 2) * Math.SQRT1_2 * Math.cos(54.7 * RAD) + WALL * 0.8165;
const NAV_CQW = 5.5;

/**
 * The CSS transform for the poster in creative mode. Its origin is the poster centre.
 * @param {typeof VIEW} v
 */
export function padTransform(v) {
  return `translateY(${round(v.drop)}cqw) scale(${round(v.scale)}) rotateX(${v.tilt}deg) rotateZ(${v.spin}deg)`;
}

/**
 * Projects a floor point through the same transform, into cqw of the (untransformed) poster box.
 * @param {{ x: number, y: number }} p floor units
 * @param {typeof VIEW} [v]
 * @returns {{ left: number, top: number }}
 */
export function floorToScreen({ x, y }, v = VIEW) {
  const dx = x - ORIGIN.x;
  const dy = y - ORIGIN.y;
  const c = Math.cos(v.spin * RAD);
  const s = Math.sin(v.spin * RAD);
  const rx = dx * c - dy * s;
  const ry = dx * s + dy * c;
  return {
    left: ORIGIN.x + v.scale * rx,
    top: ORIGIN.y + v.drop + v.scale * ry * Math.cos(v.tilt * RAD),
  };
}

/**
 * Inverse of floorToScreen, for taps.
 * @param {{ left: number, top: number }} p cqw of the poster box
 * @param {typeof VIEW} [v]
 * @returns {{ x: number, y: number }}
 */
export function screenToFloor({ left, top }, v = VIEW) {
  const rx = (left - ORIGIN.x) / v.scale;
  const ry = (top - ORIGIN.y - v.drop) / (v.scale * Math.cos(v.tilt * RAD));
  const c = Math.cos(v.spin * RAD);
  const s = Math.sin(v.spin * RAD);
  return { x: ORIGIN.x + rx * c + ry * s, y: ORIGIN.y - rx * s + ry * c };
}

/**
 * Fits the view to a viewport: shrinks the scale when the scene would not fit under the nav,
 * and drops the floor so the walls start just below the nav.
 * @param {{ w: number, h: number }} viewport px
 */
export function fitView({ w, h }) {
  const cqw = Math.min(w, 1512) / 100;
  const avail = h / cqw - NAV_CQW - 1.5;
  // Narrow screens have height to spare, and the camera pans: draw the room bigger there.
  const cap = w < 820 ? 1 : VIEW.scale;
  const scale = Math.min(cap, avail / SCENE_PER_SCALE);
  const spare = Math.max(0, avail - SCENE_PER_SCALE * scale);
  const top = NAV_CQW + spare / 2;
  const drop = top - ORIGIN.y + TOP_PER_SCALE * scale;
  return { ...VIEW, scale: round(scale), drop: round(drop) };
}

/**
 * The drawn room's bounding box in cqw of the poster box (before any camera pan): the floor and
 * the tops of the two back walls, with a little margin.
 * @param {typeof VIEW} v
 */
export function sceneBounds(v) {
  const lift = WALL * 0.8165 * v.scale;
  const floor = [[0, 0], [FLOOR.w, 0], [FLOOR.w, FLOOR.h], [0, FLOOR.h]].map(([x, y]) => floorToScreen({ x, y }, v));
  const walls = [[0, 0], [FLOOR.w, 0], [FLOOR.w, FLOOR.h]].map(([x, y]) => {
    const p = floorToScreen({ x, y }, v);
    return { left: p.left, top: p.top - lift };
  });
  const all = [...floor, ...walls];
  const pad = 2;
  return {
    left: Math.min(...all.map((p) => p.left)) - pad,
    right: Math.max(...all.map((p) => p.left)) + pad,
    top: Math.min(...all.map((p) => p.top)) - pad,
    bottom: Math.max(...all.map((p) => p.top)) + pad,
  };
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}
