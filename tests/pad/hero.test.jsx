import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
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
    expect(host.querySelectorAll(".hero p.intro mark")).toHaveLength(3);
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("uses a finer dot grid than the first pass (64 a side)", () => {
    expect(DOTS).toBeGreaterThanOrEqual(90);
  });
});

describe("the opening's CSS reads what Hero sets", () => {
  // Vitest runs from the repo root.
  const css = readFileSync("src/styles/sheet.css", "utf8");

  it("uses every timing variable Hero writes", () => {
    for (const v of ["--t-role", "--t-intro", "--t-marks", "--t-mark-gap", "--t-socials"]) expect(css).toContain(`var(${v}`);
  });

  it("has a highlight animation for each pass, so a replay restarts them", () => {
    expect(css).toMatch(/\.hero\[data-pass="0"\] \.intro mark \{\s*animation: mark-draw-0 /);
    expect(css).toMatch(/\.hero\[data-pass="1"\] \.intro mark \{\s*animation: mark-draw-1 /);
    expect(css).toMatch(/@keyframes mark-draw-0/);
    expect(css).toMatch(/@keyframes mark-draw-1/);
  });

  it("never hides a focused link or button behind the fade, and lifts the polaroid only for a real pointer", () => {
    expect(css).toMatch(/\.hero \.role:focus-within,\s*\.hero \.socials:focus-within \{\s*animation: none;/);
    expect(css).toMatch(/@media \(hover: hover\) \{\s*\.stage\[data-mode="pad"\] \.polaroid:hover/);
  });
});
