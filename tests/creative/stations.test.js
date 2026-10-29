import { describe, it, expect } from "vitest";
import { STATIONS } from "../../src/creative/stations/index.js";

const FLOOR = { w: 100, h: 78 };

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
      library: "#reading",
      gym: "#running",
      kitchen: "#cooking",
      chess: "https://www.chess.com/member/breakfast_enjoyer",
      plants: null,
      corkboard: null,
      anatomy: null,
    });
  });
});
