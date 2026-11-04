/**
 * A tiny store for the page mode, usable with React's useSyncExternalStore.
 * @param {"pad" | "creative"} [initial]
 */
export function createModeStore(initial = "pad") {
  let mode = initial;
  const subs = new Set();
  const set = (next) => {
    if (next === mode) return;
    mode = next;
    subs.forEach((fn) => fn(mode));
  };
  return {
    get: () => mode,
    set,
    toggle: () => set(mode === "pad" ? "creative" : "pad"),
    subscribe: (fn) => {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}

let locked = false;

/** Stops the page scrolling; safe to call twice. */
export function lockScroll() {
  if (locked) return;
  locked = true;
  document.body.style.overflow = "hidden";
}

/** Lets the page scroll again; safe to call when not locked. */
export function unlockScroll() {
  locked = false;
  document.body.style.overflow = "";
}

/**
 * Scrolls to the top (if not already there) and locks scrolling.
 * @returns {number} ms the scroll will take, so the flip can wait for it
 */
export function enterCreative() {
  const y = window.scrollY || 0;
  if (y > 2) {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
    lockScroll();
    return still ? 0 : Math.min(300, 120 + y / 8);
  }
  lockScroll();
  return 0;
}

/**
 * The creative-mode toggle. Entering waits for `load` (the room's code) so the paper never tips
 * onto an empty floor; toggling again while it loads cancels; a failed load stays on the pad.
 * @param {ReturnType<typeof createModeStore>} store
 * @param {() => Promise<unknown>} load
 */
export function createModeController(store, load) {
  let ticket = 0;
  let loading = false;
  return {
    get loading() {
      return loading;
    },
    toggle() {
      ticket++;
      if (store.get() === "creative" || loading) {
        loading = false;
        store.set("pad");
        return Promise.resolve();
      }
      const mine = ticket;
      loading = true;
      return Promise.resolve()
        .then(load)
        .then(
          () => {
            if (mine === ticket) store.set("creative");
          },
          () => {},
        )
        .finally(() => {
          if (mine === ticket) loading = false;
        });
    },
  };
}
