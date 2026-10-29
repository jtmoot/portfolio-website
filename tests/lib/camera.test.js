import { describe, it, expect } from "vitest";
import { stepCamera, centreOn, deadZone } from "../../src/lib/camera.js";

const VIEW = { left: 0, top: 0, right: 100, bottom: 60 };
const SCENE = { left: -40, top: -10, right: 140, bottom: 90 };

describe("deadZone", () => {
  it("is the middle of the view, with more room below him for the station card", () => {
    const dz = deadZone(VIEW);
    expect(dz.left).toBeCloseTo(28, 6);
    expect(dz.right).toBeCloseTo(72, 6);
    expect(dz.top).toBeCloseTo(13.2, 6);
    expect(dz.bottom).toBeCloseTo(37.2, 6);
  });
});

describe("stepCamera", () => {
  const step = (pan, fig, opts = {}) => stepCamera(pan, { fig, scene: SCENE, view: VIEW, dt: 1 / 60, still: true, ...opts });

  it("stays put while the figure is inside the dead zone", () => {
    expect(step({ x: 0, y: 0 }, { x: 50, y: 25 })).toEqual({ x: 0, y: 0 });
  });

  it("pans just enough to keep him at the dead zone's edge", () => {
    const pan = step({ x: 0, y: 0 }, { x: 90, y: 30 });
    expect(pan.x).toBeCloseTo(72 - 90, 6);
    expect(pan.y).toBe(0);
  });

  it("never pans past the room's edges", () => {
    const pan = step({ x: 0, y: 0 }, { x: 139, y: 89 });
    expect(pan.x).toBeCloseTo(100 - 140, 6);
    expect(pan.y).toBeCloseTo(60 - 90, 6);
  });

  it("keeps following past the open edges, onto the walk-off tiles", () => {
    const pan = step({ x: 0, y: 0 }, { x: 60, y: 120 });
    expect(60 + 0 + pan.x).toBeGreaterThan(0);
    expect(120 + pan.y).toBeLessThanOrEqual(37.2 + 1e-6);
  });

  it("eases rather than jumps when motion is allowed", () => {
    const pan = step({ x: 0, y: 0 }, { x: 90, y: 30 }, { still: false });
    expect(pan.x).toBeLessThan(0);
    expect(pan.x).toBeGreaterThan(72 - 90);
  });

  it("centres a scene smaller than the view", () => {
    const pan = stepCamera({ x: 0, y: 0 }, { fig: { x: 50, y: 30 }, scene: { left: 20, top: 10, right: 60, bottom: 40 }, view: VIEW, dt: 1 / 60, still: true });
    expect(pan.x).toBeCloseTo(50 - 40, 6);
    expect(pan.y).toBeCloseTo(30 - 25, 6);
  });
});

describe("centreOn", () => {
  it("frames a point in the middle of the view, within the room", () => {
    const pan = centreOn({ x: 60, y: 40 }, SCENE, VIEW);
    expect(pan).toEqual({ x: -10, y: -10 });
    expect(centreOn({ x: -40, y: -10 }, SCENE, VIEW)).toEqual({ x: 40, y: 10 });
  });
});
