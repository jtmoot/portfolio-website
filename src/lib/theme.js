const KEY = "theme";

/** @returns {"day" | "night"} */
export function getTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "day" || saved === "night") return saved;
  } catch {
    // Storage unavailable (private mode): fall through to the default.
  }
  return "day";
}

/** @param {"day" | "night"} theme */
export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage unavailable: the theme still applies for this visit.
  }
}

/** @returns {"day" | "night"} the new theme */
export function toggleTheme() {
  const next = (document.documentElement.dataset.theme || getTheme()) === "night" ? "day" : "night";
  setTheme(next);
  return next;
}
