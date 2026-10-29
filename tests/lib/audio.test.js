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
    await expect(audio.play("tick")).resolves.toBeUndefined();
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
    await expect(audio.play("pencil")).resolves.toBeUndefined();
    expect(play).toHaveBeenCalled();
  });

  it("stays silent under reduced motion", async () => {
    const ctor = vi.fn();
    vi.stubGlobal("Audio", ctor);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    await audio.play("tick");
    expect(ctor).not.toHaveBeenCalled();
  });
});

describe("audio loop", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("loops a clip until stopped", async () => {
    const clip = { play: vi.fn(() => Promise.resolve()), pause: vi.fn(), currentTime: 0, loop: false };
    vi.stubGlobal("Audio", vi.fn(function Fake() { return clip; }));
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    const stop = audio.loop("pencil");
    expect(clip.loop).toBe(true);
    expect(clip.play).toHaveBeenCalled();
    stop();
    expect(clip.pause).toHaveBeenCalled();
  });

  it("returns a harmless stop before unlock", async () => {
    const ctor = vi.fn();
    vi.stubGlobal("Audio", ctor);
    const audio = await import("../../src/lib/audio.js");
    const stop = audio.loop("pencil");
    expect(() => stop()).not.toThrow();
    expect(ctor).not.toHaveBeenCalled();
  });
});
