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
  const { default: HandName, STEP_MS } = await import("../../src/pad/HandName.jsx");
  const ref = createRef();
  const host = document.createElement("div");
  const root = createRoot(host);
  await act(async () => root.render(<HandName ref={ref} text="Hi, I'm Josh" />));
  const typed = () => host.querySelector(".name-typed").textContent;
  return { host, root, ref, audio, stop, typed, STEP_MS };
};

describe("HandName", () => {
  it("writes the name out letter by letter, with the pencil only while it writes", async () => {
    const { host, root, ref, audio, stop, typed, STEP_MS } = await mount();
    expect(host.querySelector(".sr-only").textContent).toBe("Hi, I'm Josh");
    await act(async () => ref.current.run());
    await act(async () => vi.advanceTimersByTime(150 + STEP_MS * 3));
    expect(typed().length).toBeGreaterThan(0);
    expect(typed().length).toBeLessThan("Hi, I'm Josh".length);
    expect(audio.loop).toHaveBeenCalledWith("pencil");
    expect(stop).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(STEP_MS * 20));
    expect(typed()).toBe("Hi, I'm Josh");
    expect(stop).toHaveBeenCalled();
    await act(async () => root.unmount());
  });

  it("shows the whole name straight away under reduced motion, silently", async () => {
    const { root, ref, audio, typed } = await mount(true);
    await act(async () => ref.current.run());
    expect(typed()).toBe("Hi, I'm Josh");
    expect(audio.loop).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });
});
