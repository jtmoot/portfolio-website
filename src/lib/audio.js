const FILES = { typing: "/audio/typing.mp3", click: "/audio/click.mp3", flip: "/audio/flip.mp3", ambient: "/audio/ambient.mp3" };
const MUTE_KEY = "pad.muted";
/** Playback volume per clip: the typing is clear but under the clicks, the creative-mode music far lower. */
const VOLUME = { typing: 0.75, click: 0.8, flip: 0.9, ambient: 0.14 };
const FADE_MS = 300;
const cache = {};
const playing = new Set();
const listeners = new Set();
let unlocked = false;

const changed = () => listeners.forEach((fn) => fn());

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
 * Calls `fn` whenever sound unlocks or the mute changes; returns the unsubscribe.
 * @param {() => void} fn
 */
export function onSoundChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

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
  changed();
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
  if (unlocked) return;
  unlocked = true;
  changed();
}

const able = () => unlocked && !muted && !quiet() && typeof Audio !== "undefined";

/** Whether a sound would play right now: unlocked, unmuted, motion allowed, Audio present. */
export const canPlay = () => able();

/**
 * Plays a short clip. A no-op before unlock, while muted, under reduced motion, or when the file is missing.
 * With `delay` it starts that many ms later, and stays quiet if sound was muted meanwhile.
 * @param {"typing" | "click" | "flip"} name
 * @param {{ delay?: number }} [options]
 * @returns {Promise<void>}
 */
export async function play(name, { delay = 0 } = {}) {
  if (!able() || !FILES[name]) return;
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (!able()) return;
  }
  try {
    const clip = cache[name] || (cache[name] = new Audio(FILES[name]));
    clip.currentTime = 0;
    clip.volume = VOLUME[name] ?? 1;
    await clip.play();
  } catch {
    // Missing file or autoplay refusal: sound is decoration, so stay silent.
  }
}

/** Steps a clip's volume from where it is to `to` over `ms`, then calls `done`; returns a cancel. */
function ramp(clip, to, ms, done = () => {}) {
  const from = clip.volume;
  const steps = Math.max(1, Math.round(ms / 30));
  let i = 0;
  const t = setInterval(() => {
    i += 1;
    clip.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
    if (i >= steps) {
      clearInterval(t);
      done();
    }
  }, ms / steps);
  return () => clearInterval(t);
}

/**
 * Loops a clip until the returned stop() is called, which fades it out over `fadeOut` ms (pass
 * { fade: false } to cut it). With `fadeIn` it rises from silence. Before unlock, while muted, under
 * reduced motion, or without Audio, nothing plays and stop() does nothing.
 * @param {"typing" | "click" | "flip" | "ambient"} name
 * @param {{ fadeIn?: number, fadeOut?: number }} [options]
 * @returns {(options?: { fade?: boolean }) => void} stop
 */
export function loop(name, { fadeIn = 0, fadeOut = FADE_MS } = {}) {
  if (!able() || !FILES[name]) return () => {};
  let clip;
  let rising = () => {};
  try {
    clip = new Audio(FILES[name]);
    clip.loop = true;
    clip.volume = fadeIn > 0 ? 0 : VOLUME[name] ?? 1;
    const started = clip.play();
    if (started && typeof started.catch === "function") started.catch(() => {});
    if (fadeIn > 0) rising = ramp(clip, VOLUME[name] ?? 1, fadeIn);
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
    rising();
    if (!fade) return halt();
    ramp(clip, 0, fadeOut, halt);
  };
  playing.add(stop);
  return stop;
}
