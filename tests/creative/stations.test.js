import { describe, it, expect } from "vitest";
import { STATIONS } from "../../src/creative/stations/index.js";
import { initialFigure, standPoint, stepFigure } from "../../src/lib/figure.js";
import { collides } from "../../src/lib/floor.js";
import { FIGURE_START } from "../../src/lib/travelers.js";

const FLOOR = { w: 130, h: 100 };
const WALL_PIECES = new Set(["anatomy", "corkboard"]);

describe("STATIONS", () => {
  it("has the eight stations in idle-route order", () => {
    expect(STATIONS.map((s) => s.id)).toEqual(["desk", "library", "plants", "kitchen", "gym", "chess", "corkboard", "anatomy"]);
  });

  it("footprints lie inside the floor", () => {
    for (const s of STATIONS) {
      expect(s.footprint.x).toBeGreaterThanOrEqual(0);
      expect(s.footprint.y).toBeGreaterThanOrEqual(0);
      expect(s.footprint.x + s.footprint.w).toBeLessThanOrEqual(FLOOR.w);
      expect(s.footprint.y + s.footprint.h).toBeLessThanOrEqual(FLOOR.h);
    }
  });

  it("every station has a label and a component", () => {
    for (const s of STATIONS) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(typeof s.Component).toBe("function");
    }
  });

  it("links follow the spec", () => {
    const links = Object.fromEntries(STATIONS.map((s) => [s.id, s.link]));
    expect(links).toEqual({
      desk: "#experience",
      library: "/shelf",
      gym: "#running",
      kitchen: "#cooking",
      chess: "https://www.chess.com/member/breakfast_enjoyer",
      plants: null,
      corkboard: null,
      anatomy: null,
    });
  });
});

describe("the room layout", () => {
  const floorStations = STATIONS.filter((s) => !WALL_PIECES.has(s.id));
  const gap = (a, b) => Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w), b.y - (a.y + a.h), a.y - (b.y + b.h));

  it("leaves an aisle of at least 6 units (30 cm) between pieces of furniture", () => {
    for (const a of floorStations)
      for (const b of floorStations) if (a !== b) expect(gap(a.footprint, b.footprint), `${a.id} / ${b.id}`).toBeGreaterThanOrEqual(6);
  });

  it("puts every stand point on open floor", () => {
    for (const s of STATIONS) for (const o of floorStations) expect(collides(standPoint(s), o.footprint), `${s.id} in ${o.id}`).toBe(false);
  });

  it("lets the idle walk visit every station in turn without getting stuck", () => {
    const ctx = { stations: STATIONS, footprints: STATIONS.map((s) => s.footprint) };
    let st = initialFigure(FIGURE_START);
    const seen = new Set();
    for (let t = 0; t < 240 && seen.size < STATIONS.length; t += 1 / 30) {
      st = stepFigure(st, { dir: null, tapTarget: null }, ctx, 1 / 30);
      if (st.pauseLeft > 0) seen.add(STATIONS[st.idleIndex].id);
    }
    expect([...seen].sort()).toEqual(STATIONS.map((s) => s.id).sort());
  });
});
