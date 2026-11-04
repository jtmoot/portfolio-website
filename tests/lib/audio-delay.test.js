import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("play with a delay", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  const fakeAudio = () => {
    const play = vi.fn(() => Promise.resolve());
    const ctor = vi.fn(function Fake() {
      this.play = play;
      this.currentTime = 0;
    });
    vi.stubGlobal("Audio", ctor);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    return play;
  };

  it("starts the clip only once the delay has passed", async () => {
    const play = fakeAudio();
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    const done = audio.play("flip", { delay: 350 });
    await vi.advanceTimersByTimeAsync(300);
    expect(play).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(60);
    await done;
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("stays quiet if the page was muted during the delay", async () => {
    const play = fakeAudio();
    const audio = await import("../../src/lib/audio.js");
    audio.unlock();
    const done = audio.play("flip", { delay: 350 });
    audio.setMuted(true);
    await vi.advanceTimersByTimeAsync(400);
    await done;
    expect(play).not.toHaveBeenCalled();
    audio.setMuted(false);
  });
});
