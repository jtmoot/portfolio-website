import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Chess, { MOVE_MS } from "../../src/creative/stations/Chess.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Chess", () => {
  it("moves a piece every MOVE_MS, and goes still under reduced motion", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const animate = vi.fn(() => ({ finished: Promise.resolve() }));
    Element.prototype.animate = animate;
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Chess />));
    expect(host.querySelectorAll("[data-sq]").length).toBe(22);
    await act(async () => vi.advanceTimersByTime(MOVE_MS + 10));
    expect(animate).toHaveBeenCalled();
    const knight = host.querySelector('[data-sq="2,5"]');
    expect(knight.dataset.at).toBe("4,4");
    await act(async () => root.unmount());

    animate.mockClear();
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const root2 = createRoot(document.createElement("div"));
    await act(async () => root2.render(<Chess />));
    await act(async () => vi.advanceTimersByTime(MOVE_MS * 3));
    expect(animate).not.toHaveBeenCalled();
    await act(async () => root2.unmount());
    delete Element.prototype.animate;
  });
});
