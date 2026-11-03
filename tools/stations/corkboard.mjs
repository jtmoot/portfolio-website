// A corkboard on the back wall holding the covers of the four podcasts Joshua listens to (images
// from public/podcasts), pinned in a loose two-by-two.
// Local world: wall plane x = 0, board centred on y = 0. Centimetres.
import { station, k } from "./lib.mjs";
import { PODCASTS } from "../../src/content/shelf.js";

const W = 72, H = 50, Z0 = 112;
const FR = 2.4; // frame width
const D = 2.2; // board depth

export default station("corkboard", {
  label: "A corkboard with the covers of four podcasts pinned to it.",
  bounds: [[0, -W / 2 - 1, Z0 - 2], [0, W / 2 + 1, Z0 - 2], [D + 1, -W / 2 - 1, Z0 - 2], [0, -W / 2, Z0 + H + 2], [0, W / 2, Z0 + H + 2], [D + 1, W / 2 + 1, Z0 + H]],
  pad: 4,
  draw(c) {
    const { box, L, D: dots, at } = c;
    const out = [];
    const y0 = -W / 2, y1 = W / 2, z1 = Z0 + H;
    out.push(`<g class="m-wood">${box(0, y0, Z0, D, y1, z1, { r: 0.4, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })}</g>`);
    const X = D + 0.02;
    // Cork field with a speckle texture.
    const field = [[X, y1 - FR, Z0 + FR], [X, y0 + FR, Z0 + FR], [X, y0 + FR, z1 - FR], [X, y1 - FR, z1 - FR]];
    out.push(`<path class="m-cork" d="${k.pathOf(field.map(at), true)}"/>`);
    const speck = [];
    let s = 9;
    const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 260; i++) speck.push(at([X, y0 + FR + 0.6 + r() * (W - 2 * FR - 1.2), Z0 + FR + 0.6 + r() * (H - 2 * FR - 1.2)]));
    out.push(dots(speck, { size: 0.28, tone: "lo" }));
    out.push(L(k.pathOf(field.map(at), true), { tone: "lo" }));

    // The podcasts: four square covers in a loose two-by-two, each tilted a little on its own pin.
    // Drawn in the wall plane with (u along -y, v up) coordinates.
    const T = c.planeX(X + 0.05);
    const SQ = 17;
    const tile = (u, v, rot, pod, pin) => {
      const x = u - SQ / 2, y = -(v + SQ / 2);
      const spin = `rotate(${rot} ${u.toFixed(2)} ${(-v).toFixed(2)})`;
      return `<g transform="${T}"><g transform="${spin}"><rect class="m-sheet-shadow" x="${x + 0.6}" y="${y + 0.9}" width="${SQ}" height="${SQ}"/>` +
        `<image href="${pod.art}" x="${x}" y="${y}" width="${SQ}" height="${SQ}" preserveAspectRatio="xMidYMid slice"/>` +
        `<rect class="iso-line" data-tone="lo" fill="none" x="${x}" y="${y}" width="${SQ}" height="${SQ}"/>` +
        `<circle class="m-pin-${pin}" cx="${u.toFixed(2)}" cy="${(y + 1.6).toFixed(2)}" r="1"/></g></g>`;
    };
    const cu = (y) => -y; // wall u for a given world y
    const SPOTS = [[cu(-11.5), Z0 + 34, -3, "a"], [cu(10.5), Z0 + 35, 2.5, "b"], [cu(-10.5), Z0 + 13.5, 2, "b"], [cu(11.5), Z0 + 14, -2.5, "a"]];
    PODCASTS.forEach((pod, i) => out.push(tile(SPOTS[i][0], SPOTS[i][1], SPOTS[i][2], pod, SPOTS[i][3])));
    return out.join("");
  },
});
