import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Chess, { MATE_AFTER_MS, KING_AFTER_MS, RESET_AFTER_MS } from "../../src/creative/stations/Chess.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  delete Element.prototype.animate;
});

const mount = async (reduce = false) => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", () => ({ matches: reduce }));
  const animate = vi.fn(() => ({ finished: Promise.resolve(), cancel() {} }));
  Element.prototype.animate = animate;
  const host = document.createElement("div");
  const root = createRoot(host);
  await act(async () => root.render(<Chess />));
  const set = (active) => act(async () => root.render(<Chess active={active} />));
  const wait = (ms) => act(async () => vi.advanceTimersByTime(ms));
  return { host, root, animate, set, wait };
};

describe("Chess", () => {
  it("sits still until he comes to the table: no ambient replay", async () => {
    const { host, root, animate, wait } = await mount();
    expect(host.querySelectorAll("[data-sq]").length).toBe(22);
    await wait(60000);
    expect(animate).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });

  it("when he plays, the queen takes on g7, the bishop goes and the king tips over", async () => {
    const { host, root, set, wait } = await mount();
    await set(true);
    await wait(MATE_AFTER_MS + 10);
    expect(host.querySelector('[data-sq="3,3"]').dataset.at).toBe("6,6");
    expect(host.querySelector('[data-sq="6,6"]').hasAttribute("data-taken")).toBe(true);
    await wait(KING_AFTER_MS);
    expect(host.querySelector('[data-sq="7,6"]').hasAttribute("data-fallen")).toBe(true);
    await act(async () => root.unmount());
  });

  it("sets the board back up after he walks away", async () => {
    const { host, root, set, wait } = await mount();
    await set(true);
    await wait(MATE_AFTER_MS + KING_AFTER_MS + 10);
    await set(false);
    await wait(RESET_AFTER_MS + 10);
    expect(host.querySelector('[data-sq="3,3"]').dataset.at).toBe("3,3");
    expect(host.querySelector('[data-sq="6,6"]').hasAttribute("data-taken")).toBe(false);
    expect(host.querySelector('[data-sq="7,6"]').hasAttribute("data-fallen")).toBe(false);
    await act(async () => root.unmount());
  });

  it("does nothing under reduced motion", async () => {
    const { root, animate, set, wait } = await mount(true);
    await set(true);
    await wait(10000);
    expect(animate).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });
});
