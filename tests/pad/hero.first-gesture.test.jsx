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
  it("unlocks sound and rewrites the name with the typing sound, once", async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const audio = { loop: vi.fn(() => () => {}), play: vi.fn(), unlock: vi.fn(), isMuted: () => false, setMuted: vi.fn(), stopAll: vi.fn(), onSoundChange: () => () => {} };
    vi.doMock("../../src/lib/audio.js", () => audio);
    const { default: Hero } = await import("../../src/pad/Hero.jsx");
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Hero />));
    await act(async () => vi.advanceTimersByTime(8000));
    audio.loop.mockClear();
    expect(host.querySelector(".hero").dataset.pass).toBe("0");
    await act(async () => window.dispatchEvent(new Event("pointerdown")));
    expect(audio.unlock).toHaveBeenCalled();
    // The highlights draw again with the name; the paragraph and links stay put under the click.
    expect(host.querySelector(".hero").dataset.pass).toBe("1");
    await act(async () => vi.advanceTimersByTime(400));
    expect(audio.loop).toHaveBeenCalledWith("typing");
    audio.loop.mockClear();
    await act(async () => vi.advanceTimersByTime(8000));
    await act(async () => window.dispatchEvent(new Event("pointerdown")));
    await act(async () => vi.advanceTimersByTime(400));
    expect(audio.loop).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });

  it("stays silent when the first click is the creative-mode toggle", async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const audio = { loop: vi.fn(() => () => {}), play: vi.fn(), unlock: vi.fn(), isMuted: () => false, setMuted: vi.fn(), stopAll: vi.fn(), onSoundChange: () => () => {} };
    vi.doMock("../../src/lib/audio.js", () => audio);
    const { default: Hero } = await import("../../src/pad/Hero.jsx");
    const host = document.createElement("div");
    document.body.append(host);
    const toggle = document.createElement("button");
    toggle.dataset.sound = "flip";
    document.body.append(toggle);
    const root = createRoot(host);
    await act(async () => root.render(<Hero />));
    await act(async () => vi.advanceTimersByTime(8000));
    audio.loop.mockClear();
    await act(async () => toggle.dispatchEvent(new Event("pointerdown", { bubbles: true })));
    expect(audio.unlock).toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(2000));
    expect(audio.loop).not.toHaveBeenCalled();
    await act(async () => root.unmount());
    toggle.remove();
    host.remove();
  });

  it("keeps replay and mute on the role line, like garvitsingla.in", async () => {
    vi.resetModules();
    vi.doUnmock("../../src/lib/audio.js");
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const { default: Hero } = await import("../../src/pad/Hero.jsx");
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Hero />));
    expect(host.querySelector('.role button[aria-label="Replay the name with sound"]')).not.toBeNull();
    expect(host.querySelector('.role button[aria-label="Mute sound"]')).not.toBeNull();
    expect(host.querySelector(".typed button")).toBeNull();
    expect(host.querySelector("h1 .sr-only").textContent).toBe("Joshua Moorehead");
    expect(host.querySelector(".scribble")).toBeNull();
    await act(async () => root.unmount());
  });
});
