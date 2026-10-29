import { describe, it, expect } from "vitest";
import { clampPreview, CARD } from "../../src/lib/preview.js";

const VIEW = { w: 1512, h: 1180 };

describe("clampPreview", () => {
  it("keeps the card 12px inside the bottom-right corner", () => {
    const { left, top } = clampPreview({ x: 1500, y: 1100 }, { w: 240, h: 150 }, VIEW);
    expect(left).toBeLessThanOrEqual(1512 - 240 - 12);
    expect(top).toBeLessThanOrEqual(1180 - 150 - 12);
  });

  it("keeps the card 12px inside the top-left corner", () => {
    const { left, top } = clampPreview({ x: 10, y: 10 }, { w: 240, h: 150 }, VIEW);
    expect(left).toBeGreaterThanOrEqual(12);
    expect(top).toBeGreaterThanOrEqual(12);
  });

  it("sits above and centred on the pointer when there is room", () => {
    const { left, top } = clampPreview({ x: 700, y: 600 }, { w: 240, h: 150 }, VIEW);
    expect(left).toBe(700 - 120);
    expect(top).toBe(600 - 150 - 18);
  });

  it("defaults to a 240 by 150 card", () => {
    expect(CARD).toEqual({ w: 240, h: 150 });
  });
});
