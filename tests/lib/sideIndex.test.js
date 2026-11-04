import { describe, it, expect } from "vitest";
import { currentSection } from "../../src/lib/sideIndex.js";

// The page as measured at 1440 x 900 on Nov 3: section tops, a 3,540 px page, 900 px window.
const TOPS = [461, 856, 3032, 3276];
const at = (scrollY) => currentSection(TOPS, { scrollY, viewH: 900, pageH: 3540 });

describe("currentSection", () => {
  it("marks the first section until a later one crosses a quarter of the way down the window", () => {
    expect(at(0)).toBe(0);
    expect(at(600)).toBe(0);
    expect(at(700)).toBe(1);
  });

  it("marks every section at some scroll position, even ones that can't reach the top", () => {
    const seen = new Set();
    for (let y = 0; y <= 2640; y += 10) seen.add(at(y));
    expect([...seen]).toEqual([0, 1, 2, 3]);
  });

  it("marks them in order as you scroll down, and the last one at the very bottom", () => {
    let last = 0;
    for (let y = 0; y <= 2640; y += 10) {
      const i = at(y);
      expect(i).toBeGreaterThanOrEqual(last);
      last = i;
    }
    expect(at(2640)).toBe(3);
  });

  it("handles a page shorter than the window", () => {
    expect(currentSection([0, 200], { scrollY: 0, viewH: 900, pageH: 600 })).toBe(1);
  });
});
