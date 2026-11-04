// A corkboard on the back wall in an oak frame of four mitred rails, holding the covers of the four
// podcasts Joshua listens to (images from public/podcasts) pinned in a loose two-by-two, with an index
// card between them. Local world: wall plane x = 0, board centred on y = 0. Centimetres.
import { station, k, G } from "./lib.mjs";
import { PODCASTS } from "../../src/content/shelf.js";

const W = 72, H = 50, Z0 = 112;
const FR = 2.6; // rail width
const D = 1.6; // backing board depth: its front is the cork
const RAIL = 1.4; // how far the rails stand proud of the cork

export default station("corkboard", {
  label: "A corkboard in an oak frame with the covers of four podcasts pinned to it, and an index card between them.",
  bounds: [[0, -W / 2 - 1, Z0 - 2], [0, W / 2 + 1, Z0 - 2], [D + RAIL + 1, -W / 2 - 1, Z0 - 2], [0, -W / 2, Z0 + H + 2], [0, W / 2, Z0 + H + 2], [D + RAIL + 1, W / 2 + 1, Z0 + H]],
  pad: 4,
  draw(c) {
    const { box, L, D: dots, at, frame, S, path3, P } = c;
    const out = [];
    const y0 = -W / 2, y1 = W / 2, z1 = Z0 + H;
    const solid = { tone: "hi", crease: "lo" };

    // Backing board; its front face is the cork.
    out.push(`<g class="m-wood">${box(0, y0, Z0, D, y1, z1, { r: 0.2, steps: 1, ...solid })}</g>`);
    const X = D + 0.02;
    const field = [[X, y1 - FR, Z0 + FR], [X, y0 + FR, Z0 + FR], [X, y0 + FR, z1 - FR], [X, y1 - FR, z1 - FR]];
    out.push(`<path class="m-cork" d="${k.pathOf(field.map(at), true)}"/>`);
    // Speckle, in two grades, kept off the rails.
    let s = 9;
    const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const speck = (n) => {
      const pts = [];
      for (let i = 0; i < n; i++) pts.push(at([X, y0 + FR + 0.6 + r() * (W - 2 * FR - 1.2), Z0 + FR + 0.6 + r() * (H - 2 * FR - 1.2)]));
      return pts;
    };
    out.push(dots(speck(240), { size: 0.3, tone: "lo" }));
    out.push(dots(speck(160), { size: 0.18, tone: "mid" }));
    // The rails stand proud of the cork and shade it along the top and the near (+y, screen-left) edge.
    const band = (pts) => `<path class="m-inset-shade" d="${path3(pts, true)}"/>`;
    out.push(band([[X, y1 - FR, z1 - FR], [X, y0 + FR, z1 - FR], [X, y0 + FR, z1 - FR - 1.5], [X, y1 - FR, z1 - FR - 1.5]]));
    out.push(band([[X, y1 - FR, z1 - FR], [X, y1 - FR - 1.2, z1 - FR], [X, y1 - FR - 1.2, Z0 + FR], [X, y1 - FR, Z0 + FR]]));

    // The podcasts: four square covers in a loose two-by-two, each tilted a little on its own pin.
    // Drawn in the wall plane with (u along -y, v up) coordinates.
    const T = c.planeX(X + 0.05);
    const SQ = 17;
    const tile = (u, v, rot, pod) => {
      const x = u - SQ / 2, y = -(v + SQ / 2);
      const spin = `rotate(${rot} ${u.toFixed(2)} ${(-v).toFixed(2)})`;
      return `<g transform="${T}"><g transform="${spin}"><rect class="m-sheet-shadow" x="${x + 0.7}" y="${y + 1}" width="${SQ}" height="${SQ}"/>` +
        `<image href="${pod.art}" x="${x}" y="${y}" width="${SQ}" height="${SQ}" preserveAspectRatio="xMidYMid slice"/>` +
        `<rect class="iso-line" data-tone="lo" fill="none" x="${x}" y="${y}" width="${SQ}" height="${SQ}"/></g></g>`;
    };
    // A push pin: a round head standing out of the wall, a little above each sheet's top edge.
    const pin = (u, v, cls) => {
      const F = frame([X + 0.1, -u, v], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
      return `<g class="${cls}">${S(G.disc(0, 1.1, 1.15, F, P, { steps: 40 }), { tone: "hi", crease: "lo" })}</g>`;
    };
    const pinned = (u, v, rot, h) => {
      // Where the pin sits after the sheet's tilt: h above the centre, turned with it.
      const a = (rot * Math.PI) / 180;
      return [u + h * Math.sin(a), v + h * Math.cos(a)];
    };
    const cu = (y) => -y; // wall u for a world y
    const SPOTS = [[cu(-11.5), Z0 + 34, -3, "m-pin-red"], [cu(10.5), Z0 + 35, 2.5, "m-pin-blue"], [cu(-10.5), Z0 + 13.5, 2, "m-pin-blue"], [cu(11.5), Z0 + 14, -2.5, "m-pin-red"]];
    PODCASTS.forEach((pod, i) => {
      const [u, v, rot, cls] = SPOTS[i];
      out.push(tile(u, v, rot, pod));
      const [pu, pv] = pinned(u, v, rot, SQ / 2 - 1.6);
      out.push(pin(pu, pv, cls));
    });

    // An index card at the right, pinned at a slant: a red head rule and four blue rules, with a
    // few words' worth of line on each (printed text, so these lines may stop short).
    const CW = 12.7, CH = 7.6;
    const [cuC, cvC, rotC] = [27.5, Z0 + 27, 5];
    const cx = cuC - CW / 2, cy = -(cvC + CH / 2);
    let rules = "";
    for (let i = 0; i < 4; i++) {
      const yy = cy + 2.4 + i * 1.3;
      rules += `M${cx.toFixed(2)} ${yy.toFixed(2)}L${(cx + CW).toFixed(2)} ${yy.toFixed(2)}`;
    }
    const words = `M${(cx + 1).toFixed(2)} ${(cy + 2.1).toFixed(2)}L${(cx + 7.4).toFixed(2)} ${(cy + 2.1).toFixed(2)}M${(cx + 1).toFixed(2)} ${(cy + 3.4).toFixed(2)}L${(cx + 9.2).toFixed(2)} ${(cy + 3.4).toFixed(2)}M${(cx + 1).toFixed(2)} ${(cy + 4.7).toFixed(2)}L${(cx + 5.6).toFixed(2)} ${(cy + 4.7).toFixed(2)}`;
    out.push(
      `<g transform="${T}"><g transform="rotate(${rotC} ${cuC.toFixed(2)} ${(-cvC).toFixed(2)})">` +
        `<rect class="m-sheet-shadow" x="${(cx + 0.6).toFixed(2)}" y="${(cy + 0.9).toFixed(2)}" width="${CW}" height="${CH}"/>` +
        `<rect class="m-card" x="${cx.toFixed(2)}" y="${cy.toFixed(2)}" width="${CW}" height="${CH}"/>` +
        `<path class="m-card-head" d="M${cx.toFixed(2)} ${(cy + 1.3).toFixed(2)}L${(cx + CW).toFixed(2)} ${(cy + 1.3).toFixed(2)}"/>` +
        `<path class="m-card-rule" d="${rules}"/>` +
        `<path class="iso-line" data-tone="mid" data-free="true" d="${words}"/>` +
        `<rect class="iso-line" data-tone="lo" fill="none" x="${cx.toFixed(2)}" y="${cy.toFixed(2)}" width="${CW}" height="${CH}"/>` +
        `</g></g>`,
    );
    const [cpu, cpv] = pinned(cuC, cvC, rotC, CH / 2 - 1.2);
    out.push(pin(cpu, cpv, "m-pin-blue"));

    // The frame: four rails standing proud of the cork, mitred at the corners, the near one last.
    const rail = (ya, za, yb, zb) => `<g class="m-wood">${box(D, ya, za, D + RAIL, yb, zb, { r: 0.25, steps: 2, bevel: 0.4, ...solid })}</g>`;
    out.push(rail(y0, Z0, y1, Z0 + FR));
    out.push(rail(y0, Z0 + FR, y0 + FR, z1 - FR));
    out.push(rail(y0, z1 - FR, y1, z1));
    out.push(rail(y1 - FR, Z0 + FR, y1, z1 - FR));
    const fx = D + RAIL + 0.02;
    const mitre = (yo, zo, yi, zi) => L(path3([[fx, yo, zo], [fx, yi, zi]]), { tone: "lo" });
    out.push(mitre(y0, Z0, y0 + FR, Z0 + FR) + mitre(y1, Z0, y1 - FR, Z0 + FR) + mitre(y0, z1, y0 + FR, z1 - FR) + mitre(y1, z1, y1 - FR, z1 - FR));
    return out.join("");
  },
});
