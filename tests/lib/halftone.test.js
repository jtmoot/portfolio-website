import { describe, it, expect } from "vitest";
import { dotRadius, isNearWhite } from "../../src/lib/halftone.js";

describe("halftone", () => {
  it("white gets the smallest dot", () => {
    expect(dotRadius(1, 6)).toBe(0.35);
  });
  it("black gets 72 percent of the cell", () => {
    expect(dotRadius(0, 6)).toBeCloseTo(4.32, 5);
  });
  it("treats near-white as background", () => {
    expect(isNearWhite(250, 250, 250)).toBe(true);
    expect(isNearWhite(200, 200, 200)).toBe(false);
  });
});
