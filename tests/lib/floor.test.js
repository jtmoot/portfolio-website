import { describe, it, expect } from "vitest";
import { onPad, TILE, tileKey, tilesAround, collides, resolveCollision, nearestStation, zIndexFor, depthKey, inFront, stackOrder } from "../../src/lib/floor.js";
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

describe("draw order", () => {
  const kitchen = { x: 118, y: 30, w: 13, h: 36 };
  it("puts him in front of a box he stands before, even beside a long one", () => {
    // Past the end of the kitchen run, nearer the viewer than its front face: in front.
    expect(inFront({ x: 112, y: 20 }, kitchen)).toBe(true);
    expect(inFront({ x: 112, y: 70 }, kitchen)).toBe(true);
    // Tucked behind its far end, against the back wall: behind.
    expect(inFront({ x: 124, y: 20 }, kitchen)).toBe(false);
  });

  it("stacks boxes so each one is drawn after everything it stands in front of", () => {
    const boxes = [
      { id: "gym", footprint: { x: 50, y: 58, w: 44, h: 22 } },
      { id: "desk", footprint: { x: 38, y: 0, w: 32, h: 16 } },
      { id: "kitchen", footprint: kitchen },
      { id: "chess", footprint: { x: 14, y: 60, w: 16, h: 14 } },
    ];
    const order = stackOrder(boxes).map((b) => b.id);
    expect(order.indexOf("desk")).toBeLessThan(order.indexOf("gym"));
    expect(order.indexOf("kitchen")).toBeLessThan(order.indexOf("gym"));
    expect(order.indexOf("desk")).toBeLessThan(order.indexOf("chess"));
  });
});

describe("paintOrder", () => {
  it("slots the figure between the boxes it stands behind and in front of", async () => {
    const { paintOrder } = await import("../../src/lib/floor.js");
    const boxes = [
      { id: "kitchen", footprint: { x: 117, y: 30, w: 13, h: 36 } },
      { id: "chess", footprint: { x: 9, y: 60, w: 27, h: 14 } },
      { id: "desk", footprint: { x: 38, y: 0, w: 32, h: 16 } },
    ];
    // Just behind the chess chair (x past its back-right face): before chess.
    const order = paintOrder(boxes, { x: 38, y: 66 });
    expect(order.indexOf("figure")).toBeLessThan(order.indexOf("chess"));
    // In front of the desk, which rises behind him on screen, and behind the chess table: between them.
    const between = paintOrder(boxes, { x: 54, y: 30 });
    expect(between.indexOf("figure")).toBeGreaterThan(between.indexOf("desk"));
    expect(between.indexOf("figure")).toBeLessThan(between.indexOf("chess"));
    // In front of the chess table: after everything.
    expect(paintOrder(boxes, { x: 24, y: 80 }).at(-1)).toBe("figure");
  });
});

