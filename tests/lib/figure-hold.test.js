import { describe, it, expect } from "vitest";
import { SPEED, PAUSE_MS, initialFigure, keyToDir, stepFigure, standPoint } from "../../src/lib/figure.js";

const STATIONS = [
  { id: "desk", footprint: { x: 27, y: 0, w: 32, h: 16 } },
  { id: "chess", footprint: { x: 28, y: 44, w: 12, h: 6 } },
];
const CTX = { stations: STATIONS, footprints: STATIONS.map((s) => s.footprint) };
const run = (state, input, seconds, ctx = CTX, step = 1 / 60) => {
  let s = state;
  for (let t = 0; t < seconds - 1e-9; t += step) s = stepFigure(s, { dir: null, tapTarget: null, ...input }, ctx, step);
  return s;
};

describe("station pause", () => {
  it("lingers 4 s at each station", () => {
    expect(PAUSE_MS).toBe(4000);
  });
});

describe("hold", () => {
  it("freezes the idle tour while a card is held open", () => {
    const at = standPoint(STATIONS[0]);
    const arrived = run(initialFigure(at), {}, 0.1);
    expect(arrived.pauseLeft).toBeGreaterThan(0);
    const held = run(arrived, { hold: true }, PAUSE_MS / 1000 + 2);
    expect(held.idleIndex).toBe(arrived.idleIndex);
    expect(held.pos).toEqual(arrived.pos);
  });

  it("stops the idle walk where he is", () => {
    const s0 = initialFigure({ x: 50, y: 30 });
    const s1 = run(s0, { hold: true }, 1);
    expect(s1.pos).toEqual({ x: 50, y: 30 });
    expect(s1.frame).toBe(0);
  });

  it("still lets the keyboard steer", () => {
    const s1 = run(initialFigure({ x: 50, y: 30 }), { hold: true, dir: keyToDir("ArrowRight") }, 1);
    expect(Math.hypot(s1.pos.x - 50, s1.pos.y - 30)).toBeCloseTo(SPEED, 1);
  });
});

describe("speed", () => {
  it("scales walking by ctx.speed", () => {
    const s1 = run(initialFigure({ x: 50, y: 30 }), { dir: keyToDir("ArrowRight") }, 1, { ...CTX, speed: 2 });
    expect(Math.hypot(s1.pos.x - 50, s1.pos.y - 30)).toBeCloseTo(SPEED * 2, 1);
    const s2 = run(initialFigure({ x: 50, y: 30 }), { dir: keyToDir("ArrowRight") }, 1, { ...CTX, speed: 0.5 });
    expect(Math.hypot(s2.pos.x - 50, s2.pos.y - 30)).toBeCloseTo(SPEED / 2, 1);
  });
});
