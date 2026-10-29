import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Margins, { WOBBLE_MS } from "../../src/pad/Margins.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mount = async () => {
  const host = document.createElement("div");
  const root = createRoot(host);
  await act(async () => root.render(<Margins />));
  return { host, root };
};

describe("Margins", () => {
  it("makes the tagged stickers links, external ones in a new tab", async () => {
    const { host, root } = await mount();
    const shoe = host.querySelector('[data-traveler="novablast"] a');
    expect(shoe.getAttribute("href")).toBe("https://www.strava.com/athletes/121070736");
    expect(shoe.getAttribute("target")).toBe("_blank");
    expect(shoe.textContent).toContain("my runs");
    const book = host.querySelector('[data-traveler="book"] a');
    expect(book.getAttribute("href")).toBe("#reading");
    expect(book.hasAttribute("target")).toBe(false);
    expect(host.querySelector('[data-traveler="king"] .obj-tag').textContent).toContain("my rating");
    await act(async () => root.unmount());
  });

  it("leaves the brain without words", async () => {
    const { host, root } = await mount();
    const brain = host.querySelector('[data-traveler="brain"]');
    expect(brain.querySelector(".obj-tag, .obj-label, a")).toBeNull();
    await act(async () => root.unmount());
  });

  it("tapes every poster at two places", async () => {
    const { host, root } = await mount();
    const posters = host.querySelectorAll('[data-kind="poster"]');
    expect(posters).toHaveLength(4);
    for (const p of posters) expect(p.querySelectorAll(".tape")).toHaveLength(2);
    await act(async () => root.unmount());
  });
});

describe("Margins stickers come alive", () => {
  it("floats each sticker on its own loop, but not the posters' sticker class", async () => {
    const { host, root } = await mount();
    const floats = [...host.querySelectorAll(".obj-sticker .flat")].map((el) => el.className);
    expect(floats.every((c) => /\bfloat f[0-3]\b/.test(c))).toBe(true);
    expect(new Set(floats).size).toBe(floats.length);
    await act(async () => root.unmount());
  });

  it("wobbles a sticker when tapped, then clears it for the next tap", async () => {
    vi.useFakeTimers();
    const { host, root } = await mount();
    const fig = host.querySelector('[data-traveler="brain"]');
    await act(async () => fig.dispatchEvent(new Event("pointerdown", { bubbles: true })));
    expect(fig.classList.contains("tapped")).toBe(true);
    await act(async () => vi.advanceTimersByTime(WOBBLE_MS));
    expect(fig.classList.contains("tapped")).toBe(false);
    await act(async () => root.unmount());
    vi.useRealTimers();
  });
});
