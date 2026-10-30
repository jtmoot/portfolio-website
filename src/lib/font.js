/** The type pairings being compared; compare them with ?font=serif, ?font=sans or ?font=plex. */
export const FONTS = ["serif", "sans", "plex"];
const KEY = "pad.font";

/**
 * Which pairing to show: the ?font= choice, else the one picked earlier this visit, else serif.
 * @param {string} search location.search
 * @returns {string}
 */
export function chooseFont(search) {
  const asked = new URLSearchParams(search).get("font");
  try {
    if (FONTS.includes(asked)) {
      sessionStorage.setItem(KEY, asked);
      return asked;
    }
    const kept = sessionStorage.getItem(KEY);
    return FONTS.includes(kept) ? kept : FONTS[0];
  } catch {
    return FONTS.includes(asked) ? asked : FONTS[0];
  }
}
