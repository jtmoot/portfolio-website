import * as audio from "./audio.js";

/**
 * Quiet music under creative mode: it fades in over 2 s when the room opens (or when sound unlocks,
 * unmutes or the tab comes back while it is open) and out over 1 s when the room closes, the page
 * is muted or the tab is hidden.
 * @param {ReturnType<import("./mode.js").createModeStore>} store
 * @param {Pick<typeof audio, "canPlay" | "loop" | "onSoundChange">} [sound]
 * @returns {() => void} dispose
 */
export function startAmbient(store, sound = audio) {
  let stop = null;
  const shown = () => typeof document === "undefined" || !document.hidden;
  const sync = () => {
    const want = store.get() === "creative" && sound.canPlay() && shown();
    if (want && !stop) stop = sound.loop("ambient", { fadeIn: 2000, fadeOut: 1000 });
    else if (!want && stop) {
      stop();
      stop = null;
    }
  };
  const offMode = store.subscribe(sync);
  const offSound = sound.onSoundChange(sync);
  if (typeof document !== "undefined") document.addEventListener("visibilitychange", sync);
  sync();
  return () => {
    offMode();
    offSound();
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", sync);
    stop?.();
    stop = null;
  };
}
