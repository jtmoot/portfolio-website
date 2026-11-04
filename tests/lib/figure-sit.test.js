import { describe, it, expect } from "vitest";
import { ACTIONS, bodyFootprints, initialFigure, settleAt, settleMs, standPoint, stepFigure, walkPoint } from "../../src/lib/figure.js";
import { LAYOUT } from "../../src/creative/stations/layout.js";

const stations = ["chess", "reading", "corkboard"].map((id) => LAYOUT[id]);
const ctx = { stations, footprints: bodyFootprints(stations) };
const run = (s, input, seconds, ms = 1000 / 60) => {
  for (let t = 0; t < seconds * 1000 - 1e-6; t += ms) s = stepFigure(s, { dir: null, tapTarget: null, ...input }, ctx, ms / 1000);
  return s;
};
const reading = LAYOUT.reading;
const SIT = settleMs("reading");
const standing = (s) => s.pose === null || /^[wj]\d$/.test(`${s.gait}${s.frame}`) && s.pose === null;

describe("the reading chair", () => {
  it("has two sitting-down frames that carry his hips a third and two thirds of the way to the seat", () => {
    expect(SIT).toBe(220);
    expect(settleAt("reading", 0)).toEqual({ pose: "sitdown1", frac: 0.35 });
    expect(settleAt("reading", 150)).toEqual({ pose: "sitdown2", frac: 0.7 });
    expect(settleAt("reading", 220)).toBeNull();
    expect(settleAt("reading", 0, true)).toEqual({ pose: "sitdown2", frac: 0.7 });
    expect(settleAt("reading", 150, true)).toEqual({ pose: "sitdown1", frac: 0.35 });
    expect(walkPoint(reading)).toEqual(reading.sitFrom);
    expect(settleMs("desk")).toBe(0);
    expect(walkPoint(LAYOUT.desk)).toEqual(standPoint(LAYOUT.desk));
  });

  it("is walked to from the front, sat into with his feet planted, and got up from before he leaves", () => {
    // Start the tour at the chair from the chess table's stand point.
    let s = { ...initialFigure(standPoint(LAYOUT.chess), { greet: false }), idleIndex: 1 };
    const trail = [];
    for (let t = 0; t < 30 && !(s.idleIndex === 2 && s.route.length === 0 && s.pose === null && s.pos.x > 7); t += 1 / 60) {
      s = stepFigure(s, { dir: null, tapTarget: null }, ctx, 1 / 60);
      trail.push({ x: s.pos.x, y: s.pos.y, pose: s.pose, seated: s.seated, rising: s.rising, idle: s.idleIndex });
    }
    // Standing (no pose, at the chair) he is never inside the cushion: the only way past its front is sitting down.
    const inCushion = (p) => p.x > reading.sitFrom.x + 0.05 && p.x < 23 && p.y > 40 && p.y < 52;
    expect(trail.filter((p) => p.idle === 1 && p.pose === null && inCushion(p))).toEqual([]);
    const seated = trail.filter((p) => p.seated && p.pose === "sit1");
    expect(seated.length).toBeGreaterThan(30);
    for (const p of seated) expect([p.x, p.y]).toEqual([standPoint(reading).x, standPoint(reading).y]);
    const poses = trail.map((p) => p.pose);
    const first = (name) => poses.indexOf(name);
    expect(first("sitdown1")).toBeGreaterThan(-1);
    expect(first("sitdown1")).toBeLessThan(first("sitdown2"));
    expect(first("sitdown2")).toBeLessThan(first("sit1"));
    // Getting up: sitdown2 then sitdown1 after the last seated frame, then he walks off from his standing spot.
    const lastSeat = poses.lastIndexOf("sit1");
    expect(poses.indexOf("sitdown2", lastSeat)).toBeGreaterThan(lastSeat);
    expect(poses.indexOf("sitdown1", lastSeat)).toBeGreaterThan(poses.indexOf("sitdown2", lastSeat));
    const left = trail.find((p, i) => i > lastSeat && p.idle === 2 && p.pose === null);
    expect(left.x).toBeCloseTo(reading.sitFrom.x, 1);
  });

  it("gets up before it answers a steer, and a tap waits for him to stand", () => {
    let s = { ...initialFigure(standPoint(LAYOUT.chess), { greet: false }), idleIndex: 1 };
    for (let t = 0; t < 30 && !s.seated; t += 1 / 60) s = stepFigure(s, { dir: null, tapTarget: null }, ctx, 1 / 60);
    expect(s.seated).toBe(true);
    s = stepFigure(s, { dir: { dx: 0, dy: 1 }, tapTarget: null }, ctx, 1 / 60);
    expect(s.rising).toBeGreaterThan(0);
    // The first getting-up frame at once: hips two thirds of the way back toward where he stood, not a step taken.
    expect(s.pose).toBe("sitdown2");
    expect(s.pos.y).toBe(46);
    expect(s.pos.x).toBeCloseTo(reading.sitFrom.x + 0.7 * (standPoint(reading).x - reading.sitFrom.x), 5);
    s = run(s, { dir: { dx: 0, dy: 1 } }, 0.3);
    expect(s.seated).toBe(false);
    expect(s.control).toBe("user");
    expect(s.pos.y).toBeGreaterThan(reading.sitFrom.y + 0.5);
  });

  it("takes a tap on its stand point as a tap on the chair: he walks to the front and sits", () => {
    let s = initialFigure({ x: 40, y: 80 }, { greet: false });
    s = stepFigure(s, { dir: null, tapTarget: standPoint(reading) }, ctx, 1 / 60);
    expect(s.target).toEqual(walkPoint(reading));
    for (let t = 0; t < 30 && !s.seated; t += 1 / 60) s = stepFigure(s, { dir: null, tapTarget: null }, ctx, 1 / 60);
    expect(s.seated).toBe(true);
    expect(s.idleIndex).toBe(1);
    expect(ACTIONS.reading.frames.map(([n]) => n)).toContain(s.pose);
  });
});
