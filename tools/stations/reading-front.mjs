// The reading corner, the part drawn in front of the figure when he sits: the club chair's back
// cushion, near arm and tall back, then the side table by the near arm with a mug of coffee (steam
// rising, class m-steam) and two books. Registers with reading.mjs through the shared bounds.
import { station, k } from "./lib.mjs";
import { BOUNDS, SEAT, W } from "./reading-shared.mjs";

export default station("reading-front", {
  label: "The back of the reading chair and a side table with a mug of coffee.",
  bounds: BOUNDS,
  draw(c) {
    const { box, cyl, L, D, at, path3, halo } = c;
    const out = [];
    // Painter's order, far to near: back cushion, near arm, then the tall back nearest the viewer.
    out.push(`<g class="m-leather-hi">${box(-W + 16, 18, SEAT, W - 16, 26, 90, { r: 4, steps: 4, bevel: 1.4, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-leather">${box(W - 16, -36, SEAT - 6, W, 26, 62, { r: 6, steps: 4, bevel: 2.2, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-leather">${box(-W, 26, SEAT - 6, W, 42, 96, { r: 6, steps: 4, bevel: 2, tone: "hi", crease: "lo" })}</g>`);
    // On the back's outer panel: welt seams and a row of brass nailheads along the bottom.
    out.push(`<g class="m-leather">${L(path3([[-W + 16, 42.05, 44], [-W + 16, 42.05, 92]]) + path3([[W - 16, 42.05, 44], [W - 16, 42.05, 92]]), { tone: "lo" })}</g>`);
    const nails = [];
    for (let i = 0; i <= 14; i++) nails.push(at([-W + 4 + (i * (2 * W - 8)) / 14, 42.1, 15]));
    out.push(D(nails, { size: 0.5, tone: "mid" }));

    // --- Side table by the near arm: a wooden top on a pedestal --------------------------------------
    const TX = 63, TY = 30, TZ = 57;
    out.push(halo({ x: TX - 13, y: TY - 13, w: 26, d: 26, r: 13 }, 0, 2));
    out.push(cyl(TX, TY, 12, 0, 5, { steps: 40, bevel: 0.8, tone: "hi", crease: "lo", className: "m-wood-dark" }));
    out.push(cyl(TX, TY, 3, 5, TZ - 3, { steps: 16, tone: "hi", crease: "lo", className: "m-wood-dark" }));
    out.push(cyl(TX, TY, 16, TZ - 3, TZ, { steps: 56, bevel: 0.8, tone: "hi", crease: "lo", className: "m-wood" }));
    out.push(`<g class="m-b4">${box(TX - 12, TY - 1, TZ, TX + 1, TY + 11, TZ + 3, { r: 0.5, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-b2">${box(TX - 10.5, TY + 1.5, TZ + 3, TX - 1, TY + 9.5, TZ + 5.4, { r: 0.5, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    // The mug of coffee, steam rising.
    const MX = TX + 6, MY = TY - 7, MZ = TZ;
    out.push(cyl(MX, MY, 4.8, MZ, MZ + 9.5, { steps: 28, bevel: 0.4, tone: "hi", crease: "lo", className: "m-mug" }));
    out.push(`<path class="m-coffee" d="${k.pathOf(k.circleRing(MX, MY, 4.1, 28).map(([x, y]) => at([x, y, MZ + 8.8])), true)}"/>`);
    out.push(`<g class="m-mug">${c.tube([[MX + 4.2, MY + 1, MZ + 7.6], [MX + 8.2, MY + 2, MZ + 6.6], [MX + 8.2, MY + 2, MZ + 3], [MX + 4.2, MY + 1, MZ + 2.4]], 0.9, { tone: "hi", spacing: 2 })}</g>`);
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
