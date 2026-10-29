const FILES = { pencil: "/audio/pencil.mp3", click: "/audio/click.mp3", flip: "/audio/flip.mp3" };
const MUTE_KEY = "pad.muted";
/** Playback volume per clip: the pencil sits quietly under the page, as on garvitsingla.in. */
const VOLUME = { pencil: 0.4, click: 0.8, flip: 0.9 };
const FADE_MS = 300;
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
  if (muted) for (const stop of [...playing]) stop({ fade: false });
}

/** Stops every looping clip with a short fade: leaving the pad for creative mode or another page. */
export function stopAll() {
  for (const stop of [...playing]) stop();
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
    clip.volume = VOLUME[name] ?? 1;
    await clip.play();
  } catch {
    // Missing file or autoplay refusal: sound is decoration, so stay silent.
  }
}

/**
 * Loops a clip until the returned stop() is called, which fades it out over FADE_MS (pass
 * { fade: false } to cut it). Before unlock, while muted, under reduced motion, or without Audio,
 * nothing plays and stop() does nothing.
 * @param {"pencil" | "click" | "flip"} name
 * @returns {() => void} stop
 */
export function loop(name) {
  if (!unlocked || muted || quiet() || typeof Audio === "undefined" || !FILES[name]) return () => {};
  let clip;
  try {
    clip = new Audio(FILES[name]);
    clip.loop = true;
    clip.volume = VOLUME[name] ?? 1;
    const started = clip.play();
    if (started && typeof started.catch === "function") started.catch(() => {});
  } catch {
    return () => {};
  }
  const halt = () => {
    try {
      clip.pause();
    } catch {
      // Already gone: nothing to stop.
    }
  };
  const stop = ({ fade = true } = {}) => {
    if (!playing.has(stop)) return;
    playing.delete(stop);
    if (!fade) return halt();
    const from = clip.volume;
    const steps = 10;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      clip.volume = Math.max(0, from * (1 - i / steps));
      if (i >= steps) {
        clearInterval(t);
        halt();
      }
    }, FADE_MS / steps);
  };
  playing.add(stop);
  return stop;
}
