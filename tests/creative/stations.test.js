import { describe, it, expect } from "vitest";
import { STATIONS } from "../../src/creative/stations/index.js";
import { initialFigure, standPoint, stepFigure } from "../../src/lib/figure.js";
import { collides } from "../../src/lib/floor.js";
import { FIGURE_START } from "../../src/lib/travelers.js";

const FLOOR = { w: 150, h: 100 };
const WALL_PIECES = new Set(["anatomy", "corkboard"]);

describe("STATIONS", () => {
  it("has the nine stations in idle-route order", () => {
    expect(STATIONS.map((s) => s.id)).toEqual(["desk", "library", "plants", "kitchen", "gym", "chess", "reading", "corkboard", "anatomy"]);
  });

  it("footprints lie inside the floor", () => {
    for (const s of STATIONS) {
      expect(s.footprint.x).toBeGreaterThanOrEqual(0);
      expect(s.footprint.y).toBeGreaterThanOrEqual(0);
      expect(s.footprint.x + s.footprint.w).toBeLessThanOrEqual(FLOOR.w);
      expect(s.footprint.y + s.footprint.h).toBeLessThanOrEqual(FLOOR.h);
    }
  });

  it("every station has a component, and every stop on the tour a label", () => {
    for (const s of STATIONS) {
      expect(typeof s.Component).toBe("function");
      if (s.tour !== false) expect(s.label.length).toBeGreaterThan(0);
    }
  });

  it("links follow the spec", () => {
    const links = Object.fromEntries(STATIONS.map((s) => [s.id, s.link]));
    expect(links).toEqual({
      desk: "#experience",
      library: "/shelf",
      gym: "https://www.strava.com/athletes/121070736",
      kitchen: null,
      reading: "/shelf",
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

describe("room with his body", () => {
  it("can reach every station's stand point, from the start and from each other, with his body's width", async () => {
    const { STATIONS } = await import("../../src/creative/stations/index.js");
    const { blocksFor, bodyFootprints, standPoint } = await import("../../src/lib/figure.js");
    const { findPath } = await import("../../src/lib/path.js");
    const { FLOOR } = await import("../../src/lib/floor.js");
    const { FIGURE_START } = await import("../../src/lib/travelers.js");
    const ctx = { stations: STATIONS, footprints: bodyFootprints(STATIONS) };
    const points = [FIGURE_START, ...STATIONS.map(standPoint)];
    for (const st of STATIONS) {
      for (const from of points) {
        const to = standPoint(st);
        expect(findPath(from, to, blocksFor(ctx, from, to), FLOOR), `${st.id} from ${JSON.stringify(from)}`).not.toBeNull();
      }
    }
  });
});

describe("the anatomy chart", () => {
  it("hangs on the wall without a label, and is not a stop on his tour", async () => {
    const { STATIONS, TOUR } = await import("../../src/creative/stations/index.js");
    const chart = STATIONS.find((s) => s.id === "anatomy");
    expect(chart.label).toBeNull();
    expect(TOUR.map((s) => s.id)).not.toContain("anatomy");
    expect(TOUR.length).toBe(STATIONS.length - 1);
  });
});

describe("the reading corner", () => {
  it("draws him between the chair's two layers when he sits, and over both when he walks in front", async () => {
    const { STATIONS, paintBoxes } = await import("../../src/creative/stations/index.js");
    const { paintOrder } = await import("../../src/lib/floor.js");
    const { standPoint } = await import("../../src/lib/figure.js");
    const reading = STATIONS.find((s) => s.id === "reading");
    const seated = paintOrder(paintBoxes(STATIONS), standPoint(reading));
    expect(seated.indexOf("reading")).toBeLessThan(seated.indexOf("figure"));
    expect(seated.indexOf("figure")).toBeLessThan(seated.indexOf("reading-front"));
    const inFront = paintOrder(paintBoxes(STATIONS), { x: 2, y: 66 });
    expect(inFront.indexOf("reading-front")).toBeLessThan(inFront.indexOf("figure"));
  });

  it("keeps him out of the arms, lamp and table, and the seat open only for sitting", async () => {
    const { STATIONS } = await import("../../src/creative/stations/index.js");
    const { blocksFor, bodyFootprints, standPoint } = await import("../../src/lib/figure.js");
    const { collides } = await import("../../src/lib/floor.js");
    const reading = STATIONS.find((s) => s.id === "reading");
    const boxes = bodyFootprints(STATIONS);
    expect(boxes.length).toBeGreaterThan(STATIONS.length);
    const seat = standPoint(reading);
    expect(boxes.filter((f) => collides(seat, f)).map((f) => f.seat)).toEqual(["reading"]);
    expect(blocksFor({ stations: STATIONS, footprints: boxes }, { x: 40, y: 46 }, seat).some((f) => collides(seat, f))).toBe(false);
    for (const b of reading.blocks) expect(boxes.some((f) => collides({ x: b.x + b.w / 2, y: b.y + b.h / 2 }, f))).toBe(true);
  });

  it("has coffee, not tea", async () => {
    const { readFileSync } = await import("node:fs");
    const front = readFileSync("src/creative/stations/art/reading-front.svg", "utf8");
    expect(front).toContain("m-coffee");
    expect(front).not.toContain("m-tea");
    const { CARD_TEXT } = await import("../../src/creative/StationCard.jsx");
    expect(CARD_TEXT.reading.line).toContain("coffee");
  });
});

describe("he can't walk through the furniture", () => {
  // Each station's drawn floor contacts (from its contact shadows), in floor units from its pos.
  // The drawings' x runs along the floor's y, and their y along the floor's -x.
  // reading-front is the reading chair's front layer, drawn from the same anchor.
  const ART = { desk: ["desk"], library: ["library"], plants: ["plants"], kitchen: ["kitchen"], gym: ["gym"], chess: ["chess"], reading: ["reading", "reading-front"] };

  it("blocks every spot where something rests on the floor, except where he stands to use it", async () => {
    const { readFileSync } = await import("node:fs");
    const { bodyFootprints, standPoint } = await import("../../src/lib/figure.js");
    const meta = JSON.parse(readFileSync("src/creative/stations/art/meta.json", "utf8"));
    const blocks = bodyFootprints(STATIONS);
    const inside = (p, f) => p.x > f.x && p.x < f.x + f.w && p.y > f.y && p.y < f.y + f.h;
    const open = [];
    for (const s of STATIONS) {
      for (const art of ART[s.id] ?? []) {
        for (const [x, y, w, d] of meta[art].floor) {
          for (let u = x + 0.5; u <= x + w - 0.5; u += 0.5) {
            for (let v = y + 0.5; v <= y + d - 0.5; v += 0.5) {
              const p = { x: s.pos.x - v, y: s.pos.y + u };
              const stand = standPoint(s);
              if (Math.hypot(p.x - stand.x, p.y - stand.y) < 2.5) continue;
              if (!blocks.some((f) => inside(p, f))) open.push(`${s.id}/${art} at (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`);
            }
          }
        }
      }
    }
    // Report one point per station so a failure says where to look.
    expect([...new Map(open.map((o) => [o.split(" ")[0], o])).values()]).toEqual([]);
  });
});

describe("the plyo box", () => {
  it("keeps him well behind it, so its top edge never cuts across his legs", async () => {
    const { readFileSync } = await import("node:fs");
    const { bodyFootprints } = await import("../../src/lib/figure.js");
    const gym = STATIONS.find((s) => s.id === "gym");
    // The gym drawing's floor contacts are the two kettlebells, the box, then the shoes.
    const [x, y, w, d] = JSON.parse(readFileSync("src/creative/stations/art/meta.json", "utf8")).gym.floor[2];
    const box = { x0: gym.pos.x - (y + d), x1: gym.pos.x - y, y0: gym.pos.y + x, y1: gym.pos.y + x + w };
    expect(box.x1 - box.x0).toBeCloseTo(12, 1); // 60 cm deep
    const blocks = bodyFootprints(STATIONS);
    for (let px = box.x1; px <= box.x1 + 7; px += 0.5) {
      for (let py = box.y0; py <= box.y1; py += 0.5) {
        expect(blocks.some((f) => collides({ x: px, y: py }, f))).toBe(true);
      }
    }
  });
});
