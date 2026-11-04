// The walnut bookcase, drawn once for two places: /shelf (the page, 35° camera, every book a
// separately posable group with a hit strip) and the room's library station (45° camera, static).
// Local world: wall plane x = 0, spines facing +x, the row along y. Centimetres.
import { readFileSync } from "node:fs";
import { k } from "./lib.mjs";
import { CASE, PLACED, SPINE_FONT, spineType, plateType } from "../../src/lib/bookcase.js";

const { y0: Y0, y1: Y1, depth: D, height: H, side: T, board: B, spine: X, shelves: SHELVES } = CASE;
const SPINES = JSON.parse(readFileSync(new URL("./spines.json", import.meta.url), "utf8"));

/** Height of the top board's upper face. */
export const TOP = H + 3.2;
/** How far the picture light reaches above the top. */
export const LIGHT = 15;

export const BOOKCASE_LABEL = "A walnut bookcase of three shelves holding Joshua's books, under a brass picture light.";

/** The drawing's extent, for a station's bounds: `reach` is how far tipped books come forward (the page only). */
export const bookcaseBounds = (reach = 0) => [
  [0, Y0 - 2, 0], [0, Y1 + 2, 0], [D + 1 + reach, Y0 - 2, 0], [D + 1 + reach, Y1 + 2, 0],
  [0, Y0 - 2, TOP + LIGHT + 3], [0, Y1 + 2, TOP + LIGHT + 3], [D + 1, Y0 - 2, TOP + LIGHT + 3],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/**
 * Draws the bookcase into a station context.
 * @param {object} c the drawing context from lib.mjs
 * @param {{ interactive?: boolean }} [options] interactive: books are focusable groups with hit strips
 *   and a layer for tipped copies (the page); otherwise plain art (the room)
 */
export function drawBookcase(c, { interactive = false } = {}) {
  const { box, cyl, L, D: dots, at, path3, halo, tube, frame, prism } = c;
  const out = [];
  const rand = rng(11);
  const wood = (svg) => `<g class="m-walnut">${svg}</g>`;
  const brass = (svg) => `<g class="m-brass">${svg}</g>`;
  const line = (a, b, tone = "lo", free) => L(k.pathOf([at(a), at(b)]), free ? { tone, free } : { tone });
  const solid = { tone: "hi", crease: "lo" };
  /** Grain: lines along a face that fade out at both ends, so no texture stops dead. */
  const grain = (lines, tone = "faint") => lines.map((pts) => k.fadeLineSvg(pts.map(at), { fade: [4, 4], tone })).join("");

  out.push(halo({ x: 0.5, y: Y0 - 1, w: D + 1, d: Y1 - Y0 + 2, r: 1 }, 0, 5));

  // Back panel: tongue-and-groove boards, each with a grain streak.
  const back = [box(0.5, Y0, 0, 2, Y1, H, { r: 0.1, steps: 1, ...solid })];
  for (let y = Y0 + T + 11.5; y < Y1 - T; y += 11.5) back.push(line([2, y, 7], [2, y, H], "mid"));
  out.push(wood(back.join("")));
  const backGrain = [];
  for (let y = Y0 + T + 2; y < Y1 - T - 8; y += 11.5) {
    const z0 = 14 + rand() * 40;
    const yy = y + 2 + rand() * 6;
    backGrain.push([[2, yy, z0], [2, yy + 0.6, z0 + 22 + rand() * 30]]);
  }
  out.push(wood(grain(backGrain)));

  // Far side panel, its inner face drilled for shelf pins.
  out.push(wood(box(2, Y0, 0, D, Y0 + T, H, { r: 0.2, steps: 2, bevel: 0.35, ...solid })));
  const pins = [];
  for (let z = 16; z < H - 6; z += 5) pins.push(at([7, Y0 + T, z]), at([D - 5, Y0 + T, z]));
  out.push(`<g class="m-steel-dark">${dots(pins, { tone: "lo", size: 0.32 })}</g>`);

  // Plinth, set back as a toe-kick.
  out.push(wood(box(2, Y0 + T, 0, D - 2.4, Y1 - T, SHELVES[0] - B, { r: 0.2, steps: 2, ...solid })));

  const boardAt = (z, label) => {
    const parts = [wood(box(2, Y0 + T, z - B, D, Y1 - T, z, { r: 0.25, steps: 2, bevel: 0.45, ...solid }))];
    // A beaded front edge, and grain along the board and down its front.
    parts.push(wood(line([D, Y0 + T + 0.4, z - 0.7], [D, Y1 - T - 0.4, z - 0.7], "lo")));
    const g = [];
    for (let i = 0; i < 4; i++) {
      const x = 5 + i * 6.5 + rand() * 3;
      g.push([[x, Y0 + T + 3 + rand() * 6, z], [x + 1.2, Y1 - T - 3 - rand() * 10, z]]);
    }
    g.push([[D, Y0 + T + 4, z - B * 0.55], [D, Y1 - T - 4, z - B * 0.45]]);
    parts.push(wood(grain(g)));
    // The brass label holder hangs below the board at the bare end of the row (-y, the right on
    // screen), over empty shelf, so it covers no book: a frame screwed to the edge, the card in it.
    const plate = plateType(label);
    const yc = Y0 + T + plate.w / 2 + 2.6;
    const face = (x, y0, y1, z0, z1) => path3([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], true);
    const [fy, fz0, fz1] = [plate.w / 2 + 0.9, z - B - 2.4, z - 0.3];
    const [cy, cz0, cz1] = [plate.w / 2, fz0 + 0.35, fz1 - 0.35];
    parts.push(brass(box(D, yc - fy, fz0, D + 0.5, yc + fy, fz1, { r: 0.25, steps: 1, lit: true, ...solid })));
    const cx = D + 0.55;
    parts.push(`<path class="bk-plate" d="${face(cx, yc - cy, yc + cy, cz0, cz1)}"/>`);
    parts.push(`<g class="m-steel-dark">${dots([at([cx, yc - fy + 0.45, z - 1.4]), at([cx, yc + fy - 0.45, z - 1.4])], { tone: "lo", size: 0.24 })}</g>`);
    // Text runs toward -y, centred on the card, its cap height centred between the card's edges.
    const base = (cz0 + cz1) / 2 - (SPINE_FONT.cap * plate.size) / 2;
    const m = at([cx, yc, base]);
    const [o, u, v] = [at([cx, 0, 0]), at([cx, -1, 0]), at([cx, 0, -1])];
    const matrix = [u[0] - o[0], u[1] - o[1], v[0] - o[0], v[1] - o[1], m[0], m[1]].map((n) => n.toFixed(3)).join(" ");
    parts.push(
      `<text class="bk-plate-text" transform="matrix(${matrix})" font-size="${plate.size}" text-anchor="middle" ` +
        `textLength="${(plate.w - 2 * plate.pad).toFixed(3)}" lengthAdjust="spacingAndGlyphs">${esc(label)}</text>`,
    );
    return parts.join("");
  };

  // A cast-iron bookend: a block heavy enough to hold the row, with a brass strip across its face.
  const bookend = (y, z) =>
    `<g class="m-steel-dark">${box(X - 13, y - 5, z, X - 0.5, y, z + 13, { r: 0.35, steps: 2, bevel: 0.3, ...solid })}</g>` +
    `<path class="bk-plate" d="${path3([[X - 0.5, y - 4.6, z + 10], [X - 0.5, y - 0.4, z + 10], [X - 0.5, y - 0.4, z + 11], [X - 0.5, y - 4.6, z + 11]], true)}"/>`;

  // A closed archive box with a brass card frame and a finger pull.
  const archive = (y, z) => {
    const parts = [`<g class="m-steel-dark">${box(7, y - 13, z, X - 1, y, z + 24, { r: 0.3, steps: 2, ...solid })}</g>`];
    const f = X - 1;
    parts.push(`<g class="m-steel-dark">${line([f, y - 13, z + 21], [f, y, z + 21], "lo")}${dots([at([f, y - 6.5, z + 7])], { tone: "lo", size: 0.9 })}</g>`);
    parts.push(`<path class="bk-plate" d="${path3([[f, y - 10, z + 13], [f, y - 3, z + 13], [f, y - 3, z + 17], [f, y - 10, z + 17]], true)}"/>`);
    return parts.join("");
  };

  // A turned walnut king from a Staunton set.
  const king = (x, y, z) => {
    const parts = [
      cyl(x, y, 3.6, z, z + 1.3, { steps: 24, bevel: 0.3, ...solid }),
      cyl(x, y, 2.5, z + 1.3, z + 2.4, { steps: 24, bevel: 0.2, ...solid }),
      cyl(x, y, 1.45, z + 2.4, z + 8.8, { steps: 20, ...solid }),
      cyl(x, y, 2.3, z + 8.8, z + 9.5, { steps: 20, bevel: 0.2, ...solid }),
      cyl(x, y, 1.8, z + 9.5, z + 12.3, { steps: 20, ...solid }),
      cyl(x, y, 2.35, z + 12.3, z + 13, { steps: 20, bevel: 0.2, ...solid }),
      box(x - 0.3, y - 0.3, z + 13, x + 0.3, y + 0.3, z + 15.2, { r: 0.05, steps: 1, ...solid }),
      box(x - 0.3, y - 1, z + 13.9, x + 0.3, y + 1, z + 14.5, { r: 0.05, steps: 1, ...solid }),
    ];
    return `<g class="m-wood-dark">${parts.join("")}</g>`;
  };

  // Two books lying flat beside the king, page edges showing.
  const flatStack = (y, z) => {
    const parts = [`<g class="m-b5">${box(8, y - 15, z, 29, y, z + 2.6, { r: 0.3, steps: 2, ...solid })}</g>`];
    parts.push(L(k.pathOf([at([9, y, z + 1.3]), at([28, y, z + 1.3])]), { tone: "faint" }));
    parts.push(`<g class="m-b2">${box(9.2, y - 14.4, z + 2.6, 28.4, y - 0.8, z + 4.4, { r: 0.3, steps: 2, ...solid })}</g>`);
    parts.push(L(k.pathOf([at([10, y - 0.8, z + 3.5]), at([27.5, y - 0.8, z + 3.5])]), { tone: "faint" }));
    return parts.join("");
  };

  // One book: spine, the +y cover and the top, each in its own group so the page can move it alone.
  const book = (p) => {
    const { x0, x1, y0, y1, z0, z1, book: b } = p;
    const colour = SPINES[b.id] || "#6e5843";
    const ink = luminance(colour) > 0.5 ? "#201f1b" : "#f0ebdd";
    const thick = y1 - y0;
    const h = z1 - z0;
    const seed = b.id.length + b.title.length;
    const rule = (z) => `<path class="bk-rule" d="${path3([[x1, y0 + 0.25, z], [x1, y1 - 0.25, z]])}"/>`;

    const spine = [`<path class="bk-spine" d="${path3([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], true)}"/>`];
    // Spine dressing varies by book, as a real shelf does: double rules, or a pasted label.
    if (seed % 3 === 0) spine.push(rule(z1 - 1.1), rule(z1 - 1.6), rule(z0 + 1.6), rule(z0 + 1.1));
    else if (seed % 3 === 1) spine.push(rule(z1 - 1.4), rule(z0 + 3.2));
    else spine.push(`<path class="bk-label" d="${path3([[x1, y0 + 0.25, z0 + h * 0.2], [x1, y1 - 0.25, z0 + h * 0.2], [x1, y1 - 0.25, z1 - 1.2], [x1, y0 + 0.25, z1 - 1.2]], true)}"/>`);
    const onLabel = seed % 3 === 2;
    const textInk = onLabel ? "#201f1b" : ink;
    // Title down the spine, surname at the foot, each centred across it and stated at its exact
    // length so any font lands where the layout says.
    const [o, u, v] = [at([x1, 0, 0]), at([x1, 0, -1]), at([x1, 1, 0])];
    const text = (line, cls, fill) => {
      const m = at([x1, line.baseline, line.start]);
      const matrix = [u[0] - o[0], u[1] - o[1], v[0] - o[0], v[1] - o[1], m[0], m[1]].map((n) => n.toFixed(3)).join(" ");
      return (
        `<text class="${cls}" fill="${fill}" transform="matrix(${matrix})" font-size="${line.size.toFixed(3)}" ` +
        `textLength="${line.length.toFixed(3)}" lengthAdjust="spacingAndGlyphs">${esc(line.text)}</text>`
      );
    };
    const type = spineType(p);
    spine.push(text(type.title, "bk-title", textInk));
    spine.push(text(type.author, "bk-author", ink));
    // The head band: the sewn cap at the top of the spine.
    spine.push(`<path class="bk-band" d="${path3([[x1, y0 + 0.2, z1 - 0.55], [x1, y1 - 0.2, z1 - 0.55]])}"/>`);
    spine.push(`<path class="bk-edge" d="${path3([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], true)}"/>`);

    const cover = [
      `<path class="bk-cover" d="${path3([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], true)}"/>`,
      `<path class="bk-hinge" d="${path3([[x1 - 0.9, y1, z0 + 0.2], [x1 - 0.9, y1, z1 - 0.2]])}"/>`,
    ];
    const b1 = 0.26;
    const topFace = [
      `<path class="bk-spine" d="${path3([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], true)}"/>`,
      `<path class="bk-pages" d="${path3([[x0 + 0.3, y0 + b1, z1], [x1 - 0.7, y0 + b1, z1], [x1 - 0.7, y1 - b1, z1], [x0 + 0.3, y1 - b1, z1]], true)}"/>`,
    ];
    for (let i = 1; i < 4; i++) {
      const y = y0 + b1 + ((thick - 2 * b1) * i) / 4;
      topFace.push(`<path class="bk-leaf" d="${path3([[x0 + 0.5, y, z1], [x1 - 0.9, y, z1]])}"/>`);
    }
    topFace.push(`<path class="bk-edge" d="${path3([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], true)}"/>`);

    const open = interactive
      ? `<g data-book="${b.id}" role="button" tabindex="0" aria-label="${esc(`${b.title} by ${b.author}`)}" style="--b:${colour}">`
      : `<g class="bk-book" style="--b:${colour}">`;
    const ids = (face) => (interactive ? ` id="bk-${face}-${b.id}"` : "");
    return (
      open +
      `<g data-face="top"><g${ids("top")}>${topFace.join("")}</g></g>` +
      `<g data-face="side"><g${ids("side")}>${cover.join("")}</g></g>` +
      `<g data-face="spine"><g${ids("spine")}>${spine.join("")}</g></g>` +
      `</g>`
    );
  };

  const row = (z) => PLACED.filter((p) => p.z0 === z);
  const plates = { [SHELVES[2]]: "Reading, textbooks", [SHELVES[1]]: "Up next", [SHELVES[0]]: "Read" };
  SHELVES.forEach((z) => {
    out.push(boardAt(z, plates[z]));
    const books = row(z);
    const end = books[0].y0 - 0.1;
    if (z === SHELVES[2]) out.push(archive(end - 18, z));
    if (z === SHELVES[1]) {
      out.push(flatStack(end - 24, z));
      out.push(king(16, end - 20, z));
    }
    out.push(bookend(end, z));
    out.push(`<g class="bk-row">${books.map(book).join("")}</g>`);
  });

  // Near side panel with grain, then the top: a board over a stepped cornice, grained too.
  out.push(wood(box(2, Y1 - T, 0, D, Y1, H, { r: 0.2, steps: 2, bevel: 0.35, ...solid })));
  const sideGrain = [];
  for (let i = 0; i < 5; i++) {
    const x = 5 + i * 5.5 + rand() * 2.5;
    sideGrain.push([[x, Y1, 6 + rand() * 20], [x + 0.9, Y1, H - 8 - rand() * 30]]);
  }
  out.push(wood(grain(sideGrain)));
  out.push(wood(box(0.5, Y0 - 0.5, H, D + 0.6, Y1 + 0.5, H + 1.6, { r: 0.3, steps: 2, bevel: 0.3, ...solid })));
  out.push(wood(box(0.5, Y0 - 1, H + 1.6, D + 1.2, Y1 + 1, TOP, { r: 0.4, steps: 2, bevel: 0.45, ...solid })));
  const topGrain = [];
  for (let i = 0; i < 6; i++) {
    const x = 3 + i * 4.6 + rand() * 2;
    topGrain.push([[x, Y0 + 6 + rand() * 10, TOP], [x + 1.4, Y1 - 6 - rand() * 14, TOP]]);
  }
  out.push(wood(grain(topGrain)));

  // The picture light's pool of warm light on the top board, under everything that stands there.
  out.push(`<path class="bk-glow" d="${path3([[1, -30, TOP + 0.04], [D + 1, -30, TOP + 0.04], [D + 1, 30, TOP + 0.04], [1, 30, TOP + 0.04]], true)}"/>`);

  // On top: a leather writing tray with a glass inkwell and a capped fountain pen.
  const [ty0, ty1] = [-8, 26];
  out.push(`<g class="m-leather">${box(7, ty0, TOP, 25, ty1, TOP + 1, { r: 0.8, steps: 3, bevel: 0.2, ...solid })}</g>`);
  out.push(`<g class="m-leather">${L(path3([[8, ty0 + 1, TOP + 1], [24, ty0 + 1, TOP + 1], [24, ty1 - 1, TOP + 1], [8, ty1 - 1, TOP + 1]], true), { tone: "lo" })}</g>`);
  out.push(`<g class="m-steel-dark">${cyl(13, 2, 3.2, TOP + 1, TOP + 5.4, { steps: 28, bevel: 0.4, ...solid })}</g>`);
  out.push(brass(cyl(13, 2, 1.7, TOP + 5.4, TOP + 7, { steps: 24, bevel: 0.2, lit: true, ...solid })));
  out.push(`<g class="m-steel-dark">${tube([[18, 7, TOP + 1.75], [20, 20, TOP + 1.75]], 0.72, { tone: "mid" })}</g>`);
  out.push(brass(tube([[20, 20, TOP + 1.75], [20.15, 21, TOP + 1.75]], 0.75, { tone: "mid" })));
  out.push(`<g class="m-steel-dark">${tube([[20.15, 21, TOP + 1.75], [20.8, 25, TOP + 1.75]], 0.62, { tone: "mid" })}</g>`);

  // A brass picture light: two arms up from the back edge, a bar between them, a half-round shade, lit.
  const lz = TOP + LIGHT;
  const arm = (y) => brass(box(2.6, y - 0.6, TOP, 3.8, y + 0.6, lz - 1, { r: 0.3, steps: 1, ...solid }));
  out.push(arm(-15), arm(15));
  out.push(brass(tube([[3.2, -16, lz], [3.2, 16, lz]], 0.55, { tone: "mid" })));
  out.push(brass(box(3.2, -17, lz - 1.6, 9.5, 17, lz + 1.4, { r: 1.3, steps: 5, bevel: 0.3, lit: true, ...solid })));

  // A sticky note hanging off the top ledge, beside the light: its glued top edge on the cornice's
  // front, the rest hanging down over the top shelf, a little askew, the bottom corner curling out.
  // Three lines in his hand on it.
  const [nf, ny, ns, nr] = [D + 1.2 + 0.05, -24, 8, (5 * Math.PI) / 180];
  // The note's frame: U runs along the lines (toward -y, screen right), V down the note, both
  // turned by nr about the wall's normal; its top centre sits on the ledge.
  const U = [0, -Math.cos(nr), -Math.sin(nr)];
  const V = [0, Math.sin(nr), -Math.cos(nr)];
  const N3 = (u, v, x = 0) => [nf + x, ny + u * U[1] + v * V[1], TOP + u * U[2] + v * V[2]];
  out.push(`<g class="m-sticky">${prism(frame([nf, ny, TOP], [1, 0, 0], U, V), [[-ns, 0], [ns, 0], [ns, 2 * ns], [-ns, 2 * ns]], 0, 0.14, { tone: "hi", crease: "none" })}</g>`);
  out.push(`<path class="bk-note-glue" d="${path3([N3(-ns, 0, 0.16), N3(ns, 0, 0.16), N3(ns, 1.6, 0.16), N3(-ns, 1.6, 0.16)], true)}"/>`);
  out.push(`<path class="bk-note-curl" d="${path3([N3(ns, 2 * ns - 3.6, 0.16), N3(ns, 2 * ns, 1.8), N3(ns - 3.6, 2 * ns, 0.16)], true)}"/>`);
  const no = at(N3(-ns, 0, 0.2));
  const nu = at(N3(-ns + 1, 0, 0.2));
  const nv = at(N3(-ns, 1, 0.2));
  const nm = [nu[0] - no[0], nu[1] - no[1], nv[0] - no[0], nv[1] - no[1], no[0], no[1]].map((n) => n.toFixed(3)).join(" ");
  const noteLines = ["Never stop the", "intellectual", "struggle..."];
  out.push(`<g class="bk-note-text" transform="matrix(${nm})">${noteLines.map((t, i) => `<text x="1.1" y="${(5.2 + i * 3.1).toFixed(2)}" font-size="1.85">${esc(t)}</text>`).join("")}</g>`);

  if (interactive) {
    // Above all the art: rest-pose hit strips, so a book moving away from the pointer keeps its hover,
    // then the layer the page paints tipped books into.
    const hits = PLACED.map(({ x1, y0, y1, z0, z1, book: b }) => `<path class="bk-hit" data-hit="${b.id}" d="${path3([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], true)}"/>`);
    out.push(`<g class="bk-hits">${hits.join("")}</g><g class="bk-fronts"></g>`);
  }
  return out.join("");
}
