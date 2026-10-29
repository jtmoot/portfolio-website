const FILES = { pencil: "/audio/pencil.wav", tick: "/audio/tick.wav" };
const cache = {};
let unlocked = false;

const quiet = () => {
  try {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
};

/** Call from the first pointerdown or keydown: browsers only allow sound after a gesture. */
export function unlock() {
  unlocked = true;
}

/**
 * Plays a short clip. A no-op before unlock, under reduced motion, or when the file is missing.
 * @param {"pencil" | "tick"} name
 * @returns {Promise<void>}
 */
export async function play(name) {
  if (!unlocked || quiet() || typeof Audio === "undefined" || !FILES[name]) return;
  try {
    const clip = cache[name] || (cache[name] = new Audio(FILES[name]));
    clip.currentTime = 0;
    await clip.play();
  } catch {
    // Missing file or autoplay refusal: sound is decoration, so stay silent.
  }
}
