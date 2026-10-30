import { describe, it, expect, vi, beforeEach } from "vitest";

describe("audio", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("plays nothing before the first gesture unlocks it", async () => {
    const ctor = vi.fn();
    vi.stubGlobal("Audio", ctor);
    const audio = await import("../../src/lib/audio.js");
    await expect(audio.play("click")).resolves.toBeUndefined();
    expect(ctor).not.toHaveBeenCalled();
  });

  it("plays after unlock and swallows a rejected play()", async () => {
    const play = vi.fn(() => Promise.reject(new Error("blocked")));
    const ctor = vi.fn(function Fake() {
      this.play = play;
      this.currentTime = 0;
    });
    vi.stubGlobal("Audio", ctor);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    await expect(audio.play("typing")).resolves.toBeUndefined();
    expect(play).toHaveBeenCalled();
  });

  it("stays silent under reduced motion", async () => {
    const ctor = vi.fn();
    vi.stubGlobal("Audio", ctor);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    await audio.play("click");
    expect(ctor).not.toHaveBeenCalled();
  });
});

describe("audio loop", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("loops a clip until stopped", async () => {
    vi.useFakeTimers();
    const clip = { play: vi.fn(() => Promise.resolve()), pause: vi.fn(), currentTime: 0, loop: false, volume: 1 };
    vi.stubGlobal("Audio", vi.fn(function Fake() { return clip; }));
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    const stop = audio.loop("typing");
    expect(clip.loop).toBe(true);
    expect(clip.play).toHaveBeenCalled();
    stop();
    vi.advanceTimersByTime(400);
    expect(clip.pause).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("returns a harmless stop before unlock", async () => {
    const ctor = vi.fn();
    vi.stubGlobal("Audio", ctor);
    const audio = await import("../../src/lib/audio.js");
    const stop = audio.loop("typing");
    expect(() => stop()).not.toThrow();
    expect(ctor).not.toHaveBeenCalled();
  });
});

describe("audio files and mute", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  const live = async () => {
    const clips = [];
    vi.stubGlobal("Audio", vi.fn(function Fake(src) {
      const clip = { src, play: vi.fn(() => Promise.resolve()), pause: vi.fn(), currentTime: 0, loop: false };
      clips.push(clip);
      return clip;
    }));
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    return { audio, clips };
  };

  it("serves the recorded clips: typing, click and flip", async () => {
    const { audio, clips } = await live();
    await audio.play("typing");
    await audio.play("click");
    await audio.play("flip");
    expect(clips.map((c) => c.src)).toEqual(["/audio/typing.mp3", "/audio/click.mp3", "/audio/flip.mp3"]);
  });

  it("is unmuted by default and remembers a mute across visits", async () => {
    const { audio } = await live();
    expect(audio.isMuted()).toBe(false);
    audio.setMuted(true);
    expect(localStorage.getItem("pad.muted")).toBe("1");
    vi.resetModules();
    const again = await import("../../src/lib/audio.js");
    expect(again.isMuted()).toBe(true);
  });

  it("plays and loops nothing while muted", async () => {
    const { audio, clips } = await live();
    audio.setMuted(true);
    await audio.play("click");
    const stop = audio.loop("typing");
    expect(clips).toHaveLength(0);
    expect(() => stop()).not.toThrow();
  });

  it("muting stops a loop that is already playing", async () => {
    const { audio, clips } = await live();
    audio.loop("typing");
    audio.setMuted(true);
    expect(clips[0].pause).toHaveBeenCalled();
  });

  it("survives storage that throws", async () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } });
    const { audio } = await live();
    expect(audio.isMuted()).toBe(false);
    expect(() => audio.setMuted(true)).not.toThrow();
    expect(audio.isMuted()).toBe(true);
  });
});

describe("audio, the typing sound", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    localStorage.clear();
    vi.useFakeTimers();
  });

  const live = async () => {
    const clips = [];
    vi.stubGlobal("Audio", vi.fn(function Fake(src) {
      const clip = { src, play: vi.fn(() => Promise.resolve()), pause: vi.fn(), currentTime: 0, loop: false, volume: 1 };
      clips.push(clip);
      return clip;
    }));
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    return { audio, clips };
  };

  it("plays the typing quietly, at 0.5, and fades it out when stopped", async () => {
    const { audio, clips } = await live();
    const stop = audio.loop("typing");
    expect(clips[0].volume).toBeCloseTo(0.5, 5);
    stop();
    expect(clips[0].pause).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(clips[0].volume).toBeLessThan(0.05);
    expect(clips[0].pause).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("stopAll silences every loop (leaving the pad for creative mode)", async () => {
    const { audio, clips } = await live();
    audio.loop("typing");
    audio.stopAll();
    vi.advanceTimersByTime(400);
    expect(clips[0].pause).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
