/**
 * The type pairings being compared with ?font=<name>: the first three from round 5, then six more
 * formal heading faces (Brygada 1918, Bona Nova, Besley, Gloock, Castoro, Bodoni Moda), each over
 * the same Geist body.
 */
export const FONTS = ["serif", "sans", "plex", "brygada", "bona", "besley", "gloock", "castoro", "bodoni"];
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
