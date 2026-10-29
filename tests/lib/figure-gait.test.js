import { describe, it, expect } from "vitest";
import { SPEED, WALK_STEP, JOG_STEP, JOG_AT, GAIT_FRAMES, initialFigure, stepFigure, frameName } from "../../src/lib/figure.js";

const CTX = { stations: [], footprints: [] };
const walk = (speed, seconds) => {
  let s = initialFigure({ x: 40, y: 40 }, { greet: false });
  const names = [];
  let dist = 0;
  for (let t = 0; t < seconds; t += 1 / 60) {
    const before = s.pos;
    s = stepFigure(s, { dir: { dx: 1, dy: 0 }, tapTarget: null }, { ...CTX, speed }, 1 / 60);
    dist += Math.hypot(s.pos.x - before.x, s.pos.y - before.y);
    names.push(frameName(s));
  }
  return { s, names, dist };
};
const changes = (names) => names.filter((n, i) => i > 0 && n !== names[i - 1]).length;

describe("gait", () => {
  it("defaults to round 1's 2x speed", () => {
    expect(SPEED).toBe(18);
  });

  it("walks at the default speed and jogs from JOG_AT up", () => {
    expect(walk(1, 1).names.at(-1)).toMatch(/^w[1-6]$/);
    expect(walk(JOG_AT + 0.05, 1).names.at(-1)).toMatch(/^j[1-6]$/);
    expect(GAIT_FRAMES).toBe(6);
  });

  it("steps by distance, so his legs keep pace with the ground at any speed", () => {
    for (const speed of [0.5, 1, 1.3]) {
      const { names, dist } = walk(speed, 3);
      expect(changes(names)).toBeGreaterThanOrEqual(Math.floor(dist / WALK_STEP) - 1);
      expect(changes(names)).toBeLessThanOrEqual(Math.ceil(dist / WALK_STEP) + 1);
    }
    const { names, dist } = walk(2, 3);
    expect(changes(names)).toBeGreaterThanOrEqual(Math.floor(dist / JOG_STEP) - 1);
    expect(changes(names)).toBeLessThanOrEqual(Math.ceil(dist / JOG_STEP) + 1);
  });

  it("stands idle when he stops", () => {
    const { s } = walk(1, 0.5);
    const still = stepFigure(s, { dir: null, tapTarget: null }, { ...CTX, stations: [] }, 1 / 60);
    expect(frameName(still)).toBe("idle");
  });
});
