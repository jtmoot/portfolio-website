import { describe, it, expect, vi } from "vitest";
import { createModeStore } from "../../src/lib/mode.js";
import { startAmbient } from "../../src/lib/ambient.js";

/** A stand-in for audio.js: records loops and lets the test flip unlock and mute. */
const fakeSound = () => {
  const listeners = new Set();
  const state = { unlocked: true, muted: false };
  const loops = [];
  return {
    state,
    loops,
    canPlay: () => state.unlocked && !state.muted,
    loop: vi.fn((name, opts) => {
      const stop = vi.fn();
      loops.push({ name, opts, stop });
      return stop;
    }),
    onSoundChange: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    change: (patch) => {
      Object.assign(state, patch);
      listeners.forEach((fn) => fn());
    },
  };
};

describe("startAmbient", () => {
  it("plays the music in creative mode, fading in, and fades it out back on the pad", () => {
    const store = createModeStore("pad");
    const sound = fakeSound();
    startAmbient(store, sound);
    expect(sound.loop).not.toHaveBeenCalled();
    store.set("creative");
    expect(sound.loops).toHaveLength(1);
    expect(sound.loops[0]).toMatchObject({ name: "ambient", opts: { fadeIn: 2000, fadeOut: 1000 } });
    store.set("pad");
    expect(sound.loops[0].stop).toHaveBeenCalled();
    store.set("creative");
    expect(sound.loops).toHaveLength(2);
  });

  it("starts once sound unlocks or unmutes while in creative mode, and stops on mute", () => {
    const store = createModeStore("creative");
    const sound = fakeSound();
    sound.state.unlocked = false;
    startAmbient(store, sound);
    expect(sound.loop).not.toHaveBeenCalled();
    sound.change({ unlocked: true });
    expect(sound.loops).toHaveLength(1);
    sound.change({ muted: true });
    expect(sound.loops[0].stop).toHaveBeenCalled();
    sound.change({ muted: false });
    expect(sound.loops).toHaveLength(2);
  });

  it("lets go while the tab is hidden and picks up again when it is back", () => {
    const store = createModeStore("creative");
    const sound = fakeSound();
    const dispose = startAmbient(store, sound);
    const setHidden = (hidden) => {
      Object.defineProperty(document, "hidden", { value: hidden, configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    };
    setHidden(true);
    expect(sound.loops[0].stop).toHaveBeenCalled();
    setHidden(false);
    expect(sound.loops).toHaveLength(2);
    dispose();
    Object.defineProperty(document, "hidden", { value: false, configurable: true });
  });

  it("stops listening and playing when disposed", () => {
    const store = createModeStore("creative");
    const sound = fakeSound();
    const dispose = startAmbient(store, sound);
    dispose();
    expect(sound.loops[0].stop).toHaveBeenCalled();
    store.set("pad");
    store.set("creative");
    expect(sound.loops).toHaveLength(1);
  });
});
