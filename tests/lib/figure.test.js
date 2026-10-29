import { describe, it, expect } from "vitest";
import { SPEED, IDLE_RESUME_MS, initialFigure, keyToDir, stepFigure, facingOf, standPoint } from "../../src/lib/figure.js";

const STATIONS = [
  { id: "desk", footprint: { x: 27, y: 0, w: 32, h: 16 } },
  { id: "chess", footprint: { x: 28, y: 44, w: 12, h: 6 } },
];
const CTX = { stations: STATIONS, footprints: STATIONS.map((s) => s.footprint) };
const run = (state, input, seconds, step = 1 / 60) => {
  let s = state;
  for (let t = 0; t < seconds - 1e-9; t += step) s = stepFigure(s, { dir: null, tapTarget: null, ...input }, CTX, step);
  return s;
};

describe("keyToDir", () => {
  it("maps arrows and WASD to screen directions on the floor", () => {
    const r = keyToDir("ArrowRight");
    expect(r.dx).toBeCloseTo(Math.SQRT1_2, 6);
    expect(r.dy).toBeCloseTo(Math.SQRT1_2, 6);
    expect(keyToDir("w")).toEqual(keyToDir("ArrowUp"));
    expect(keyToDir("x")).toBeNull();
  });
});

describe("stepFigure", () => {
  it("walks at SPEED units a second and faces the way it goes", () => {
    const s0 = initialFigure({ x: 50, y: 30 });
    const s1 = run(s0, { dir: keyToDir("ArrowRight") }, 1);
    expect(Math.hypot(s1.pos.x - 50, s1.pos.y - 30)).toBeCloseTo(SPEED, 1);
    expect(s1.facing).toBe("dr");
    expect(s1.control).toBe("user");
  });

  it("hands control back to the idle walk after IDLE_RESUME_MS without input", () => {
    const s1 = run(initialFigure({ x: 50, y: 30 }), { dir: keyToDir("ArrowLeft") }, 0.2);
    const s2 = run(s1, {}, IDLE_RESUME_MS / 1000 + 0.1);
    expect(s2.control).toBe("idle");
  });

  it("refuses a step into a station footprint", () => {
    const s0 = initialFigure({ x: 27.9, y: 46 });
    const s1 = stepFigure(s0, { dir: { dx: 1, dy: 0 }, tapTarget: null }, CTX, 0.1);
    expect(s1.pos).toEqual({ x: 27.9, y: 46 });
  });

  it("walking off the front edge sketches tiles in around it", () => {
    const s0 = initialFigure({ x: 50, y: 77.5 });
    const s1 = run(s0, { dir: { dx: 0, dy: 1 } }, 0.3);
    expect(s1.pos.y).toBeGreaterThan(78);
    expect(s1.tiles.size).toBeGreaterThanOrEqual(9);
  });

  it("cannot walk through the back walls", () => {
    const s1 = run(initialFigure({ x: 99, y: 30 }), { dir: { dx: 1, dy: 0 } }, 1);
    expect(s1.pos.x).toBeLessThanOrEqual(100);
    const s2 = run(initialFigure({ x: 70, y: 20 }), { dir: { dx: 0, dy: -1 } }, 3);
    expect(s2.pos.y).toBeGreaterThanOrEqual(0);
  });

  it("left standing off the pad for a minute falls exactly once, then reappears at the desk", () => {
    const off = run(initialFigure({ x: 50, y: 77.5 }), { dir: { dx: 0, dy: 1 } }, 0.5);
    const fell = stepFigure(off, { dir: null, tapTarget: null }, CTX, 60);
    expect(fell.falling).toBe(true);
    const back = stepFigure(fell, { dir: null, tapTarget: null }, CTX, 1.1);
    expect(back.falling).toBe(false);
    expect(back.control).toBe("idle");
    expect(back.tiles.size).toBe(0);
    expect(back.pos).toEqual({ x: 43, y: 18 });
  });

  it("walks to a tapped point and stops there", () => {
    const s1 = run(initialFigure({ x: 50, y: 30 }), {}, 0.01);
    const s2 = stepFigure(s1, { dir: null, tapTarget: { x: 60, y: 30 } }, CTX, 0.01);
    const s3 = run(s2, {}, 2);
    expect(s3.pos.x).toBeCloseTo(60, 1);
    expect(s3.pos.y).toBeCloseTo(30, 1);
  });

  it("facingOf reads screen quadrants", () => {
    expect(facingOf({ dx: 1, dy: 0 })).toBe("ur");
    expect(facingOf({ dx: 0, dy: 1 })).toBe("dr");
    expect(facingOf({ dx: -1, dy: 0 })).toBe("dl");
    expect(facingOf({ dx: 0, dy: -1 })).toBe("ul");
  });

  it("idle walk detours around furniture instead of sticking to it", () => {
    const stations = [
      { id: "library", footprint: { x: 6, y: 0, w: 18, h: 7 } },
      { id: "plants", footprint: { x: 62, y: 0, w: 22, h: 11 }, standAt: { x: 73, y: 13 } },
      { id: "desk", footprint: { x: 27, y: 0, w: 32, h: 16 } },
    ];
    const ctx = { stations: stations.slice(0, 2), footprints: stations.map((st) => st.footprint) };
    let st = { ...initialFigure({ x: 15, y: 9 }), idleIndex: 1 };
    for (let i = 0; i < 60 * 15; i++) st = stepFigure(st, { dir: null, tapTarget: null }, ctx, 1 / 60);
    const reached = Math.hypot(st.pos.x - 73, st.pos.y - 13) < 0.5 || st.idleIndex !== 1;
    expect(reached).toBe(true);
  });

  it("standAt overrides the computed stand point", () => {
    expect(standPoint({ footprint: { x: 0, y: 0, w: 10, h: 10 }, standAt: { x: 3, y: 4 } })).toEqual({ x: 3, y: 4 });
  });
});
