import { describe, it, expect } from "vitest";
import { CASE, CAMERA, PLACED, TIP, PULL, bookPose, projector } from "../../src/lib/bookcase.js";
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
