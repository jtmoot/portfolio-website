import { describe, it, expect, beforeEach } from "vitest";
import { MIN_SPEED, MAX_SPEED, clampSpeed, angleOf, speedOf, nudge, loadSpeed, saveSpeed } from "../../src/lib/speed.js";

describe("speed wheel maths", () => {
  it("runs from half to double speed", () => {
    expect(MIN_SPEED).toBe(0.5);
    expect(MAX_SPEED).toBe(2);
    expect(clampSpeed(9)).toBe(2);
    expect(clampSpeed(0.1)).toBe(0.5);
    expect(clampSpeed(Number.NaN)).toBe(1);
  });

  it("puts 1x straight up and the ends at -135 and +135 degrees", () => {
    expect(angleOf(1)).toBeCloseTo(0, 6);
    expect(angleOf(0.5)).toBeCloseTo(-135, 6);
    expect(angleOf(2)).toBeCloseTo(135, 6);
    expect(speedOf(angleOf(1.5))).toBeCloseTo(1.5, 6);
    expect(speedOf(400)).toBe(2);
  });

  it("nudges in quarter steps and stays in range", () => {
    expect(nudge(1, 1)).toBe(1.25);
    expect(nudge(1, -1)).toBe(0.75);
    expect(nudge(2, 1)).toBe(2);
    expect(nudge(0.5, -1)).toBe(0.5);
  });
});

describe("speed storage", () => {
  beforeEach(() => localStorage.clear());
  it("remembers the setting and defaults to 1", () => {
    expect(loadSpeed()).toBe(1);
    saveSpeed(1.5);
    expect(loadSpeed()).toBe(1.5);
    localStorage.setItem("pad.speed", "banana");
    expect(loadSpeed()).toBe(1);
  });
});
