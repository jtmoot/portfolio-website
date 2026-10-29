// The two back walls of Joshua's room, cut away at 230 cm: the back wall along pad y = 0 and the
// right wall along pad x = 100, with skirting boards, two outlets and a light switch.
// Local world = room world: kit x = pad y * 5, kit y = -pad x * 5, origin at the back-left corner.
import { station, k } from "./lib.mjs";

const HGT = 230, T = 10, XR = 390, YR = -500;

export default station("walls", {
  label: "The back and right walls of the room.",
  bounds: [[-T, 0, 0], [-T, YR - T, 0], [XR, YR - T, 0], [0, 0, HGT], [-T, YR - T, HGT], [XR, YR - T, HGT], [XR, YR, 0]],
  pad: 2,
  draw(c) {
    const { box, L, D, at } = c;
    const out = [];
    // Right wall first (its far end is behind the corner), then the back wall.
    out.push(`<g class="m-wall">${box(0, YR - T, 0, XR, YR, HGT, { r: 0, steps: 1, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-wall">${box(-T, YR - T, 0, 0, 0, HGT, { r: 0, steps: 1, tone: "hi", crease: "lo" })}</g>`);
    // Corner line where the two inner faces meet.
    out.push(L(k.pathOf([at([0, YR, 0]), at([0, YR, HGT])]), { tone: "faint" }));
    // Skirting boards.
    out.push(`<g class="m-paint">${box(0, YR, 0, XR, YR + 1.5, 9, { r: 0.2, steps: 1, tone: "hi", crease: "lo" })}</g>`);
    out.push(`<g class="m-paint">${box(0, YR, 0, 1.5, 0, 9, { r: 0.2, steps: 1, tone: "hi", crease: "lo" })}</g>`);
    // Outlets on the back wall (x = 0 face) and a switch on the right wall (y = YR face).
    const plateX = (y, z) => `<g class="m-paint">${box(0, y - 4, z - 6, 0.6, y + 4, z + 6, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}</g>` +
      D([at([0.6, y - 1.2, z + 2]), at([0.6, y + 1.2, z + 2]), at([0.6, y - 1.2, z - 2]), at([0.6, y + 1.2, z - 2])], { size: 0.35, tone: "hi" });
    out.push(plateX(-155, 30) + plateX(-395, 30));
    out.push(`<g class="m-paint">${box(300, YR, 104, 308, YR + 0.6, 116, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    out.push(L(k.pathOf([at([304, YR + 0.6, 108]), at([304, YR + 0.6, 112])]), { tone: "mid" }));
    return out.join("");
  },
});
