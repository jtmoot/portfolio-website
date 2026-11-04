import { afterEach, describe, expect, it, vi } from "vitest";
import { trackHeroEnd } from "../../src/lib/heroEnd.js";

const build = (top, height) => {
  const sheet = document.createElement("main");
  sheet.className = "sheet";
  const hero = document.createElement("div");
  sheet.append(hero);
  Object.defineProperty(hero, "offsetTop", { configurable: true, get: () => top });
  Object.defineProperty(hero, "offsetHeight", { configurable: true, get: () => height });
  return { sheet, hero };
};

describe("trackHeroEnd", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("writes the hero's bottom edge to --hero-end on the sheet and follows resizes", () => {
    let fire;
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb) {
          fire = cb;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    let height = 240;
    const { sheet, hero } = build(120, 0);
    Object.defineProperty(hero, "offsetHeight", { configurable: true, get: () => height });

    const stop = trackHeroEnd(hero);
    expect(sheet.style.getPropertyValue("--hero-end")).toBe("360px");

    height = 400;
    fire();
    expect(sheet.style.getPropertyValue("--hero-end")).toBe("520px");

    stop();
    expect(disconnect).toHaveBeenCalled();
  });

  it("does nothing without ResizeObserver or outside a sheet", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    const { sheet, hero } = build(10, 20);
    trackHeroEnd(hero)();
    expect(sheet.style.getPropertyValue("--hero-end")).toBe("");
    expect(() => trackHeroEnd(document.createElement("div"))()).not.toThrow();
    expect(() => trackHeroEnd(null)()).not.toThrow();
  });
});
