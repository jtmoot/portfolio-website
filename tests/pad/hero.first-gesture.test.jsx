import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.doUnmock("../../src/lib/audio.js");
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Hero first gesture", () => {
  it("unlocks sound and rewrites the name with the pencil, once", async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const audio = { loop: vi.fn(() => () => {}), play: vi.fn(), unlock: vi.fn(), isMuted: () => false, setMuted: vi.fn(), stopAll: vi.fn() };
    vi.doMock("../../src/lib/audio.js", () => audio);
    const { default: Hero } = await import("../../src/pad/Hero.jsx");
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Hero />));
    await act(async () => vi.advanceTimersByTime(8000));
    audio.loop.mockClear();
    await act(async () => window.dispatchEvent(new Event("pointerdown")));
    expect(audio.unlock).toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(400));
    expect(audio.loop).toHaveBeenCalledWith("pencil");
    audio.loop.mockClear();
    await act(async () => vi.advanceTimersByTime(8000));
    await act(async () => window.dispatchEvent(new Event("pointerdown")));
    await act(async () => vi.advanceTimersByTime(400));
    expect(audio.loop).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });
});
