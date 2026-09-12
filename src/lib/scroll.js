/**
 * Single source of truth for scroll + pointer state.
 *
 * Written by ScrollTriggers in the DOM layer, read every frame by the scenes.
 * Kept as a plain mutable object so the canvas never re-renders React.
 *
 * `beat` is a continuous timeline across the page:
 *   0–1 hero, 1–2 about, 2–3 projects (4 stations), 3–4 timeline, 4–5 contact.
 */
export const scroll = {
  beat: 0,
  projects: 0,
  dim: 0,
  pointer: { x: 0, y: 0 },
};

if (import.meta.env.DEV) window.__scroll = scroll;

export const BEATS = ["hero", "about", "projects", "timeline", "contact"];
export const STATION_COUNT = 4;

/** Progress 0..1 inside a given beat index, clamped. */
export function beatProgress(index) {
  return Math.min(1, Math.max(0, scroll.beat - index));
}
