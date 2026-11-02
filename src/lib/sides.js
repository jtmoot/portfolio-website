/** What can fill the page's side margins on wide screens; compare with ?sides=rail or ?sides=float. */
export const SIDES = ["rail", "float"];
const KEY = "pad.sides";

/**
 * Which margin variant to show: the ?sides= choice, else the one picked earlier this visit, else
 * none. ?sides=off clears it.
 * @param {string} search location.search
 * @returns {"rail" | "float" | null}
 */
export function chooseSides(search) {
  const asked = new URLSearchParams(search).get("sides");
  try {
    if (asked === "off") {
      sessionStorage.removeItem(KEY);
      return null;
    }
    if (SIDES.includes(asked)) {
      sessionStorage.setItem(KEY, asked);
      return asked;
    }
    const kept = sessionStorage.getItem(KEY);
    return SIDES.includes(kept) ? kept : null;
  } catch {
    return SIDES.includes(asked) ? asked : null;
  }
}
