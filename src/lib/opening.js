/** How long the polaroid takes to appear in the middle and float left into place; the name starts as it lands. */
export const ARRIVE_MS = 1100;

/** The longest the opening waits on the portrait before starting without it. */
export const READY_CAP_MS = 1500;

/** The average gap between letters of the name, in ms. */
export const STEP_MS = 55;

/** A small seeded generator, so the "uneven" rhythm is the same on every load. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * When each letter of `text` appears, like a person typing: uneven gaps, a beat between words and
 * a touch longer for a capital (the shift key).
 * @param {string} text
 * @param {{ step?: number, seed?: number }} [o]
 * @returns {number[]} ms from the start, one per character, increasing
 */
export function typingRhythm(text, { step = STEP_MS, seed = 7 } = {}) {
  const rand = mulberry32(seed);
  const times = [];
  let t = 0;
  [...text].forEach((ch, i) => {
    let gap = step * (0.6 + 0.75 * rand());
    if (ch === " ") gap = step * 0.7;
    else if (text[i - 1] === " ") gap += step * 1.3;
    if (ch !== ch.toLowerCase()) gap += 25;
    t += gap;
    times.push(Math.round(t));
  });
  return times;
}

/**
 * The opening after the name: the role fades in as the name finishes, the intro's paragraphs fade
 * in as one block, its highlights sweep in one after another while that fade is still running
 * (the first 100 ms in, as on garvitsingla.in), and the links come once both are done.
 * @param {number} nameMs when the name is finished
 * @param {number} markCount how many highlights the intro has
 * @returns {{ role: number, intro: number, marks: number, markGap: number, socials: number }} ms
 */
export function openingTimes(nameMs, markCount) {
  const markGap = 150;
  const role = nameMs - 100;
  const intro = role + 200;
  const marks = intro + 100;
  // After the 0.7 s fade, and after the last highlight's 0.6 s sweep is mostly drawn.
  const socials = Math.max(intro + 900, marks + Math.max(markCount - 1, 0) * markGap + 450);
  return { role, intro, marks, markGap, socials };
}
