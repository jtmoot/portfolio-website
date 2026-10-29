// The chess table, front left: a square wooden table with an inlaid board and a game in progress,
// a chess clock, a pile of captured pieces, a chair on the far side and a stool on the near side.
// Local world: table centred on the origin, z up, centimetres.
import { station, k, G } from "./lib.mjs";

const TZ = 74; // table top surface
const SQ = 5; // square size
const BZ = TZ + 1.6; // board surface
const PS = 1.3; // piece scale (pieces drawn a little large so they read at room scale)

const PROFILES = {
  pawn: [[0, 1.5], [0.45, 1.5], [0.6, 1.15], [0.9, 1.15], [1.1, 0.75, 1], [2.4, 0.5, 1], [2.7, 0.85], [2.95, 0.85], [3.05, 0.5], [3.3, 0.78, 1], [3.75, 0.88, 1], [4.2, 0.62, 1], [4.45, 0]],
  rook: [[0, 1.6], [0.5, 1.6], [0.65, 1.25], [1, 1.2], [1.2, 0.95, 1], [3.6, 0.85, 1], [3.8, 1.15], [4.1, 1.15], [4.1, 1.25], [5, 1.25], [5, 0]],
  bishop: [[0, 1.6], [0.5, 1.6], [0.65, 1.2], [1, 1.15], [1.2, 0.8, 1], [3.6, 0.5, 1], [3.85, 0.95], [4.1, 0.95], [4.2, 0.55], [4.6, 0.85, 1], [5.4, 0.8, 1], [6.1, 0.4, 1], [6.4, 0.18], [6.6, 0.25, 1], [6.85, 0]],
  queen: [[0, 1.75], [0.55, 1.75], [0.7, 1.3], [1.1, 1.25], [1.3, 0.85, 1], [4.6, 0.55, 1], [4.9, 1.0], [5.15, 1.0], [5.3, 0.6], [6.4, 1.05, 1], [6.8, 1.0], [6.85, 0.55], [7.2, 0.35, 1], [7.45, 0]],
  king: [[0, 1.8], [0.55, 1.8], [0.7, 1.35], [1.1, 1.3], [1.3, 0.9, 1], [5.0, 0.6, 1], [5.3, 1.05], [5.55, 1.05], [5.7, 0.62], [6.9, 1.0, 1], [7.3, 0.95], [7.4, 0.4], [7.7, 0.4], [7.7, 0]],
  knightBase: [[0, 1.6], [0.5, 1.6], [0.65, 1.2], [1.1, 1.15], [1.3, 0]],
};

export default station("chess", {
  label: "Joshua's chess table: a game in progress on an inlaid board, a chess clock, a few captured pieces, a chair and a stool.",
  bounds: [[-36, -72, 0], [36, -72, 0], [-36, 64, 0], [36, 64, 0], [0, -70, 92], [0, 0, TZ + 14]],
  draw(c) {
    const { box, cyl, S, L, D, at, halo, P } = c;
    const out = [];
    const Fz = (x, y, z) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);

    out.push(halo({ x: -40, y: -70, w: 80, d: 130, r: 20 }, 0, 4));

    // --- Far chair (y < 0), its back away from the table ------------------------------------------
    const chair = [];
    const CY0 = -68, CY1 = -28;
    for (const [lx, ly] of [[-17, CY0 + 2], [17, CY0 + 2], [-17, CY1 - 2], [17, CY1 - 2]]) chair.push(`<g class="m-wood">${box(lx - 1.6, ly - 1.6, 0, lx + 1.6, ly + 1.6, ly < -50 ? 88 : 44, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    chair.push(`<g class="m-wood">${box(-20, CY0, 44, 20, CY1, 47, { r: 1.2, steps: 3, bevel: 0.4, tone: "hi", crease: "lo" })}</g>`);
    for (const z of [62, 72, 82]) chair.push(`<g class="m-wood">${box(-17, CY0 + 0.6, z, 17, CY0 + 3.4, z + 4.5, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    out.push(chair.join(""));

    // --- Table --------------------------------------------------------------------------------------
    const legs = [[-27, -27], [27, -27], [-27, 27], [27, 27]];
    const legSvg = (lx, ly) => `<g class="m-wood">${S(k.extrude([[lx - 2.2, ly - 2.2], [lx + 2.2, ly - 2.2], [lx + 2.2, ly + 2.2], [lx - 2.2, ly + 2.2]], 0, TZ - 3, P), { tone: "hi", crease: "lo" })}</g>`;
    out.push(legSvg(-27, -27) + legSvg(27, -27) + legSvg(-27, 27));
    out.push(`<g class="m-wood">${box(-29, -29, TZ - 10, 29, 29, TZ - 3, { r: 0.5, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    out.push(legSvg(27, 27));
    void legs;
    out.push(`<g class="m-wood-dark">${box(-33, -33, TZ - 3, 33, 33, TZ, { r: 1.2, steps: 3, bevel: 0.5, tone: "hi", crease: "lo" })}</g>`);

    // --- Board --------------------------------------------------------------------------------------
    const half = SQ * 4;
    out.push(`<g class="m-wood">${box(-half - 2, -half - 2, TZ, half + 2, half + 2, BZ, { r: 0.6, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })}</g>`);
    let light = "", dark = "";
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
      const x0 = -half + r * SQ, y0 = -half + f * SQ;
      const d = k.pathOf([at([x0, y0, BZ]), at([x0 + SQ, y0, BZ]), at([x0 + SQ, y0 + SQ, BZ]), at([x0, y0 + SQ, BZ])], true);
      if ((r + f) % 2) light += d; else dark += d;
    }
    out.push(`<path class="m-sq-l" d="${light}"/><path class="m-sq-d" d="${dark}"/>`);
    out.push(L(k.planOutline({ x: -half, y: -half, w: half * 2, d: half * 2, r: 0 }, BZ, P, 1), { tone: "lo" }));

    // --- Pieces -------------------------------------------------------------------------------------
    const sq = (r, f) => [-half + (r + 0.5) * SQ, -half + (f + 0.5) * SQ];
    const scale = (prof) => prof.map(([s, rr, sm]) => (sm ? [s * PS, rr * PS, 1] : [s * PS, rr * PS]));
    const piece = (type, side, r, f) => {
      const [x, y] = sq(r, f);
      const cls = side === "w" ? "m-ivory" : "m-ebony";
      const F = Fz(x, y, BZ);
      const s = [];
      if (type === "knight") {
        s.push(S(G.solidOf(scale(PROFILES.knightBase), F, P, { smooth: false, steps: 20 }), { tone: "hi", crease: "lo" }));
        const dir = side === "w" ? 1 : -1;
        const head = [[-1.1, 1.2], [1.0, 1.2], [1.2, 3.0], [0.7 * dir > 0 ? 2.1 : 2.1, 4.1], [0.2, 5.6], [-0.9, 5.3], [-1.4, 3.6]].map(([u, v]) => [u * PS * dir, v * PS]);
        const hull = dir > 0 ? head : head.slice().reverse();
        s.push(S(G.prismOf(G.frameOf([x, y - 0.75 * PS, BZ], [0, 1, 0], [1, 0, 0], [0, 0, 1]), hull, 0, 1.5 * PS, P), { tone: "hi", crease: "lo" }));
        s.push(D([at([x + 0.6 * PS * dir, y + 0.76 * PS, BZ + 4.3 * PS])], { size: 0.35, tone: "hi" }));
      } else {
        s.push(S(G.solidOf(scale(PROFILES[type]), F, P, { smooth: false, steps: 20 }), { tone: "hi", crease: "lo" }));
        if (type === "king") {
          const z = BZ + 7.7 * PS;
          s.push(box(x - 0.25 * PS, y - 0.25 * PS, z, x + 0.25 * PS, y + 0.25 * PS, z + 1.6 * PS, { r: 0.05, steps: 1, tone: "hi", crease: "lo" }));
          s.push(box(x - 0.25 * PS, y - 0.75 * PS, z + 0.7 * PS, x + 0.25 * PS, y + 0.75 * PS, z + 1.15 * PS, { r: 0.05, steps: 1, tone: "hi", crease: "lo" }));
        }
        if (type === "rook") {
          const F2 = Fz(x, y, BZ + 5 * PS);
          s.push(L(G.circleOf(F2, 0, 0.8 * PS, P), { tone: "lo" }));
        }
      }
      return { p: [x, y, BZ], svg: `<g class="${cls}" data-sq="${r},${f}">${s.join("")}</g>` };
    };
    const position = [
      ["king", "w", 0, 6], ["rook", "w", 0, 5], ["queen", "w", 3, 3], ["knight", "w", 2, 5], ["bishop", "w", 3, 2],
      ["pawn", "w", 1, 0], ["pawn", "w", 1, 1], ["pawn", "w", 1, 5], ["pawn", "w", 1, 6], ["pawn", "w", 1, 7], ["pawn", "w", 3, 4],
      ["king", "b", 7, 6], ["rook", "b", 7, 2], ["queen", "b", 6, 3], ["knight", "b", 5, 2], ["bishop", "b", 6, 6],
      ["pawn", "b", 6, 0], ["pawn", "b", 6, 1], ["pawn", "b", 6, 5], ["pawn", "b", 6, 7], ["pawn", "b", 4, 3], ["rook", "b", 7, 7],
    ];
    const pieces = position.map(([t, s, r, f]) => piece(t, s, r, f));

    // --- Chess clock on the table's +y side, and the captured pile on the +x side ------------------
    const clock = [];
    const CX = 0, CYc = half + 7;
    clock.push(`<g class="m-wood-dark">${S(G.prismOf(G.frameOf([CX - 9, CYc - 3, TZ], [1, 0, 0], [0, 1, 0], [0, 0, 1]), [[0, 0], [6, 0], [6, 2.5], [4.5, 7], [0.6, 7.6], [0, 7]], 0, 18, P), { tone: "hi", crease: "lo" })}</g>`);
    for (const dx of [-4.5, 4.5]) {
      const F = G.frameOf([CX + dx, CYc + 3.2, TZ + 4.4], [0.1, 0.94, 0.33], [1, 0, 0], [0, -0.33, 0.94]);
      clock.push(`<g class="m-ivory">${S(G.disc(0, 0.3, 2.6, F, P), { tone: "hi", crease: "lo" })}</g>`);
      clock.push(L(G.circleOf(F, 0.31, 2.1, P), { tone: "faint" }));
      clock.push(L(k.pathOf([at(G.pointOf(F, 0.32, 0, 0)), at(G.pointOf(F, 0.32, 1.7, dx < 0 ? 1.2 : 2.4))]), { tone: "hi", free: "end" }));
      clock.push(cyl(CX + dx, CYc, 1.1, TZ + 7.4, TZ + 8.6, { steps: 14, tone: "hi", crease: "lo", className: "m-steel" }));
    }
    const captured = [];
    for (const [t, s, dx, dy] of [["pawn", "b", 0, 0], ["pawn", "b", 1.4, 3.2], ["knight", "w", -0.5, 6.6], ["pawn", "w", 2.2, -3.4]]) {
      const pc = piece(t, s, 0, 0);
      const ox = half + 6 + dx - sq(0, 0)[0];
      const oy = -10 + dy - sq(0, 0)[1];
      captured.push({ p: [half + 6 + dx, -10 + dy, TZ], svg: pc.svg.replace(/^<g class="([^"]+)">/, `<g class="$1" transform="${k.translateAlong(P, [ox, oy, TZ - BZ])}">`) });
    }
    // Captured pieces are scenery, not part of the replay.
    for (const cp of captured) cp.svg = cp.svg.replace(/ data-sq="[^"]*"/, "");
    const onTable = [...pieces, ...captured, { p: [CX, CYc, TZ], svg: clock.join("") }];
    // Screen offsets of one rank, one file and one centimetre up, for the replay in Chess.jsx.
    const o = at([0, 0, BZ]);
    const dr = at([SQ, 0, BZ]);
    const df = at([0, SQ, BZ]);
    const dz = at([0, 0, BZ + 1]);
    const f2 = (n) => n.toFixed(3);
    out.push(`<g data-chess-step="${[dr[0] - o[0], dr[1] - o[1], df[0] - o[0], df[1] - o[1], dz[1] - o[1]].map(f2).join(",")}"/>`);
    out.push(...c.byDepth(onTable, (i) => i.p).map((i) => i.svg));

    // --- Near stool (y > 0) -------------------------------------------------------------------------
    const stool = [];
    const SY = 50;
    for (const [lx, ly] of [[-12, SY - 12], [12, SY - 12], [-12, SY + 12], [12, SY + 12]]) {
      stool.push(`<g class="m-steel-dark">${c.tube([[lx * 0.8, SY + (ly - SY) * 0.8, 44], [lx, ly, 0]], 1.1, { tone: "hi" })}</g>`);
    }
    stool.push(`<g class="m-steel-dark">${c.tube([[-11, SY - 11, 16], [11, SY - 11, 16], [11, SY + 11, 16], [-11, SY + 11, 16], [-11, SY - 11, 16]], 0.7, { tone: "hi", caps: false })}</g>`);
    stool.push(cyl(0, SY, 17, 44, 47.5, { steps: 56, bevel: 0.5, tone: "hi", crease: "lo", className: "m-wood" }));
    out.push(stool.join(""));
    return out.join("");
  },
});
