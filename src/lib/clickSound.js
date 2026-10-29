/** What counts as a press worth a click: real controls and the margin stickers. */
const PRESSABLE = 'button, a[href], [role="button"], summary, .obj-sticker';

/**
 * The sound a click on `target` should make: "click" for controls, the control's own
 * data-sound ("flip" for creative mode), or null ("none", or nothing pressable).
 * @param {Element | null} target
 * @returns {string | null}
 */
export function soundFor(target) {
  const hit = target?.closest?.(PRESSABLE);
  if (!hit) return null;
  const own = hit.getAttribute("data-sound");
  if (own === "none") return null;
  return own || "click";
}
