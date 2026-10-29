import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import TypedIntro from "../../src/pad/TypedIntro.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("TypedIntro", () => {
  it("gives screen readers the whole paragraph as real text, not an aria-label", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<TypedIntro tokens={[{ text: "i build " }, { text: "ml systems", mark: true }, { text: "." }]} startDelay={10000} />));
    const p = host.querySelector("p");
    expect(p.hasAttribute("aria-label")).toBe(false);
    expect(p.querySelector(".sr-only").textContent).toBe("i build ml systems.");
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });
});

describe("TypedIntro first gesture", () => {
  it("retypes once, with the pencil sound, on the first click", async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const stop = vi.fn();
    const loop = vi.fn(() => stop);
    const unlock = vi.fn();
    vi.doMock("../../src/lib/audio.js", () => ({ play: vi.fn(), loop, unlock, isMuted: () => false, setMuted: vi.fn() }));
    const { default: Intro } = await import("../../src/pad/TypedIntro.jsx");
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Intro tokens={[{ text: "hi." }]} startDelay={0} />));
    await act(async () => vi.advanceTimersByTime(2000));
    const typed = () => host.querySelector("[aria-hidden=true]").textContent;
    expect(typed()).toBe("hi.");
    loop.mockClear();

    await act(async () => window.dispatchEvent(new Event("pointerdown")));
    expect(unlock).toHaveBeenCalled();
    expect(typed()).toBe("");
    await act(async () => vi.advanceTimersByTime(2000));
    expect(typed()).toBe("hi.");
    expect(loop).toHaveBeenCalledWith("pencil");
    expect(stop).toHaveBeenCalled();

    loop.mockClear();
    await act(async () => window.dispatchEvent(new Event("pointerdown")));
    expect(typed()).toBe("hi.");
    expect(loop).not.toHaveBeenCalled();

    await act(async () => root.unmount());
    vi.doUnmock("../../src/lib/audio.js");
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});

describe("TypedIntro sound controls", () => {
  const mount = async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    let muted = false;
    const audio = { play: vi.fn(), loop: vi.fn(() => () => {}), unlock: vi.fn(), isMuted: () => muted, setMuted: vi.fn((v) => (muted = v)) };
    vi.doMock("../../src/lib/audio.js", () => audio);
    const { default: Intro } = await import("../../src/pad/TypedIntro.jsx");
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Intro tokens={[{ text: "hi." }]} startDelay={0} />));
    await act(async () => vi.advanceTimersByTime(2000));
    const done = async () => {
      await act(async () => root.unmount());
      vi.doUnmock("../../src/lib/audio.js");
      vi.useRealTimers();
      vi.unstubAllGlobals();
    };
    return { host, audio, done };
  };

  it("replays the intro with sound from a small icon button", async () => {
    const { host, audio, done } = await mount();
    const replay = host.querySelector('button[aria-label="Replay the intro with sound"]');
    expect(replay).not.toBeNull();
    expect(replay.textContent.trim()).toBe("");
    audio.loop.mockClear();
    await act(async () => replay.click());
    expect(host.querySelector("[aria-hidden=true]").textContent).toBe("");
    await act(async () => vi.advanceTimersByTime(2000));
    expect(audio.loop).toHaveBeenCalledWith("pencil");
    await done();
  });

  it("toggles mute and shows the state", async () => {
    const { host, audio, done } = await mount();
    const mute = host.querySelector('button[aria-label="Mute sound"]');
    expect(mute.getAttribute("aria-pressed")).toBe("false");
    await act(async () => mute.click());
    expect(audio.setMuted).toHaveBeenCalledWith(true);
    expect(mute.getAttribute("aria-pressed")).toBe("true");
    await done();
  });
});
