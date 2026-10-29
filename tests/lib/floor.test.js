import { describe, it, expect } from "vitest";
import { onPad, TILE, tileKey, tilesAround, collides, resolveCollision, nearestStation, zIndexFor, depthKey } from "../../src/lib/floor.js";
const STATIONS = [
  { id: "chess", footprint: { x: 16, y: 43, w: 16, h: 14 } },
  { id: "gym", footprint: { x: 54, y: 39, w: 44, h: 22 } },
];

describe("floor", () => {
  it("knows what is on the pad", () => {
    expect(onPad({ x: -5, y: 90 })).toBe(false);
    expect(onPad({ x: 50, y: 40 })).toBe(true);
  });

  it("tiles are 6 units and keyed by column and row, negatives included", () => {
    expect(TILE).toBe(6);
    expect(tileKey({ x: -5, y: 90 })).toBe("-1,15");
  });

  it("tilesAround gives the 3 by 3 block", () => {
    const t = tilesAround({ x: 3, y: 3 });
    expect(t).toHaveLength(9);
    expect(t).toContain("-1,-1");
    expect(t).toContain("1,1");
  });

  it("collides with a footprint", () => {
    expect(collides({ x: 30, y: 46 }, { x: 28, y: 44, w: 12, h: 6 })).toBe(true);
    expect(collides({ x: 60, y: 60 }, { x: 28, y: 44, w: 12, h: 6 })).toBe(false);
  });

  it("resolveCollision refuses a step into a footprint", () => {
    const fp = [{ x: 28, y: 44, w: 12, h: 6 }];
    expect(resolveCollision({ x: 26, y: 46 }, { x: 29, y: 46 }, fp)).toEqual({ x: 26, y: 46 });
    expect(resolveCollision({ x: 20, y: 46 }, { x: 21, y: 46 }, fp)).toEqual({ x: 21, y: 46 });
  });

  it("finds the nearest station within 6 units of its footprint edge", () => {
    expect(nearestStation({ x: 34, y: 52 }, STATIONS).id).toBe("chess");
    expect(nearestStation({ x: 50, y: 70 }, STATIONS)).toBeNull();
  });

  it("orders front to back by pad y minus pad x", () => {
    expect(depthKey({ x: 10, y: 50 })).toBeGreaterThan(depthKey({ x: 60, y: 10 }));
    expect(zIndexFor(44, 50)).toBe(10);
    expect(zIndexFor(44, 40)).toBe(1);
  });
});
