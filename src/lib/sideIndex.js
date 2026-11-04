/** Where the "you are here" line sits for most of the page: a quarter of the way down the window. */
const LINE = 0.25;

/**
 * Which section the side index marks: the last whose top is above a line across the window. The
 * line sits a quarter of the way down, then slides to the bottom of the window over the last
 * screenful of scrolling, so the closing sections, which can never scroll up that far, still
 * each get their turn, and the last is marked at the bottom of the page.
 * @param {number[]} tops each section's top, in page pixels, in order
 * @param {{ scrollY: number, viewH: number, pageH: number }} view
 * @returns {number} the index into `tops`
 */
export function currentSection(tops, { scrollY, viewH, pageH }) {
  const maxScroll = Math.max(pageH - viewH, 0);
  const end = maxScroll <= 0 ? 1 : Math.min(Math.max((scrollY - (maxScroll - viewH)) / viewH, 0), 1);
  const line = scrollY + viewH * (LINE + (1 - LINE) * end);
  let current = 0;
  tops.forEach((top, i) => {
    if (top <= line) current = i;
  });
  return current;
}
