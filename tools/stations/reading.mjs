// The reading corner, front left of the room: an armless upholstered chair facing into the room,
// a round side table with a mug of tea (tag over the rim, steam rising) and two books, a brass
// floor lamp with a linen shade, and a rug under it all.
// Local world: the chair's seat centred on the origin, +x toward the room, z up. Centimetres.
// Animated parts: the tea's steam (class m-steam, CSS in src/styles/iso.css).
import { station, k, G } from "./lib.mjs";

const SEAT = 46; // seat cushion top

export default station("reading", {
  label: "Joshua's reading corner: an upholstered chair, a side table with a mug of tea and two books, and a brass floor lamp, on a rug.",
  bounds: [[-62, -90, 0], [86, -90, 0], [-62, 62, 0], [86, 62, 0], [-50, 35, 172], [-34, -64, 90], [-38, -35, 96]],
  draw(c) {
    const { box, cyl, S, L, at, path3, halo, P } = c;
    const out = [];
    const Fz = (x, y, z) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);

    // --- Rug ---------------------------------------------------------------------------------------
    out.push(halo({ x: -52, y: -62, w: 134, d: 118, r: 8 }, 0, 2));
    out.push(`<g class="m-rug">${box(-50, -60, 0, 82, 54, 0.6, { r: 6, steps: 3, tone: "hi", crease: "lo" })}</g>`);
    const inset = (m) => path3([[-50 + m, -60 + m, 0.62], [82 - m, -60 + m, 0.62], [82 - m, 54 - m, 0.62], [-50 + m, 54 - m, 0.62]], true);
    out.push(L(inset(6) + inset(9), { tone: "faint" }));
    for (let i = 0; i < 7; i++) {
      const x = -36 + i * 17;
      out.push(L(path3([[x, -46, 0.62], [x + 6, -40, 0.62], [x, -34, 0.62], [x - 6, -40, 0.62]], true), { tone: "faint" }));
    }

    // --- Floor lamp, back left: brass pole, weighted base, linen drum shade, a warm pool of light ---
    const LX = -50, LY = 35;
    out.push(`<path class="m-lamp-pool" d="${k.pathOf(k.circleRing(LX + 10, LY - 6, 46, 40).map(([x, y]) => at([x, y, 0.7])), true)}"/>`);
    out.push(cyl(LX, LY, 14, 0, 3, { steps: 40, bevel: 0.6, tone: "hi", crease: "lo", className: "m-brass" }));
    out.push(cyl(LX, LY, 1.2, 3, 146, { steps: 12, tone: "hi", crease: "lo", className: "m-brass" }));
    const shade = [[0, 20], [26, 13], [26.05, 0]];
    out.push(`<g class="m-shade">${S(G.solidOf(shade, Fz(LX, LY, 140), P, { smooth: false, steps: 40 }), { tone: "hi", crease: "lo" })}</g>`);
    out.push(`<path class="m-lamp-glow" d="${k.pathOf(k.circleRing(LX, LY, 19, 40).map(([x, y]) => at([x, y, 140.2])), true)}"/>`);

    // --- Side table, back right of the chair: wooden top on a pedestal --------------------------------
    const TX = -34, TY = -64, TZ = 57;
    out.push(halo({ x: TX - 16, y: TY - 16, w: 32, d: 32, r: 16 }, 0, 2));
    out.push(cyl(TX, TY, 15, 0, 5, { steps: 40, bevel: 0.8, tone: "hi", crease: "lo", className: "m-wood-dark" }));
    out.push(cyl(TX, TY, 3, 5, TZ - 3, { steps: 16, tone: "hi", crease: "lo", className: "m-wood-dark" }));
    out.push(cyl(TX, TY, 22, TZ - 3, TZ, { steps: 56, bevel: 0.8, tone: "hi", crease: "lo", className: "m-wood" }));
    // Two books, stacked a little askew.
    out.push(`<g class="m-b4">${box(TX - 15, TY - 2, TZ, TX + 1, TY + 13, TZ + 3, { r: 0.5, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-b2">${box(TX - 13, TY + 1, TZ + 3, TX - 1, TY + 11, TZ + 5.4, { r: 0.5, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    // The mug of tea, its tag hanging over the rim, steam rising.
    const MX = TX + 9, MY = TY - 8, MZ = TZ;
    out.push(cyl(MX, MY, 4.8, MZ, MZ + 9.5, { steps: 28, bevel: 0.4, tone: "hi", crease: "lo", className: "m-mug" }));
    out.push(`<path class="m-tea" d="${k.pathOf(k.circleRing(MX, MY, 4.1, 28).map(([x, y]) => at([x, y, MZ + 8.6])), true)}"/>`);
    out.push(`<g class="m-mug">${c.tube([[MX + 1, MY - 4.4, MZ + 7.6], [MX + 2, MY - 8.4, MZ + 6.6], [MX + 2, MY - 8.4, MZ + 3], [MX + 1, MY - 4.4, MZ + 2.4]], 0.9, { tone: "hi", spacing: 2 })}</g>`);
    out.push(L(path3([[MX + 3, MY + 3, MZ + 9.4], [MX + 4.6, MY + 4.4, MZ + 9.8], [MX + 5.2, MY + 5, MZ + 5.4]]), { tone: "lo" }));
    out.push(`<path class="m-tag" d="${path3([[MX + 4.6, MY + 4.6, MZ + 5.6], [MX + 5.8, MY + 5.8, MZ + 5.6], [MX + 5.8, MY + 5.8, MZ + 2.8], [MX + 4.6, MY + 4.6, MZ + 2.8]], true)}"/>`);
    const wisp = (dx, dy, ph, tall) => {
      const pts = [];
      for (let i = 0; i <= 18; i++) {
        const t = i / 18;
        pts.push(at([MX + dx + Math.sin(t * 6 + ph) * 1.4 * (1 + t), MY + dy + Math.cos(t * 5 + ph) * 0.8, MZ + 11 + t * tall]));
      }
      return `<path class="m-steam" d="${k.pathOf(pts)}" pathLength="100"/>`;
    };
    out.push(`<g data-part="steam">${wisp(-1, 0, 0, 22)}${wisp(1.4, 1, 2.1, 26)}</g>`);

    // --- The chair: short tapered legs, an upholstered plinth, seat and back cushions -----------------
    const legs = [[-34, -31], [-34, 31], [26, -31], [26, 31]];
    out.push(halo({ x: -40, y: -37, w: 72, d: 74, r: 10 }, 0, 3));
    for (const [x, y] of legs) out.push(cyl(x, y, 1.7, 0, 12, { steps: 12, tone: "hi", crease: "lo", className: "m-wood-dark" }));
    out.push(`<g class="m-velvet">${box(-38, -35, 12, 30, 35, SEAT - 6, { r: 5, steps: 4, bevel: 1.2, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-velvet">${box(-38, -35, SEAT - 6, -26, 35, 94, { r: 5, steps: 4, bevel: 1.6, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-velvet-hi">${box(-26, -31, SEAT - 6, 31, 31, SEAT, { r: 4, steps: 4, bevel: 1.6, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-velvet-hi">${box(-26, -30, SEAT, -19, 30, 86, { r: 4, steps: 4, bevel: 1.4, tone: "hi", crease: "lo" })}</g>`);
    // Piping along the seat cushion's front edge.
    out.push(L(path3([[31, -30, SEAT - 0.6], [31, 30, SEAT - 0.6]]), { tone: "lo" }));
    return out.join("");
  },
});
