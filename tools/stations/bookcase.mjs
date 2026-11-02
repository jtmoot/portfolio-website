// The bookcase on /shelf: walnut, three shelves, every book on Joshua's list as a separately posable group.
// A book is three flat faces (spine, cover, top) so the page can turn each with one exact matrix.
// Local world: wall plane x = 0, spines facing +x, row along y. Centimetres.
import { readFileSync } from "node:fs";
import { station, k } from "./lib.mjs";
import { CASE, CAMERA, PLACED, SPINE_FONT, spineType, plateType } from "../../src/lib/bookcase.js";

const { y0: Y0, y1: Y1, depth: D, height: H, side: T, board: B, spine: X, shelves: SHELVES } = CASE;
const SPINES = JSON.parse(readFileSync(new URL("./spines.json", import.meta.url), "utf8"));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export default station("bookcase", {
  label: "A walnut bookcase of three shelves holding Joshua's books. Pick a spine to tip the book out.",
  role: "group",
  cam: { azimuth: CAMERA.azimuth, elevation: CAMERA.elevation },
  bounds: [[0, Y0 - 1, 0], [0, Y1 + 1, 0], [D + 14, Y0 - 1, 0], [D + 14, Y1 + 1, 0], [0, Y0 - 1, H + 5], [0, Y1 + 1, H + 5], [D, Y0 - 1, H + 5]],
  draw(c) {
    const { box, cyl, L, D: dots, at, path3, halo, tube } = c;
    const out = [];
    const wood = (svg) => `<g class="m-walnut">${svg}</g>`;
    const brass = (svg) => `<g class="m-brass">${svg}</g>`;
    const line = (a, b, tone = "lo", free) => L(k.pathOf([at(a), at(b)]), free ? { tone, free } : { tone });
    const solid = { tone: "hi", crease: "lo" };

    out.push(halo({ x: 0.5, y: Y0, w: D, d: Y1 - Y0, r: 1 }, 0, 4));
    // Back panel: tongue-and-groove boards.
    const back = [box(0.5, Y0, 0, 2, Y1, H, { r: 0.1, steps: 1, ...solid })];
    for (let y = Y0 + T + 11.5; y < Y1 - T; y += 11.5) back.push(line([2, y, 7], [2, y, H], "lo"));
    out.push(wood(back.join("")));
    // Far side panel, its inner face drilled for shelf pins.
    const far = [box(2, Y0, 0, D, Y0 + T, H, { r: 0.2, steps: 2, ...solid })];
    const pins = [];
    for (let z = 16; z < H - 6; z += 5) pins.push(at([7, Y0 + T, z]), at([D - 5, Y0 + T, z]));
    out.push(wood(far.join("")));
    out.push(wood(dots(pins, { tone: "lo", r: 0.32 })));
    // Plinth, set back as a toe-kick.
    out.push(wood(box(2, Y0 + T, 0, D - 2.4, Y1 - T, SHELVES[0] - B, { r: 0.2, steps: 2, ...solid })));

    const boardAt = (z, label) => {
      const parts = [wood(box(2, Y0 + T, z - B, D, Y1 - T, z, { r: 0.25, steps: 2, bevel: 0.3, ...solid }))];
      // A beaded edge, and a clip-on brass label holder hanging below the board's front, as library
      // shelves carry them: a frame screwed to the edge, the card inside it.
      parts.push(wood(line([D, Y0 + T + 0.4, z - 0.7], [D, Y1 - T - 0.4, z - 0.7], "lo")));
      const plate = plateType(label);
      const face = (x, y0, y1, z0, z1) => path3([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], true);
      const [fx, cx] = [D + 0.15, D + 0.3];
      const [fy, fz0, fz1] = [plate.w / 2 + 0.9, z - B - 2.4, z - 0.3];
      const [cy, cz0, cz1] = [plate.w / 2, fz0 + 0.35, fz1 - 0.35];
      parts.push(`<path class="bk-holder" d="${face(fx, -fy, fy, fz0, fz1)}"/>`);
      parts.push(`<path class="bk-plate" d="${face(cx, -cy, cy, cz0, cz1)}"/>`);
      parts.push(brass(dots([at([fx, -fy + 0.45, z - 1.4]), at([fx, fy - 0.45, z - 1.4])], { tone: "lo", r: 0.24 })));
      // Text runs toward -y; centred on the card, its cap height centred between the card's edges.
      const base = (cz0 + cz1) / 2 - (SPINE_FONT.cap * plate.size) / 2;
      const m = at([cx, 0, base]);
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
      parts.push(`<g class="m-steel-dark">${line([f, y - 13, z + 21], [f, y, z + 21], "lo")}${dots([at([f, y - 6.5, z + 7])], { tone: "lo", r: 0.9 })}</g>`);
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

    // One book: spine, the +y cover and the top, each in its own group so it can move alone.
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

      return (
        `<g data-book="${b.id}" role="button" tabindex="0" aria-label="${esc(`${b.title} by ${b.author}`)}" style="--b:${colour}">` +
        `<g data-face="top"><g id="bk-top-${b.id}">${topFace.join("")}</g></g>` +
        `<g data-face="side"><g id="bk-side-${b.id}">${cover.join("")}</g></g>` +
        `<g data-face="spine"><g id="bk-spine-${b.id}">${spine.join("")}</g></g>` +
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
      if (z === SHELVES[1]) out.push(king(16, end - 20, z));
      out.push(bookend(end, z));
      books.forEach((p) => out.push(book(p)));
    });

    // Near side panel, then the top: a board over a stepped cornice.
    out.push(wood(box(2, Y1 - T, 0, D, Y1, H, { r: 0.2, steps: 2, ...solid })));
    out.push(wood(box(0.5, Y0 - 0.5, H, D + 0.6, Y1 + 0.5, H + 1.6, { r: 0.3, steps: 2, bevel: 0.3, ...solid })));
    out.push(wood(box(0.5, Y0 - 1, H + 1.6, D + 1.2, Y1 + 1, H + 3.2, { r: 0.4, steps: 2, bevel: 0.4, ...solid })));
    const top = H + 3.2;
    // On top: a leather writing tray with a glass inkwell and a capped fountain pen.
    const [ty0, ty1] = [-8, 26];
    out.push(`<g class="m-leather">${box(7, ty0, top, 25, ty1, top + 1, { r: 0.8, steps: 3, bevel: 0.2, ...solid })}</g>`);
    out.push(`<g class="m-leather">${L(path3([[8, ty0 + 1, top + 1], [24, ty0 + 1, top + 1], [24, ty1 - 1, top + 1], [8, ty1 - 1, top + 1]], true), { tone: "lo" })}</g>`);
    out.push(`<g class="m-steel-dark">${cyl(13, 2, 3.2, top + 1, top + 5.4, { steps: 28, bevel: 0.4, ...solid })}</g>`);
    out.push(brass(cyl(13, 2, 1.7, top + 5.4, top + 7, { steps: 24, bevel: 0.2, ...solid })));
    out.push(`<g class="m-steel-dark">${tube([[18, 7, top + 1.75], [20, 20, top + 1.75]], 0.72, { tone: "mid" })}</g>`);
    out.push(brass(tube([[20, 20, top + 1.75], [20.15, 21, top + 1.75]], 0.75, { tone: "mid" })));
    out.push(`<g class="m-steel-dark">${tube([[20.15, 21, top + 1.75], [20.8, 25, top + 1.75]], 0.62, { tone: "mid" })}</g>`);

    // Above all the art: rest-pose hit strips, so a book moving away from the pointer keeps its hover,
    // then the layer the page paints tipped books into.
    const hits = PLACED.map(({ x1, y0, y1, z0, z1, book: b }) => `<path class="bk-hit" data-hit="${b.id}" d="${path3([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], true)}"/>`);
    out.push(`<g class="bk-hits">${hits.join("")}</g><g class="bk-fronts"></g>`);
    return out.join("");
  },
});
