import { SHELF } from "../content/shelf.js";

/** The bookcase on /shelf, in centimetres: wall plane x = 0, spines facing +x, the row running along y. */
export const CASE = { y0: -46, y1: 46, depth: 30, height: 109, side: 2, board: 3, spine: 28, shelves: [10, 43, 76] };
// `scale` is the kit's: it multiplies its own unit, see UNIT in tools/iso-kit.
export const CAMERA = { azimuth: 35, elevation: 35.264, scale: 1 / Math.sqrt(1.6) };
const UNIT = Math.sqrt(1.6);

export const TIP = (15 * Math.PI) / 180;
export const PULL = 5;

const ROWS = [["now", "text"], ["next"], ["read"]];

const hash = (text) => [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Every book's place on the case, far end of the row first: the order they are painted in. */
export const PLACED = ROWS.flatMap((ids, r) => {
  const books = ids.flatMap((id) => SHELF.find((s) => s.id === id).books);
  const z0 = CASE.shelves[CASE.shelves.length - 1 - r];
  let y = CASE.y1 - CASE.side - 0.4;
  const row = books.map((book, i) => {
    const h = hash(book.id);
    const thick = 3 + (h % 19) / 10;
    const placed = {
      book,
      x0: CASE.spine - 14 - (h % 4),
      x1: CASE.spine,
      y0: y - thick,
      y1: y,
      z0,
      z1: z0 + 20 + ((h >> 4) % 51) / 10,
      // The first book's nearest neighbour is the side panel, whose front edge is the case's.
      clipX: i === 0 ? CASE.depth : CASE.spine,
    };
    y -= thick + 0.04;
    return placed;
  });
  return row.reverse();
});

/** The projection used for the drawing, given the origin its build wrote to meta.json. */
export function projector(origin) {
  const a = (CAMERA.azimuth * Math.PI) / 180;
  const e = (CAMERA.elevation * Math.PI) / 180;
  const [sa, ca, se, ce, k] = [Math.sin(a), Math.cos(a), Math.sin(e), Math.cos(e), CAMERA.scale * UNIT];
  return ([x, y, z]) => [origin[0] + (x * sa - y * ca) * k, origin[1] + ((x * ca + y * sa) * se - z * ce) * k];
}

/** A point on the book with its bottom front edge pulled forward and its top tipped out, at t in [0, 1]. */
function posed({ x1, z0 }, t, [x, y, z]) {
  const angle = t * TIP;
  const [dx, dz] = [x - x1, z - z0];
  return [x1 + t * PULL + dx * Math.cos(angle) + dz * Math.sin(angle), y, z0 - dx * Math.sin(angle) + dz * Math.cos(angle)];
}

/** The 2D affine map taking three points to three points, as an SVG matrix(). */
function affine([a, b, c], [A, B, C]) {
  const [ux, uy, vx, vy] = [b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1]];
  const [Ux, Uy, Vx, Vy] = [B[0] - A[0], B[1] - A[1], C[0] - A[0], C[1] - A[1]];
  const det = ux * vy - uy * vx;
  const m = [(Ux * vy - Vx * uy) / det, (Uy * vy - Vy * uy) / det, (Vx * ux - Ux * vx) / det, (Vy * ux - Uy * vx) / det];
  const e = A[0] - m[0] * a[0] - m[2] * a[1];
  const f = A[1] - m[1] * a[0] - m[3] * a[1];
  return [...m, e, f];
}

const svgMatrix = (m) => `matrix(${m.map((n) => n.toFixed(4)).join(" ")})`;

/** A face's corners, cut where it passes behind the plane x = X. */
function inFront(points, X) {
  const out = [];
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length];
    if (p[0] >= X) out.push(p);
    if (p[0] >= X !== q[0] >= X) {
      const f = (X - p[0]) / (q[0] - p[0]);
      out.push(p.map((v, n) => v + (q[n] - v) * f));
    }
  });
  return out;
}

/**
 * The flat faces of a book in a pose. A rigid turn seen in projection is one exact affine map per
 * plane, so each face's drawing moves with its own matrix. `clip` outlines the part of the book
 * clear of its neighbours, which is the part that paints over them.
 * @param {object} placed one entry of PLACED
 * @param {number} t 0 at rest, 1 fully tipped out
 * @param {(p: number[]) => number[]} project from projector()
 * @returns {{ spine: string, side: string, top: string, clip: string }}
 */
export function bookPose(placed, t, project) {
  const { x0, x1, y0, y1, z0, z1, clipX } = placed;
  const spine = [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]];
  const side = [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];
  const top = [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  const move = (face) => svgMatrix(affine(face.slice(0, 3).map(project), face.slice(0, 3).map((p) => project(posed(placed, t, p)))));
  const outline = (face) => {
    const cut = inFront(face.map((p) => posed(placed, t, p)), clipX);
    return cut.length < 3 ? "" : `M${cut.map((p) => project(p).map((n) => n.toFixed(2)).join(" ")).join("L")}Z`;
  };
  return { spine: move(spine), side: move(side), top: move(top), clip: [spine, side, top].map(outline).join("") };
}
