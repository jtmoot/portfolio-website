import { describe, it, expect, vi, afterEach } from "vitest";
import { act, createRef } from "react";
import { createRoot } from "react-dom/client";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.doUnmock("../../src/lib/audio.js");
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const mount = async (reduce = false) => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", () => ({ matches: reduce }));
  const stop = vi.fn();
  const audio = { loop: vi.fn(() => stop), play: vi.fn(), unlock: vi.fn(), isMuted: () => false, setMuted: vi.fn(), stopAll: vi.fn() };
  vi.doMock("../../src/lib/audio.js", () => audio);
  const { default: HandName, STEP_MS, nameDuration } = await import("../../src/pad/HandName.jsx");
  const ref = createRef();
  const host = document.createElement("div");
  const root = createRoot(host);
  await act(async () => root.render(<HandName ref={ref} text="Hi, I'm Josh" />));
  const typed = () => host.querySelector(".name-typed").textContent;
  return { host, root, ref, audio, stop, typed, STEP_MS, nameDuration };
};

describe("HandName", () => {
  it("writes the name out letter by letter, with the typing sound only while it writes", async () => {
    const { host, root, ref, audio, stop, typed, STEP_MS } = await mount();
    expect(host.querySelector(".sr-only").textContent).toBe("Hi, I'm Josh");
    await act(async () => ref.current.run());
    await act(async () => vi.advanceTimersByTime(150 + STEP_MS * 3));
    expect(typed().length).toBeGreaterThan(0);
    expect(typed().length).toBeLessThan("Hi, I'm Josh".length);
    expect(audio.loop).toHaveBeenCalledWith("typing");
    expect(stop).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(STEP_MS * 20));
    expect(typed()).toBe("Hi, I'm Josh");
    expect(stop).toHaveBeenCalled();
    await act(async () => root.unmount());
  });

  it("shows the whole name straight away under reduced motion, silently", async () => {
    const { host, root, ref, audio, typed } = await mount(true);
    await act(async () => ref.current.run());
    expect(typed()).toBe("Hi, I'm Josh");
    expect(audio.loop).not.toHaveBeenCalled();
    expect(host.querySelector(".name-caret")).not.toBeNull();
    expect(host.querySelector("h1").hasAttribute("data-writing")).toBe(false);
    await act(async () => root.unmount());
  });

  it("runs a caret just ahead of the letters, solid while typing and blinking once done", async () => {
    const { host, root, ref, nameDuration } = await mount();
    const caret = host.querySelector(".name-caret");
    expect(caret.getAttribute("aria-hidden")).toBe("true");
    expect(caret.previousElementSibling.className).toBe("name-typed");
    expect(caret.nextElementSibling.className).toBe("name-ghost");
    await act(async () => ref.current.run());
    await act(async () => vi.advanceTimersByTime(300));
    expect(host.querySelector("h1").hasAttribute("data-writing")).toBe(true);
    await act(async () => vi.advanceTimersByTime(nameDuration("Hi, I'm Josh")));
    expect(host.querySelector("h1").hasAttribute("data-writing")).toBe(false);
    expect(host.querySelector(".name-caret")).not.toBeNull();
    await act(async () => root.unmount());
  });

  it("puts each letter down on the person-like rhythm, after a 150 ms beat", async () => {
    const { root, ref, typed } = await mount();
    const { typingRhythm } = await import("../../src/lib/opening.js");
    const at = typingRhythm("Hi, I'm Josh");
    await act(async () => ref.current.run());
    let now = 0;
    for (const [i, t] of at.entries()) {
      await act(async () => vi.advanceTimersByTime(150 + t - 1 - now));
      expect(typed().length).toBe(i);
      await act(async () => vi.advanceTimersByTime(1));
      expect(typed().length).toBe(i + 1);
      now = 150 + t;
    }
    await act(async () => root.unmount());
  });
});
