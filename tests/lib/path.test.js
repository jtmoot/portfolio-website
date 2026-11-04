import { describe, it, expect } from "vitest";
import { findPath } from "../../src/lib/path.js";
import { collides } from "../../src/lib/floor.js";

const ROOM = { w: 130, h: 100 };
const BOXES = [
  { x: 9, y: 60, w: 27, h: 14 },
  { x: 50, y: 58, w: 44, h: 22 },
];

const clear = (route, from) => {
  let a = from;
  for (const b of route) {
    for (let t = 0; t <= 1; t += 0.02) {
      const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      if (BOXES.some((f) => collides(p, f))) return false;
    }
    a = b;
  }
  return true;
};

describe("findPath", () => {
  it("goes straight when nothing is in the way", () => {
    expect(findPath({ x: 10, y: 20 }, { x: 40, y: 30 }, BOXES, ROOM)).toEqual([{ x: 40, y: 30 }]);
  });

  it("walks round a table to the far side", () => {
    const from = { x: 72, y: 52 };
    const to = { x: 24, y: 78 };
    const route = findPath(from, to, BOXES, ROOM);
    expect(route.at(-1)).toEqual(to);
    expect(clear(route, from)).toBe(true);
    expect(route.length).toBeLessThan(6);
  });

  it("returns null when the goal is inside furniture", () => {
    expect(findPath({ x: 10, y: 20 }, { x: 20, y: 65 }, BOXES, ROOM)).toBeNull();
  });
});

describe("findPath clearance", () => {
  it("walks a lane clear of furniture instead of hugging its edge", async () => {
    const { LAYOUT } = await import("../../src/creative/stations/layout.js");
    const { bodyFootprints, standPoint } = await import("../../src/lib/figure.js");
    const { FLOOR } = await import("../../src/lib/floor.js");
    const fps = bodyFootprints(Object.values(LAYOUT));
    const route = findPath(standPoint(LAYOUT.library), standPoint(LAYOUT.plants), fps, FLOOR);
    const desk = LAYOUT.desk.footprint;
    const gap = (p) => Math.max(desk.x - p.x, p.x - (desk.x + desk.w), p.y - (desk.y + desk.h), 0);
    for (const p of route.slice(0, -1)) expect(gap(p), JSON.stringify(p)).toBeGreaterThanOrEqual(5.5);
  });
});
