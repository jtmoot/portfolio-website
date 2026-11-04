/**
 * The creative-mode camera: a screen-space pan (cqw) that follows the figure through a room bigger
 * than the screen. All rects are { left, top, right, bottom } in the floor layer's own cqw, before
 * the pan; a point p shows on screen at p + pan, and is visible when that lands inside `view`.
 */

/** The dead zone's inset from each edge of the view, as a fraction of its size. The bottom inset
 * is deeper so the station card under his label stays on screen. */
const INSET = { x: 0.28, top: 0.22, bottom: 0.38 };
const RATE = 5;

/** The middle of the view: while the figure stays inside it, the camera does not move. */
export function deadZone(view) {
  const w = view.right - view.left;
  const h = view.bottom - view.top;
  return { left: view.left + w * INSET.x, right: view.right - w * INSET.x, top: view.top + h * INSET.top, bottom: view.bottom - h * INSET.bottom };
}

const inside = (p, r) => p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;

/** The pan range on one axis that keeps [lo, hi] covering [vLo, vHi]; centred when it cannot. */
function clampAxis(want, lo, hi, vLo, vHi) {
  if (hi - lo <= vHi - vLo) return (vLo + vHi) / 2 - (lo + hi) / 2;
  return Math.min(vLo - lo, Math.max(vHi - hi, want));
}

/** Where the scene is allowed to scroll to: the room, plus room around him once he walks off it. */
function limits(scene, view, fig) {
  if (!fig || inside(fig, scene)) return scene;
  const hw = (view.right - view.left) / 2;
  const hh = (view.bottom - view.top) / 2;
  return {
    left: Math.min(scene.left, fig.x - hw),
    right: Math.max(scene.right, fig.x + hw),
    top: Math.min(scene.top, fig.y - hh),
    bottom: Math.max(scene.bottom, fig.y + hh),
  };
}

/**
 * The pan that centres p, kept within the room.
 * @param {{ x: number, y: number }} p
 */
export function centreOn(p, scene, view) {
  const want = { x: (view.left + view.right) / 2 - p.x, y: (view.top + view.bottom) / 2 - p.y };
  return {
    x: clampAxis(want.x, scene.left, scene.right, view.left, view.right),
    y: clampAxis(want.y, scene.top, scene.bottom, view.top, view.bottom),
  };
}

/**
 * One frame of the follow camera.
 * @param {{ x: number, y: number }} pan current pan
 * @param {{ fig: { x: number, y: number }, scene: object, view: object, dt: number, still?: boolean }} o
 *   fig: the figure's screen point before the pan; still: reduced motion, so jump instead of easing
 */
export function stepCamera(pan, { fig, scene, view, dt, still = false }) {
  const dz = deadZone(view);
  const s = { x: fig.x + pan.x, y: fig.y + pan.y };
  const want = { ...pan };
  if (s.x < dz.left) want.x = dz.left - fig.x;
  else if (s.x > dz.right) want.x = dz.right - fig.x;
  if (s.y < dz.top) want.y = dz.top - fig.y;
  else if (s.y > dz.bottom) want.y = dz.bottom - fig.y;
  const b = limits(scene, view, fig);
  const goal = {
    x: clampAxis(want.x, b.left, b.right, view.left, view.right),
    y: clampAxis(want.y, b.top, b.bottom, view.top, view.bottom),
  };
  const k = still ? 1 : 1 - Math.exp(-dt * RATE);
  return { x: pan.x + (goal.x - pan.x) * k, y: pan.y + (goal.y - pan.y) * k };
}
