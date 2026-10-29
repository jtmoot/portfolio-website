// The reading corner, front left of the room: a leather club chair facing into the room (its back
// to the viewer), a round side table by its near arm with a mug of tea (tag over the rim, steam
// rising) and two books, a brass floor lamp over his shoulder, and a rug under it all.
// Local world: the chair's seat centred on the origin; the chair faces -y (into the room), +x is
// toward the viewer's side, z up. Centimetres.
// Animated parts: the tea's steam (class m-steam, CSS in src/styles/iso.css).
import { station, k, G } from "./lib.mjs";

const SEAT = 46; // seat cushion top

export default station("reading", {
  label: "Joshua's reading corner: a leather club chair, a side table with a mug of tea and two books, and a brass floor lamp, on a rug.",
  bounds: [[-72, -76, 0], [86, -76, 0], [-72, 60, 0], [86, 60, 0], [-55, 35, 172], [63, 30, 90], [0, 42, 96]],
  draw(c) {
    const { box, cyl, S, L, at, path3, halo, P } = c;
    const out = [];
    const Fz = (x, y, z) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);

    // --- Rug ---------------------------------------------------------------------------------------
    const RX0 = -66, RX1 = 80, RY0 = -72, RY1 = 52;
    out.push(halo({ x: RX0 - 2, y: RY0 - 2, w: RX1 - RX0 + 4, d: RY1 - RY0 + 4, r: 8 }, 0, 2));
    out.push(`<g class="m-rug">${box(RX0, RY0, 0, RX1, RY1, 0.6, { r: 6, steps: 3, tone: "hi", crease: "lo" })}</g>`);
    const inset = (m) => path3([[RX0 + m, RY0 + m, 0.62], [RX1 - m, RY0 + m, 0.62], [RX1 - m, RY1 - m, 0.62], [RX0 + m, RY1 - m, 0.62]], true);
    out.push(L(inset(6) + inset(9), { tone: "faint" }));
    for (let i = 0; i < 6; i++) {
      const y = RY0 + 20 + i * 18;
      out.push(L(path3([[RX1 - 20, y, 0.62], [RX1 - 14, y + 6, 0.62], [RX1 - 20, y + 12, 0.62], [RX1 - 26, y + 6, 0.62]], true), { tone: "faint" }));
    }

    // --- Floor lamp, back left: brass pole, weighted base, linen drum shade, a warm pool of light ---
    const LX = -55, LY = 35;
    out.push(`<path class="m-lamp-pool" d="${k.pathOf(k.circleRing(LX + 10, LY - 6, 46, 40).map(([x, y]) => at([x, y, 0.7])), true)}"/>`);
    out.push(cyl(LX, LY, 14, 0, 3, { steps: 40, bevel: 0.6, tone: "hi", crease: "lo", className: "m-brass" }));
    out.push(cyl(LX, LY, 1.2, 3, 146, { steps: 12, tone: "hi", crease: "lo", className: "m-brass" }));
    const shade = [[0, 20], [26, 13], [26.05, 0]];
    out.push(`<g class="m-shade">${S(G.solidOf(shade, Fz(LX, LY, 140), P, { smooth: false, steps: 40 }), { tone: "hi", crease: "lo" })}</g>`);
    out.push(`<path class="m-lamp-glow" d="${k.pathOf(k.circleRing(LX, LY, 19, 40).map(([x, y]) => at([x, y, 140.2])), true)}"/>`);

    // --- The chair: a leather club chair on low block legs, deep tight back, wide padded arms --------
    const W = 46; // half width
    out.push(halo({ x: -W - 4, y: -40, w: 2 * W + 8, d: 86, r: 12 }, 0, 3));
    for (const [x, y] of [[-W + 8, -30], [W - 8, -30], [-W + 8, 36], [W - 8, 36]]) {
      out.push(`<g class="m-wood-dark">${box(x - 3.5, y - 3.5, 0, x + 3.5, y + 3.5, 9, { r: 0.6, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    }
    out.push(`<g class="m-leather">${box(-W, -36, 9, W, 42, SEAT - 6, { r: 6, steps: 4, bevel: 1.4, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-leather">${box(-W, 26, SEAT - 6, W, 42, 96, { r: 8, steps: 4, bevel: 2.2, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-leather-hi">${box(-W + 16, -34, SEAT - 6, W - 16, 27, SEAT + 2, { r: 5, steps: 4, bevel: 1.8, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-leather-hi">${box(-W + 16, 18, SEAT + 2, W - 16, 27, 90, { r: 5, steps: 4, bevel: 1.6, tone: "hi", crease: "lo" })}</g>`);
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? -W : W - 16, x1 = side < 0 ? -W + 16 : W;
      out.push(`<g class="m-leather">${box(x0, -36, SEAT - 6, x1, 34, 62, { r: 7, steps: 4, bevel: 2.4, tone: "hi", crease: "lo" })}</g>`);
    }

    // The side table stands nearer the viewer than the chair, so it is drawn after it.
    // --- Side table by the near arm: a wooden top on a pedestal -----------------------------------------
    const TX = 63, TY = 30, TZ = 57;
    out.push(halo({ x: TX - 13, y: TY - 13, w: 26, d: 26, r: 13 }, 0, 2));
    out.push(cyl(TX, TY, 12, 0, 5, { steps: 40, bevel: 0.8, tone: "hi", crease: "lo", className: "m-wood-dark" }));
    out.push(cyl(TX, TY, 3, 5, TZ - 3, { steps: 16, tone: "hi", crease: "lo", className: "m-wood-dark" }));
    out.push(cyl(TX, TY, 16, TZ - 3, TZ, { steps: 56, bevel: 0.8, tone: "hi", crease: "lo", className: "m-wood" }));
    // Two books, stacked a little askew.
    out.push(`<g class="m-b4">${box(TX - 12, TY - 1, TZ, TX + 1, TY + 11, TZ + 3, { r: 0.5, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-b2">${box(TX - 10.5, TY + 1.5, TZ + 3, TX - 1, TY + 9.5, TZ + 5.4, { r: 0.5, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    // The mug of tea, its tag hanging over the rim, steam rising.
    const MX = TX + 6, MY = TY - 7, MZ = TZ;
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

    return out.join("");
  },
});
