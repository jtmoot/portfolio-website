// The reading corner, front left of the room, the part drawn behind the figure: a rug, a brass floor
// lamp, and a leather club chair's tall back, back cushion, legs, base, far arm and seat. The chair
// faces +y (the camera), so its near arm and the side table are in reading-front.mjs, drawn in front
// of him when he sits.
import { station, k, G } from "./lib.mjs";
import { BOUNDS, SEAT, W } from "./reading-shared.mjs";

export default station("reading", {
  label: "Joshua's reading corner: a leather club chair, a side table with a mug of coffee and two books, and a brass floor lamp, on a rug.",
  bounds: BOUNDS,
  draw(c) {
    const { box, cyl, S, L, D, at, path3, halo, P } = c;
    const out = [];
    const Fz = (x, y, z) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);

    // --- Rug ---------------------------------------------------------------------------------------
    const RX0 = -66, RX1 = 80, RY0 = -72, RY1 = 52;
    out.push(halo({ x: RX0 - 2, y: RY0 - 2, w: RX1 - RX0 + 4, d: RY1 - RY0 + 4, r: 8 }, 0, 2, { walkable: true }));
    out.push(`<g class="m-rug">${box(RX0, RY0, 0, RX1, RY1, 0.6, { r: 4, steps: 3, tone: "hi", crease: "lo" })}</g>`);
    const inset = (m) => path3([[RX0 + m, RY0 + m, 0.62], [RX1 - m, RY0 + m, 0.62], [RX1 - m, RY1 - m, 0.62], [RX0 + m, RY1 - m, 0.62]], true);
    out.push(L(inset(6) + inset(9), { tone: "faint" }));

    // --- Floor lamp behind his far shoulder: brass pole, weighted base, linen shade, a pool of light --
    const LX = -60, LY = -15;
    out.push(`<path class="m-lamp-pool" d="${k.pathOf(k.circleRing(LX + 10, LY - 6, 46, 40).map(([x, y]) => at([x, y, 0.7])), true)}"/>`);
    out.push(cyl(LX, LY, 14, 0, 3, { steps: 40, bevel: 0.6, tone: "hi", crease: "lo", className: "m-brass" }));
    out.push(cyl(LX, LY, 1.2, 3, 146, { steps: 12, tone: "hi", crease: "lo", className: "m-brass" }));
    const shade = [[0, 20], [26, 13], [26.05, 0]];
    out.push(`<g class="m-shade">${S(G.solidOf(shade, Fz(LX, LY, 140), P, { smooth: false, steps: 40 }), { tone: "hi", crease: "lo" })}</g>`);
    out.push(`<path class="m-lamp-glow" d="${k.pathOf(k.circleRing(LX, LY, 19, 40).map(([x, y]) => at([x, y, 140.2])), true)}"/>`);

    // --- The chair behind him, back to front: legs, the tall back, the base, far arm, back cushion, seat --
    out.push(halo({ x: -W - 4, y: -46, w: 2 * W + 8, d: 86, r: 12 }, 0, 3));
    for (const [x, y] of [[-W + 8, -36], [W - 8, -36], [-W + 8, 30], [W - 8, 30]]) {
      out.push(`<g class="m-wood-dark">${box(x - 3.5, y - 3.5, 0, x + 3.5, y + 3.5, 9, { r: 0.6, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    }
    out.push(`<g class="m-leather">${box(-W, -42, SEAT - 6, W, -26, 96, { r: 6, steps: 4, bevel: 2, tone: "hi", crease: "lo" })}</g>`);
    // On the back's outer panel (toward the room): welt seams and a row of brass nailheads.
    out.push(`<g class="m-leather">${L(path3([[-W + 16, -42.05, 44], [-W + 16, -42.05, 92]]) + path3([[W - 16, -42.05, 44], [W - 16, -42.05, 92]]), { tone: "lo" })}</g>`);
    const nails = [];
    for (let i = 0; i <= 14; i++) nails.push(at([-W + 4 + (i * (2 * W - 8)) / 14, -42.1, 15]));
    out.push(D(nails, { size: 0.5, tone: "mid" }));
    out.push(`<g class="m-leather">${box(-W, -42, 9, W, 36, SEAT - 6, { r: 5, steps: 4, bevel: 1.2, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-leather">${box(-W, -26, SEAT - 6, -W + 16, 36, 62, { r: 6, steps: 4, bevel: 2.2, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-leather-hi">${box(-W + 16, -26, SEAT, W - 16, -18, 90, { r: 4, steps: 4, bevel: 1.4, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-leather-hi">${box(-W + 16, -26, SEAT - 6, W - 16, 34, SEAT, { r: 4, steps: 4, bevel: 1.6, tone: "hi", crease: "lo" })}</g>`);
    return out.join("");
  },
});
