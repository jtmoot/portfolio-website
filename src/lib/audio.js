const FILES = { pencil: "/audio/pencil.mp3", click: "/audio/click.mp3", flip: "/audio/flip.mp3" };
const MUTE_KEY = "pad.muted";
const cache = {};
const playing = new Set();
let unlocked = false;

const readMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
};
let muted = readMuted();

/** Whether the visitor has muted the page's sounds (remembered across visits). */
export const isMuted = () => muted;

/**
 * Mutes or unmutes every sound, and stops any loop that is playing.
 * @param {boolean} value
 */
export function setMuted(value) {
  muted = Boolean(value);
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    // Storage blocked: the choice still holds for this visit.
  }
  if (muted) for (const stop of [...playing]) stop();
}

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
 * Plays a short clip. A no-op before unlock, while muted, under reduced motion, or when the file is missing.
 * @param {"pencil" | "click" | "flip"} name
 * @returns {Promise<void>}
 */
export async function play(name) {
  if (!unlocked || muted || quiet() || typeof Audio === "undefined" || !FILES[name]) return;
  try {
    const clip = cache[name] || (cache[name] = new Audio(FILES[name]));
    clip.currentTime = 0;
    await clip.play();
  } catch {
    // Missing file or autoplay refusal: sound is decoration, so stay silent.
  }
}

/**
 * Loops a clip until the returned stop() is called. Before unlock, while muted, under reduced
 * motion, or without Audio, nothing plays and stop() does nothing.
 * @param {"pencil" | "click" | "flip"} name
 * @returns {() => void} stop
 */
export function loop(name) {
  if (!unlocked || muted || quiet() || typeof Audio === "undefined" || !FILES[name]) return () => {};
  let clip;
  try {
    clip = new Audio(FILES[name]);
    clip.loop = true;
    const started = clip.play();
    if (started && typeof started.catch === "function") started.catch(() => {});
  } catch {
    return () => {};
  }
  const stop = () => {
    playing.delete(stop);
    try {
      clip.pause();
    } catch {
      // Already gone: nothing to stop.
    }
  };
  playing.add(stop);
  return stop;
}
