export const CARD = { w: 240, h: 150 };
const INSET = 12;
const GAP = 18;

/**
 * Places the hover preview above the pointer, centred, then clamps it inside the viewport.
 * @param {{ x: number, y: number }} pointer viewport px
 * @param {{ w: number, h: number }} card
 * @param {{ w: number, h: number }} viewport
 * @returns {{ left: number, top: number }}
 */
export function clampPreview({ x, y }, card = CARD, viewport) {
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  let top = y - card.h - GAP;
  if (top < INSET) top = y + GAP; // no room above: drop below the pointer
  return {
    left: clamp(x - card.w / 2, INSET, viewport.w - card.w - INSET),
    top: clamp(top, INSET, viewport.h - card.h - INSET),
  };
}
