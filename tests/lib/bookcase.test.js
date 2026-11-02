import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { CASE, CAMERA, PLACED, TIP, PULL, bookPose, projector, spineType, plateType, textWidth, SPINE_FONT } from "../../src/lib/bookcase.js";
import { SHELF } from "../../src/content/shelf.js";
import { iso } from "../../tools/iso-kit/iso-kit.mjs";

const project = projector([50, 80]);
const apply = (matrix, [x, y]) => {
  const [a, b, c, d, e, f] = matrix.match(/-?[\d.]+/g).map(Number);
  return [a * x + c * y + e, b * x + d * y + f];
};

describe("bookcase layout", () => {
  it("places all the books once, inside the case, with no two overlapping", () => {
    expect(PLACED.map((p) => p.book.id).sort()).toEqual(SHELF.flatMap((s) => s.books.map((b) => b.id)).sort());
    for (const p of PLACED) {
      expect(p.y0).toBeGreaterThan(CASE.y0 + CASE.side);
      expect(p.y1).toBeLessThan(CASE.y1 - CASE.side);
    }
    for (const z of CASE.shelves) {
      const row = PLACED.filter((p) => p.z0 === z);
      row.slice(1).forEach((p, i) => expect(p.y0).toBeGreaterThanOrEqual(row[i].y1));
    }
  });

  it("leaves room over each book to tip without reaching the board above", () => {
    for (const p of PLACED) {
      const rise = (p.z1 - p.z0) * Math.cos(TIP) + (p.x1 - p.x0) * Math.sin(TIP);
      expect(rise, p.book.id).toBeLessThan(CASE.shelves[1] - CASE.shelves[0] - CASE.board);
    }
  });

  it("reads left to right along the row: each shelf's first book is nearest the viewer's left", () => {
    const top = PLACED.filter((p) => p.z0 === CASE.shelves[2]);
    expect(top[top.length - 1].book.id).toBe(SHELF[0].books[0].id);
  });
});

describe("spine type", () => {
  const { cap, ascent, descent } = SPINE_FONT;

  it("centres every title and surname across its spine and keeps the letters on it", () => {
    for (const p of PLACED) {
      const mid = (p.y0 + p.y1) / 2;
      for (const line of Object.values(spineType(p))) {
        // The cap band runs from the baseline back by the cap height (text up is world -y).
        expect(line.baseline - (cap * line.size) / 2, `${p.book.id} ${line.text}`).toBeCloseTo(mid, 1);
        expect(line.baseline - ascent * line.size).toBeGreaterThanOrEqual(p.y0 + 0.1);
        expect(line.baseline + descent * line.size).toBeLessThanOrEqual(p.y1 - 0.1);
      }
    }
  });

  it("runs each title down the spine clear of the surname at its foot", () => {
    for (const p of PLACED) {
      const { title, author } = spineType(p);
      expect(title.start).toBeLessThanOrEqual(p.z1 - 1);
      expect(title.start - title.length, p.book.id).toBeGreaterThanOrEqual(author.start + 1);
      expect(author.start - author.length, p.book.id).toBeGreaterThanOrEqual(p.z0 + 0.5);
    }
  });

  it("states every line's length so any font renders to the same extent", () => {
    for (const p of PLACED) {
      for (const line of Object.values(spineType(p))) expect(line.length).toBeCloseTo(Math.min(textWidth(line.text, line.size), line.length), 6);
    }
    const svg = readFileSync("src/creative/stations/art/bookcase.svg", "utf8");
    expect(svg.match(/class="bk-(title|author)"[^>]*textLength="/g)).toHaveLength(PLACED.length * 2);
  });

  it("measures width from Geist's own advances", () => {
    expect(textWidth("Ill", 10)).toBeLessThan(textWidth("MWm", 10));
    expect(textWidth("Outliers", 1)).toBeCloseTo(0.751 + 0.586 + 0.41 + 0.282 + 0.256 + 0.576 + 0.394 + 0.537, 3);
  });
});

describe("shelf labels", () => {
  it("are set large enough to read and sized to their words", () => {
    for (const text of ["Reading, textbooks", "Up next", "Read"]) {
      const plate = plateType(text);
      expect(plate.size).toBeGreaterThanOrEqual(3.2);
      expect(plate.w).toBeCloseTo(textWidth(text, plate.size) + 2 * plate.pad, 6);
      expect(plate.w).toBeLessThan(CASE.y1 - CASE.y0 - 2 * CASE.side);
    }
    const svg = readFileSync("src/creative/stations/art/bookcase.svg", "utf8");
    for (const size of svg.match(/class="bk-plate-text"[^>]*font-size="([\d.]+)"/g)) expect(Number(size.match(/font-size="([\d.]+)"/)[1])).toBeGreaterThanOrEqual(3.2);
  });
});

describe("projector", () => {
  it("matches the kit that draws the art", () => {
    const P = { origin: [50, 80], ...CAMERA };
    for (const p of [[0, 0, 0], [28, -40, 60], [3, 12, 100]]) {
      const [x, y] = iso(p, P);
      expect(project(p)[0]).toBeCloseTo(x, 6);
      expect(project(p)[1]).toBeCloseTo(y, 6);
    }
  });
});

describe("bookPose", () => {
  const p = PLACED[4];

  it("is still at rest, with nothing painted over the neighbours except what stands proud", () => {
    const { spine, side, top } = bookPose(p, 0, project);
    for (const m of [spine, side, top]) expect(m).toBe("matrix(1.0000 0.0000 0.0000 1.0000 0.0000 0.0000)");
  });

  it("moves each face as the real book would turn", () => {
    const pose = bookPose(p, 1, project);
    const height = p.z1 - p.z0;
    // The top of the spine ends up forward by the pull and the lean, and a little lower.
    const want = project([p.x1 + PULL + height * Math.sin(TIP), p.y1, p.z0 + height * Math.cos(TIP)]);
    const got = apply(pose.spine, project([p.x1, p.y1, p.z1]));
    expect(got[0]).toBeCloseTo(want[0], 2);
    expect(got[1]).toBeCloseTo(want[1], 2);
    // The cover's back corner agrees with the same turn.
    const depth = p.x1 - p.x0;
    const back = project([p.x1 + PULL - depth * Math.cos(TIP), p.y1, p.z0 + depth * Math.sin(TIP)]);
    const gotBack = apply(pose.side, project([p.x0, p.y1, p.z0]));
    expect(gotBack[0]).toBeCloseTo(back[0], 2);
    expect(gotBack[1]).toBeCloseTo(back[1], 2);
  });

  it("clips the book to what has cleared the row, so nothing behind a neighbour shows through", () => {
    expect(bookPose(p, 1, project).clip).toMatch(/Z.*Z/);
  });
});
