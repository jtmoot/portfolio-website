import { describe, it, expect } from "vitest";
import { VIEW, floorToScreen, screenToFloor, padTransform, fitView, FLOOR } from "../../src/lib/floorView.js";

describe("floorView", () => {
  it("the floor is 100 by 78 and the default view is the spec's 0.62 scale, 54.7 deg tilt, 6 cqw drop", () => {
    expect(FLOOR).toEqual({ w: 100, h: 78 });
    expect(VIEW).toEqual({ scale: 0.62, tilt: 54.7, spin: -45, drop: 6 });
  });

  it("the floor centre lands at the transform origin plus the drop", () => {
    const p = floorToScreen({ x: 50, y: 39 });
    expect(p.left).toBeCloseTo(50, 6);
    expect(p.top).toBeCloseTo(45, 6);
  });

  it("pad x runs up-right and pad y runs down-right, in true isometric proportion", () => {
    const o = floorToScreen({ x: 50, y: 39 });
    const px = floorToScreen({ x: 51, y: 39 });
    const py = floorToScreen({ x: 50, y: 40 });
    expect(px.left - o.left).toBeGreaterThan(0);
    expect(px.top - o.top).toBeLessThan(0);
    expect(py.left - o.left).toBeGreaterThan(0);
    expect(py.top - o.top).toBeGreaterThan(0);
    expect(Math.abs((py.top - o.top) / (py.left - o.left))).toBeCloseTo(Math.tan(Math.PI / 6), 2);
  });

  it("padTransform writes the same numbers as CSS", () => {
    expect(padTransform(VIEW)).toBe("translateY(6cqw) scale(0.62) rotateX(54.7deg) rotateZ(-45deg)");
  });

  it("fitView shrinks the scale when the viewport is short and never grows past the spec", () => {
    expect(fitView({ w: 1512, h: 2000 }).scale).toBe(0.62);
    const short = fitView({ w: 1512, h: 700 });
    expect(short.scale).toBeLessThan(0.62);
    expect(short.scale).toBeGreaterThan(0.3);
  });

  it("screenToFloor inverts floorToScreen", () => {
    const v = fitView({ w: 1440, h: 900 });
    const back = screenToFloor(floorToScreen({ x: 12.5, y: 61 }, v), v);
    expect(back.x).toBeCloseTo(12.5, 6);
    expect(back.y).toBeCloseTo(61, 6);
  });
});
