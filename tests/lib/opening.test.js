import { describe, it, expect } from "vitest";
import { STEP_MS, typingRhythm, openingTimes } from "../../src/lib/opening.js";

describe("typingRhythm", () => {
  it("gives every letter a later time than the one before", () => {
    const t = typingRhythm("Joshua Moorehead");
    expect(t).toHaveLength(16);
    expect(t[0]).toBeGreaterThan(0);
    t.slice(1).forEach((x, i) => expect(x).toBeGreaterThan(t[i]));
  });

  it("is uneven like a person, but the same rhythm on every load", () => {
    const t = typingRhythm("Joshua Moorehead");
    const gaps = t.map((x, i) => x - (t[i - 1] ?? 0));
    expect(new Set(gaps).size).toBeGreaterThan(4);
    expect(typingRhythm("Joshua Moorehead")).toEqual(t);
  });

  it("pauses between words and takes about 0.9 s for the name", () => {
    const t = typingRhythm("Joshua Moorehead");
    const gap = (i) => t[i] - t[i - 1];
    // The space is index 6; the M after it waits on the word break.
    expect(gap(7)).toBeGreaterThan(STEP_MS);
    expect(t.at(-1)).toBeGreaterThan(750);
    expect(t.at(-1)).toBeLessThan(1100);
  });
});

describe("openingTimes", () => {
  it("runs the name, the role, the intro, the highlights 150 ms apart, then the links", () => {
    const o = openingTimes(1000, 3);
    expect(o.role).toBeLessThan(o.intro);
    expect(o.intro).toBeLessThan(o.marks);
    expect(o.markGap).toBe(150);
    expect(o.socials).toBeGreaterThan(o.marks + 2 * 150);
    expect(o.role).toBeGreaterThanOrEqual(850);
  });

  it("is over in about 2.2 s for a 1 s name", () => {
    const o = openingTimes(1000, 3);
    expect(o.socials).toBeGreaterThan(1900);
    expect(o.socials).toBeLessThan(2500);
  });
});
