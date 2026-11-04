import { describe, it, expect } from "vitest";
import { ACTIONS, OVER_POSES, GREET_MS, GREET_WAIT_MS, HELLO_MS, PAUSE_MS, initialFigure, keyToDir, poseAt, standPoint, stepFigure } from "../../src/lib/figure.js";

const STATIONS = [
  { id: "desk", footprint: { x: 38, y: 0, w: 32, h: 16 } },
  { id: "kitchen", footprint: { x: 117, y: 30, w: 13, h: 36 }, standAt: { x: 113, y: 48 } },
];
const CTX = { stations: STATIONS, footprints: STATIONS.map((s) => s.footprint) };
const run = (state, input, seconds, step = 1 / 60) => {
  let s = state;
  for (let t = 0; t < seconds - 1e-9; t += step) s = stepFigure(s, { dir: null, tapTarget: null, ...input }, CTX, step);
  return s;
};

describe("poseAt", () => {
  it("walks through an action's frames by time, and loops the looping ones", () => {
    const lib = ACTIONS.library;
    expect(poseAt("library", 0)).toBe(lib.frames[0][0]);
    expect(poseAt("library", lib.frames[0][1] + 1)).toBe(lib.frames[1][0]);
    const desk = ACTIONS.desk;
    const cycle = desk.frames.reduce((a, [, ms]) => a + ms, 0);
    expect(poseAt("desk", cycle + 1)).toBe(desk.frames[0][0]);
    expect(poseAt("corkboard", 500)).toBeNull();
  });

  it("every action fits inside the station stop", () => {
    for (const [id, a] of Object.entries(ACTIONS)) {
      if (a.loop) continue;
      expect(a.frames.reduce((s, [, ms]) => s + ms, 0), id).toBeLessThanOrEqual(PAUSE_MS);
    }
  });
});

describe("reaching over", () => {
  it("marks the chess poses as reaching over the table", () => {
    expect(OVER_POSES.has("chess1")).toBe(true);
    expect(OVER_POSES.has("chess2")).toBe(true);
    expect(OVER_POSES.has("type1")).toBe(false);
  });
});

describe("plants", () => {
  it("waters the plants: lifts the can, tips it, and pours", () => {
    const names = ACTIONS.plants.frames.map(([n]) => n);
    expect(names[0]).toBe("water1");
    expect(names).toContain("water2");
    expect(names).toContain("water3");
    expect(ACTIONS.plants.facing).toBe("ul");
  });
});

describe("station actions", () => {
  it("turns to face the station and plays its action while he stops there", () => {
    const at = initialFigure(standPoint(STATIONS[0]), { greet: false });
    const s = run(at, {}, 0.5);
    expect(s.pauseLeft).toBeGreaterThan(0);
    expect(s.facing).toBe(ACTIONS.desk.facing);
    expect(ACTIONS.desk.frames.map(([n]) => n)).toContain(s.pose);
  });

  it("drops the pose as soon as he walks on", () => {
    const at = run(initialFigure(standPoint(STATIONS[0]), { greet: false }), {}, 0.5);
    const moving = run(at, { dir: keyToDir("ArrowDown") }, 0.2);
    expect(moving.pose).toBeNull();
  });
});

describe("greeting", () => {
  it("waits for the room to settle, standing still and facing out, before it starts", () => {
    const s = run(initialFigure({ x: 54, y: 26 }), {}, GREET_WAIT_MS / 1000 - 0.1);
    expect(s.pos).toEqual({ x: 54, y: 26 });
    expect(s.facing).toBe("dr");
    expect(s.greeting).toBe(true);
    expect(s.pose).toBeNull();
    expect(s.helloLeft).toBe(HELLO_MS);
  });

  it("raises his arm and holds it, then waves broadly a few times, without a hop", () => {
    let s = initialFigure({ x: 54, y: 26 });
    const poses = [];
    for (let t = 0; t < (GREET_WAIT_MS + GREET_MS) / 1000; t += 1 / 60) {
      s = stepFigure(s, { dir: null, tapTarget: null }, CTX, 1 / 60);
      if (poses.at(-1) !== s.pose) poses.push(s.pose);
      expect(s.pos).toEqual({ x: 54, y: 26 });
    }
    expect(poses.slice(0, 3)).toEqual([null, "raise", "wave1"]);
    expect(poses.filter((p) => p === "wave2").length).toBeGreaterThanOrEqual(3);
  });

  it("waves for about three seconds once it starts", () => {
    expect(GREET_WAIT_MS).toBe(1500);
    expect(GREET_MS).toBeGreaterThanOrEqual(2600);
    expect(GREET_MS).toBeLessThanOrEqual(3400);
  });

  it("keeps the hello up for 5 s from the first wave, even after he sets off", () => {
    expect(HELLO_MS).toBe(5000);
    let s = run(initialFigure({ x: 54, y: 26 }), {}, GREET_WAIT_MS / 1000 + 0.1);
    expect(s.helloLeft).toBeLessThan(HELLO_MS);
    s = run(s, {}, GREET_MS / 1000 + 0.5);
    expect(s.greeting).toBe(false);
    expect(s.helloLeft).toBeGreaterThan(0);
    s = run(s, {}, 3);
    expect(s.helloLeft).toBe(0);
  });

  it("stops waving the moment someone steers, and the hello stays", () => {
    let s = run(initialFigure({ x: 54, y: 26 }), {}, GREET_WAIT_MS / 1000 + 0.5);
    s = run(s, { dir: keyToDir("ArrowDown") }, 0.1);
    expect(s.greeting).toBe(false);
    expect(s.pose).toBeNull();
    expect(s.helloLeft).toBeGreaterThan(0);
  });

  it("under reduced motion says hello without waving", () => {
    const s = run(initialFigure({ x: 54, y: 26 }, { greet: false, hello: true }), {}, 1);
    expect(s.greeting).toBe(false);
    expect(["raise", "wave1", "wave2"]).not.toContain(s.pose);
    expect(s.helloLeft).toBeCloseTo(HELLO_MS - 1000, 0);
  });
});

describe("tapping a station", () => {
  it("walks him there and plays its action, then carries on the tour", () => {
    const start = initialFigure({ x: 80, y: 40 }, { greet: false });
    const kitchen = STATIONS[1];
    let s = stepFigure(start, { dir: null, tapTarget: standPoint(kitchen) }, CTX, 1 / 60);
    s = run(s, {}, 5);
    expect(s.pose && ACTIONS.kitchen.frames.map(([n]) => n).includes(s.pose)).toBe(true);
    expect(s.facing).toBe(ACTIONS.kitchen.facing);
    s = run(s, {}, PAUSE_MS / 1000 + 0.2);
    expect(s.control).toBe("idle");
  });
});

describe("holding at a station", () => {
  it("keeps playing the action while a card is open, and only leaves once it closes", () => {
    const at = initialFigure(standPoint(STATIONS[0]), { greet: false });
    let s = run(at, {}, 0.2);
    s = run(s, { hold: true }, 0.2);
    expect(ACTIONS.desk.frames.map(([n]) => n)).toContain(s.pose);
    s = run(s, { hold: true }, PAUSE_MS / 1000 + 2);
    expect(ACTIONS.desk.frames.map(([n]) => n)).toContain(s.pose);
    expect(Math.hypot(s.pos.x - standPoint(STATIONS[0]).x, s.pos.y - standPoint(STATIONS[0]).y)).toBeLessThan(0.5);
    s = run(s, {}, PAUSE_MS / 1000 + 1);
    expect(s.idleIndex).not.toBe(0);
  });
});

describe("after the hello", () => {
  it("sets off within half a second of waving, to the desk he starts beside", () => {
    const stations = [
      { id: "desk", footprint: { x: 38, y: 0, w: 32, h: 16 } },
      { id: "library", footprint: { x: 8, y: 0, w: 18, h: 7 } },
    ];
    const ctx = { stations, footprints: stations.map((s) => s.footprint) };
    let s = initialFigure({ x: 54, y: 26 });
    for (let t = 0; t < (GREET_WAIT_MS + GREET_MS) / 1000 + 0.5; t += 1 / 60) s = stepFigure(s, { dir: null, tapTarget: null }, ctx, 1 / 60);
    expect(s.greeting).toBe(false);
    expect(s.idleIndex).toBe(0);
    expect(s.pos.y).toBeLessThan(25);
  });

  it("waves for about three seconds", () => {
    expect(GREET_MS).toBeLessThanOrEqual(3000);
  });
});

describe("walking the real room", () => {
  it("goes from the library to the plants without touching the desk", async () => {
    const { LAYOUT } = await import("../../src/creative/stations/layout.js");
    const { bodyFootprints } = await import("../../src/lib/figure.js");
    const order = ["desk", "library", "plants"];
    const stations = order.map((id) => LAYOUT[id]);
    const ctx = { stations, footprints: bodyFootprints(Object.values(LAYOUT)) };
    let s = { ...initialFigure(standPoint(LAYOUT.library), { greet: false }), idleIndex: 2 };
    const desk = LAYOUT.desk.footprint;
    let closest = Infinity;
    for (let t = 0; t < 12; t += 1 / 60) {
      s = stepFigure(s, { dir: null, tapTarget: null }, ctx, 1 / 60);
      const gap = Math.max(desk.x - s.pos.x, s.pos.x - (desk.x + desk.w), s.pos.y - (desk.y + desk.h));
      closest = Math.min(closest, gap);
      if (s.pauseLeft > 0 && s.idleIndex === 2) break;
    }
    expect(s.idleIndex === 2 && s.pauseLeft > 0, "reached the plants").toBe(true);
    expect(closest).toBeGreaterThanOrEqual(5);
  });
});
