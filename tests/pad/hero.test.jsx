import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Hero from "../../src/pad/Hero.jsx";
import { DOTS } from "../../src/pad/DotPortrait.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Hero portrait", () => {
  it("shows the portrait with no caption under it", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Hero />));
    const card = host.querySelector(".polaroid");
    expect(card.querySelector("figcaption")).toBeNull();
    const art = card.querySelector(".portrait-dots, .portrait-img");
    expect(art).not.toBeNull();
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("times the opening from the name: role, intro, each highlight, then the links", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const { nameDuration } = await import("../../src/pad/HandName.jsx");
    const { openingTimes } = await import("../../src/lib/opening.js");
    const { INTRO } = await import("../../src/content/data.js");
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Hero />));
    const hero = host.querySelector(".hero");
    const o = openingTimes(nameDuration("Joshua Moorehead"), INTRO.filter((t) => t.mark).length);
    expect(hero.style.getPropertyValue("--t-role")).toBe(`${o.role}ms`);
    expect(hero.style.getPropertyValue("--t-intro")).toBe(`${o.intro}ms`);
    expect(hero.style.getPropertyValue("--t-marks")).toBe(`${o.marks}ms`);
    expect(hero.style.getPropertyValue("--t-mark-gap")).toBe(`${o.markGap}ms`);
    expect(hero.style.getPropertyValue("--t-socials")).toBe(`${o.socials}ms`);
    expect(hero.dataset.pass).toBe("0");
    expect(host.querySelector(".typed, .caret")).toBeNull();
    expect(host.querySelectorAll(".hero p.intro mark")).toHaveLength(3);
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("uses a finer dot grid than the first pass (64 a side)", () => {
    expect(DOTS).toBeGreaterThanOrEqual(90);
  });
});
