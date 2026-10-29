import { describe, it, expect } from "vitest";
import { iso, CM_PER_UNIT, floorToWorld, worldToFloor, artPlacement } from "../../src/lib/iso.js";

describe("iso", () => {
  it("origin maps to OX,OY", () => {
    expect(iso(0, 0, 0, { OX: 100, OY: 60 })).toEqual([100, 60]);
  });
  it("x axis goes down-right", () => {
    const [sx, sy] = iso(1, 0, 0, { S: 10 });
    expect(sx).toBeCloseTo(8.66, 2);
    expect(sy).toBeCloseTo(5, 5);
  });
  it("y axis goes down-left", () => {
    const [sx, sy] = iso(0, 1, 0, { S: 10 });
    expect(sx).toBeCloseTo(-8.66, 2);
    expect(sy).toBeCloseTo(5, 5);
  });
  it("z goes straight up", () => {
    const [sx, sy] = iso(0, 0, 1, { S: 10 });
    expect(sx).toBeCloseTo(0, 9);
    expect(sy).toBeCloseTo(-10, 9);
  });
});

describe("floor and world", () => {
  it("one floor unit is five centimetres", () => {
    expect(CM_PER_UNIT).toBe(5);
  });
  it("pad y runs along kit x and pad x runs against kit y", () => {
    expect(floorToWorld({ x: 10, y: 4 })).toEqual([20, -50]);
  });
  it("round-trips", () => {
    const p = worldToFloor(floorToWorld({ x: 33.5, y: 12.25 }));
    expect(p.x).toBeCloseTo(33.5, 9);
    expect(p.y).toBeCloseTo(12.25, 9);
  });
});

describe("artPlacement", () => {
  it("sizes the art at one cqw per five svg units and puts the anchor on the floor point", () => {
    expect(artPlacement({ width: 500, height: 300, anchor: [200, 250] })).toEqual({ width: 100, left: -40, top: -50 });
  });
});
