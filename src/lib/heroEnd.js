/**
 * Keeps --hero-end on the sheet at the hero's bottom edge (px from the poster's top), so the body can
 * start below the hero however large the browser draws its text. Returns a function that stops it.
 * @param {HTMLElement | null} hero
 * @returns {() => void}
 */
export function trackHeroEnd(hero) {
  const sheet = hero?.closest?.(".sheet");
  if (!sheet || typeof ResizeObserver === "undefined") return () => {};
  const write = () => sheet.style.setProperty("--hero-end", `${hero.offsetTop + hero.offsetHeight}px`);
  const observer = new ResizeObserver(write);
  observer.observe(hero);
  write();
  return () => observer.disconnect();
}
