import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Hero from "../../src/pad/Hero.jsx";
import { DOTS, backingSize } from "../../src/pad/DotPortrait.jsx";

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

  it("holds the polaroid back until its portrait is drawn, then settles it in", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Hero />));
    const card = host.querySelector(".polaroid");
    expect(card.hasAttribute("data-ready")).toBe(false);
    // jsdom has no canvas, so the portrait falls back to the photo; its load is the ready signal.
    const img = card.querySelector("img.portrait-img");
    await act(async () => img.dispatchEvent(new Event("load")));
    expect(card.hasAttribute("data-ready")).toBe(true);
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
    const o = openingTimes(nameDuration("Joshua Moorehead"), INTRO.flat().filter((t) => t.mark).length);
    expect(hero.style.getPropertyValue("--t-role")).toBe(`${o.role}ms`);
    expect(hero.style.getPropertyValue("--t-intro")).toBe(`${o.intro}ms`);
    expect(hero.style.getPropertyValue("--t-marks")).toBe(`${o.marks}ms`);
    expect(hero.style.getPropertyValue("--t-mark-gap")).toBe(`${o.markGap}ms`);
    expect(hero.style.getPropertyValue("--t-socials")).toBe(`${o.socials}ms`);
    expect(hero.dataset.pass).toBe("0");
    expect(host.querySelectorAll(".hero .intro p mark")).toHaveLength(3);
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("uses a finer dot grid than the first pass (64 a side)", () => {
    expect(DOTS).toBeGreaterThanOrEqual(90);
  });

  it("draws the dots at the size the card is shown, in device pixels, so they stay sharp", () => {
    expect(backingSize(153, 2)).toBe(306);
    expect(backingSize(129.4, 1)).toBe(129);
    expect(backingSize(170, 3)).toBe(510);
    // Not laid out yet (or hidden): a sensible default rather than a 0 px canvas.
    expect(backingSize(0, 2)).toBe(480);
    // A huge card on a dense screen stays affordable to redraw.
    expect(backingSize(900, 3)).toBe(1600);
  });
});

describe("the polaroid swoops in from the room", () => {
  const mountWith = async (reduced) => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: reduced }));
    const { default: Fresh } = await import("../../src/pad/Hero.jsx");
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(<Fresh />));
    return { host, root, card: host.querySelector(".polaroid"), hero: host.querySelector(".hero") };
  };
  const done = async ({ host, root }) => {
    await act(async () => root.unmount());
    host.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  };

  it("brings it in once the portrait is ready, and starts the name only as it lands", async () => {
    const { ARRIVE_MS } = await import("../../src/lib/opening.js");
    const m = await mountWith(false);
    expect(m.hero.hasAttribute("data-go")).toBe(false);
    await act(async () => m.card.querySelector("img").dispatchEvent(new Event("load")));
    expect(m.card.hasAttribute("data-ready")).toBe(true);
    await act(async () => vi.advanceTimersByTime(ARRIVE_MS - 50));
    expect(m.hero.hasAttribute("data-go")).toBe(false);
    await act(async () => vi.advanceTimersByTime(100));
    expect(m.hero.hasAttribute("data-go")).toBe(true);
    await done(m);
  });

  it("doesn't wait forever on a slow photo", async () => {
    const { ARRIVE_MS, READY_CAP_MS } = await import("../../src/lib/opening.js");
    const m = await mountWith(false);
    await act(async () => vi.advanceTimersByTime(READY_CAP_MS));
    expect(m.card.hasAttribute("data-ready")).toBe(true);
    await act(async () => vi.advanceTimersByTime(ARRIVE_MS));
    expect(m.hero.hasAttribute("data-go")).toBe(true);
    await done(m);
  });

  it("skips the float under reduced motion: the opening starts as soon as the portrait is ready", async () => {
    const m = await mountWith(true);
    await act(async () => m.card.querySelector("img").dispatchEvent(new Event("load")));
    expect(m.hero.hasAttribute("data-go")).toBe(true);
    await done(m);
  });
});

describe("the opening's CSS reads what Hero sets", () => {
  // Vitest runs from the repo root.
  const css = readFileSync("src/styles/sheet.css", "utf8");

  it("uses every timing variable Hero writes", () => {
    for (const v of ["--t-role", "--t-intro", "--t-marks", "--t-mark-gap", "--t-socials"]) expect(css).toContain(`var(${v}`);
  });

  it("fades the paragraphs in as one block rising 8px over 0.7 s, and sweeps each highlight in over 0.6 s", () => {
    expect(css).toMatch(/\.hero\[data-go\] \.intro \{\s*animation: open-rise 0\.7s cubic-bezier\(0\.4, 0, 0\.2, 1\) /);
    expect(css).toMatch(/@keyframes open-rise \{\s*from \{\s*opacity: 0;\s*translate: 0 8px;/);
    expect(css).toMatch(/\.hero\[data-go\]\[data-pass="0"\] \.intro mark \{\s*animation: mark-draw-0 0\.6s cubic-bezier\(0\.25, 1, 0\.5, 1\) /);
    expect(css).toMatch(/\.hero\[data-go\]\[data-pass="1"\] \.intro mark \{\s*animation: mark-draw-1 0\.6s cubic-bezier\(0\.25, 1, 0\.5, 1\) /);
  });

  it("has a highlight animation for each pass, so a replay restarts them", () => {
    expect(css).toMatch(/\.hero\[data-go\]\[data-pass="0"\] \.intro mark \{\s*animation: mark-draw-0 /);
    expect(css).toMatch(/\.hero\[data-go\]\[data-pass="1"\] \.intro mark \{\s*animation: mark-draw-1 /);
    expect(css).toMatch(/@keyframes mark-draw-0/);
    expect(css).toMatch(/@keyframes mark-draw-1/);
  });

  it("hides the card until ready without opacity (its creative-mode opacity transition would re-fade it as it lands)", () => {
    expect(css).toMatch(/\.stage\[data-mode="pad"\] \.polaroid:not\(\[data-ready\]\) \{\s*visibility: hidden;\s*\}/);
    expect(css).not.toMatch(/\.polaroid:not\(\[data-ready\]\) \{\s*opacity/);
  });

  it("swoops it from where it stands in the room: small and low on the right, along a curve, growing into place", () => {
    // Across and down on separate properties with different easings, so the path bends.
    expect(css).toMatch(/\.polaroid\[data-ready\] \{\s*animation:\s*swoop-across 1\.4s cubic-bezier\(0\.75, 0, 0\.4, 1\) backwards,\s*swoop-down 1\.4s cubic-bezier\(0\.45, 0, 0\.2, 1\) backwards,\s*swoop-fade 0\.35s ease backwards;/);
    // The drop is the outer translate, so the card's own shrink and tilt (inside transform) never scale it.
    expect(css).toMatch(/@keyframes swoop-across \{\s*from \{\s*transform: translateX\(var\(--swoop-x\)\) rotate\(8deg\) scale\(0\.36\);/);
    expect(css).toMatch(/@keyframes swoop-down \{\s*from \{\s*translate: 0 var\(--swoop-y\);/);
    // From the card's own centre to the room's spot for it (FIGURE_START, in cqw).
    expect(css).toContain("--swoop-x: calc(var(--to-x) * 1cqw - 31.3cqw);");
    expect(css).toContain("--swoop-y: calc(var(--to-y) * 1cqw - 14.1cqw);");
    expect(css).not.toMatch(/@keyframes arrive/);
  });

  it("keeps the name, role, intro and links hidden until the polaroid has landed", () => {
    expect(css).toMatch(/\.hero:not\(\[data-go\]\) > \* \{\s*opacity: 0;/);
    expect(css).toMatch(/\.hero\[data-go\] \.role \{\s*animation: open-fade /);
    expect(css).toMatch(/\.hero\[data-go\] \.socials \{\s*animation: open-fade /);
  });

  it("never hides a focused link or button behind the fade, and lifts the polaroid only for a real pointer", () => {
    expect(css).toMatch(/\.hero \.role:focus-within,\s*\.hero \.socials:focus-within \{\s*animation: none;/);
    expect(css).toMatch(/@media \(hover: hover\) \{\s*\.stage\[data-mode="pad"\] \.polaroid:hover/);
  });
});

describe("the space under the hero", () => {
  it("keeps Experience max(3cqw, 40px) under the links: close, but never touching", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("src/styles/sheet.css", "utf8");
    expect(css).toContain("margin-top: max(-52cqw, calc(var(--hero-end, 0px) + max(3cqw, 40px) - 78cqw));");
  });
});
