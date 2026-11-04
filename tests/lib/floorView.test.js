import { describe, it, expect } from "vitest";
import { VIEW, floorToScreen, screenToFloor, padTransform, fitView, FLOOR, POSTER, sceneBounds } from "../../src/lib/floorView.js";

describe("floorView", () => {
  it("the room is 150 by 100 on a 100 by 78 poster, and the default view is 0.62 scale, 54.7 deg tilt, 6 cqw drop", () => {
    expect(FLOOR).toEqual({ w: 150, h: 100 });
    expect(POSTER).toEqual({ w: 100, h: 78 });
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
    expect(fitView({ w: 1512, h: 2000 }).scale).toBeLessThanOrEqual(0.62);
    const short = fitView({ w: 1512, h: 700 });
    expect(short.scale).toBeLessThan(0.62);
    expect(short.scale).toBeGreaterThan(0.2);
  });

  it("screenToFloor inverts floorToScreen", () => {
    const v = fitView({ w: 1440, h: 900 });
    const back = screenToFloor(floorToScreen({ x: 12.5, y: 61 }, v), v);
    expect(back.x).toBeCloseTo(12.5, 6);
    expect(back.y).toBeCloseTo(61, 6);
  });

  it("phones get a larger room that still fits the width", () => {
    const v = fitView({ w: 390, h: 844 });
    expect(v.scale).toBeGreaterThan(0.62);
    expect(v.scale).toBeLessThanOrEqual(1);
  });
});

describe("sceneBounds", () => {
  it("holds every floor corner and the tops of both back walls", () => {
    const b = sceneBounds(VIEW);
    for (const [x, y] of [[0, 0], [150, 0], [150, 100], [0, 100]]) {
      const p = floorToScreen({ x, y }, VIEW);
      expect(p.left).toBeGreaterThanOrEqual(b.left - 1e-6);
      expect(p.left).toBeLessThanOrEqual(b.right + 1e-6);
      expect(p.top).toBeLessThanOrEqual(b.bottom + 1e-6);
    }
    const corner = floorToScreen({ x: 150, y: 0 }, VIEW);
    expect(b.top).toBeLessThan(corner.top - 46 * 0.8165 * VIEW.scale + 1e-6);
  });
});

describe("fitView fits the whole room on desktop", () => {
  for (const [w, h] of [[1440, 900], [1512, 982], [1280, 720], [1920, 1080]]) {
    it(`${w} by ${h}: the room and its walls sit under the nav and inside the width`, () => {
      const v = fitView({ w, h });
      const cqw = Math.min(w, 1512) / 100;
      const b = sceneBounds(v);
      expect(b.top).toBeGreaterThanOrEqual(5.5 - 1e-6);
      expect(b.bottom).toBeLessThanOrEqual(h / cqw + 1e-6);
      expect(b.right - b.left).toBeLessThanOrEqual(w / cqw + 1e-6);
    });
  }

  it("is smaller than round 1's 0.476 at 1512 by 900, and never grows past the spec", () => {
    expect(fitView({ w: 1512, h: 900 }).scale).toBeLessThan(0.476);
    expect(fitView({ w: 1512, h: 3000 }).scale).toBeLessThanOrEqual(0.62);
  });

  it("phones keep the bigger, panning room", () => {
    expect(fitView({ w: 390, h: 844 }).scale).toBeCloseTo(1, 3);
  });
});
