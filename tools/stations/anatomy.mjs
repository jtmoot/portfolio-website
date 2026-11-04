// A framed anatomy chart on the back wall: a brain in sagittal section in the manner of a
// Gray's plate, behind glass in a dark moulded frame with a cream mat. Six parts carry leaders
// from a dot on the part to a two-line label in the margin; a title above, a caption and a plate
// number below. Local world: wall plane x = 0. Centimetres.
import { station, k } from "./lib.mjs";

// Hung with its bottom edge 13 cm above the bookcase's picture light (127 cm), top at 202 cm.
const W = 46, H = 62, Z0 = 140;
const FR = 2.6; // rail width
const MAT = 2.4; // mat width inside the rails
const D = 1.8; // backing depth: its front carries the mat and the plate
const RAIL = 1.2; // how far the rails stand proud

export default station("anatomy", {
  label: "A framed anatomy chart of the brain in sagittal section, with labelled parts, in the style of an old engraved plate.",
  bounds: [[0, -W / 2 - 1, Z0 - 1], [0, W / 2 + 1, Z0 - 1], [D + RAIL + 1, -W / 2 - 1, Z0 - 1], [0, -W / 2, Z0 + H + 1], [0, W / 2, Z0 + H + 1], [D + RAIL + 1, W / 2 + 1, Z0 + H]],
  pad: 4,
  draw(c) {
    const { box, at, L, path3 } = c;
    const out = [];
    const y0 = -W / 2, y1 = W / 2, z1 = Z0 + H;
    const solid = { tone: "hi", crease: "lo" };
    out.push(`<g class="m-wood-dark">${box(0, y0, Z0, D, y1, z1, { r: 0.2, steps: 1, ...solid })}</g>`);
    const X = D + 0.02;
    // The mat, then the plate in its window, with the mat's bevel drawn as a lighter line just inside.
    const mat = [[X, y1 - FR, Z0 + FR], [X, y0 + FR, Z0 + FR], [X, y0 + FR, z1 - FR], [X, y1 - FR, z1 - FR]];
    out.push(`<path class="m-mat" d="${k.pathOf(mat.map(at), true)}"/>`);
    const IN = FR + MAT;
    const paper = [[X, y1 - IN, Z0 + IN], [X, y0 + IN, Z0 + IN], [X, y0 + IN, z1 - IN], [X, y1 - IN, z1 - IN]];
    out.push(`<path class="m-plate-paper" d="${k.pathOf(paper.map(at), true)}"/>`);
    out.push(L(k.pathOf(paper.map(at), true), { tone: "lo" }));
    const bevel = [[X, y1 - IN + 0.5, Z0 + IN - 0.5], [X, y0 + IN - 0.5, Z0 + IN - 0.5], [X, y0 + IN - 0.5, z1 - IN + 0.5], [X, y1 - IN + 0.5, z1 - IN + 0.5]];
    out.push(L(k.pathOf(bevel.map(at), true), { tone: "faint" }));
    // The rails' shadow on the mat along the top and the near (+y, screen-left) edge.
    const band = (pts) => `<path class="m-inset-shade" d="${path3(pts, true)}"/>`;
    out.push(band([[X, y1 - FR, z1 - FR], [X, y0 + FR, z1 - FR], [X, y0 + FR, z1 - FR - 1.1], [X, y1 - FR, z1 - FR - 1.1]]));
    out.push(band([[X, y1 - FR, z1 - FR], [X, y1 - FR - 0.9, z1 - FR], [X, y1 - FR - 0.9, Z0 + FR], [X, y1 - FR, Z0 + FR]]));

    // Plate drawing in the wall plane: u along -y (screen right on this wall), v down.
    const cz = Z0 + H * 0.54;
    const T = c.planeX(X + 0.04);
    const g = (d, tone = "mid", extra = "") => `<path class="iso-line" data-tone="${tone}" ${extra} d="${d}"/>`;
    const sh = (u, v) => `${u.toFixed(2)} ${(-cz + v).toFixed(2)}`;
    // Cerebrum outline (frontal lobe toward -u), temporal underside, occipital pole.
    const cerebrum = `M${sh(-15, 2)}C${sh(-16, -7)} ${sh(-9, -12.5)} ${sh(0, -12.5)}C${sh(9, -12.5)} ${sh(16, -7)} ${sh(16, 0.5)}C${sh(16, 4)} ${sh(13.5, 6)} ${sh(10.5, 5.8)}C${sh(8, 5.6)} ${sh(5.5, 7.6)} ${sh(2, 7)}C${sh(-1.5, 6.4)} ${sh(-5, 8.2)} ${sh(-9, 7)}C${sh(-12.5, 6)} ${sh(-15, 5.2)} ${sh(-15, 2)}Z`;
    const cerebellum = `M${sh(6, 6.6)}C${sh(8, 5.2)} ${sh(14, 5.4)} ${sh(15, 8.2)}C${sh(15.6, 10.6)} ${sh(12, 12.2)} ${sh(8.6, 11.4)}C${sh(6.4, 10.8)} ${sh(5.4, 8.6)} ${sh(6, 6.6)}Z`;
    let folia = "";
    for (let i = 1; i <= 4; i++) folia += `M${sh(6.6 + i * 0.4, 7 + i * 0.9)}C${sh(9, 6 + i * 0.9)} ${sh(13, 6.4 + i * 0.9)} ${sh(14.6, 8 + i * 0.7)}`;
    // Brain stem with the pons' bulge, down to the medulla.
    const stem = `M${sh(2.4, 7)}C${sh(1.6, 9.5)} ${sh(1.8, 12)} ${sh(2.8, 13.5)}C${sh(3.2, 15.5)} ${sh(3.4, 17.5)} ${sh(3.8, 19)}L${sh(6.6, 19)}C${sh(6.5, 16)} ${sh(6.6, 13)} ${sh(6.4, 10.5)}C${sh(6.3, 9)} ${sh(6.3, 8.2)} ${sh(6.2, 7.4)}`;
    const pons = `M${sh(2.2, 9.6)}C${sh(3.6, 9.2)} ${sh(5.2, 9.3)} ${sh(6.4, 9.8)}M${sh(2.6, 13.2)}C${sh(3.8, 12.8)} ${sh(5.4, 12.9)} ${sh(6.5, 13.3)}`;
    const callosum = `M${sh(-8.5, 0.4)}C${sh(-6, -4.2)} ${sh(6, -4.8)} ${sh(9, -0.2)}C${sh(6, -2.4)} ${sh(-5, -1.6)} ${sh(-8.5, 0.4)}Z`;
    let gyri = "";
    const wig = (u0, v0, u1, v1, amp, n) => {
      let d = `M${sh(u0, v0)}`;
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        const u = u0 + (u1 - u0) * t, v = v0 + (v1 - v0) * t;
        d += `Q${sh(u - (u1 - u0) / n / 2, v + (i % 2 ? amp : -amp))} ${sh(u, v)}`;
      }
      return d;
    };
    // Folds: wavy arcs nested inside the outline, the way a plate engraver fills the cortex.
    const arcWave = (f, a0, a1, amp, n, cu = 0.5, cv = -2.5) => {
      let d = "";
      const N = n * 8;
      for (let i = 0; i <= N; i++) {
        const t = a0 + ((a1 - a0) * i) / N;
        const wave = 1 + (amp / 10) * Math.sin((i * Math.PI) / 4);
        const u = cu + Math.cos(t) * 14.5 * f * wave;
        const v = cv + Math.sin(t) * 9.6 * f * wave;
        d += (i ? "L" : "M") + sh(u, v);
      }
      return d;
    };
    for (const [f, a0, a1, amp, n] of [[0.88, 3.25, 6.2, 0.9, 9], [0.74, 3.35, 6.1, 1.1, 8], [0.6, 3.5, 5.9, 1.3, 6], [0.92, 2.55, 3.05, 1, 2], [0.78, 0.25, 0.75, 1, 2]]) gyri += arcWave(f, a0, a1, amp, n);
    gyri += wig(-12, 3.6, -2, 5.2, 1, 6) + wig(-11, 1, -4, 3, 0.8, 4);
    // The central sulcus down from the crown, and the lateral fissure along the temporal lobe.
    const sulci = `M${sh(1.2, -12.3)}C${sh(0.6, -9)} ${sh(0.2, -6.5)} ${sh(-0.6, -3.5)}M${sh(-13.5, 4)}C${sh(-9, 1.8)} ${sh(-4, 1.6)} ${sh(0.5, 3.2)}`;

    // Six leaders: each from a dot on its part to a two-line label in the margin, the line
    // ending where the label's rule begins.
    const leaders = [
      [-11.5, -6.5, -15, -9.5], [-7, 5.9, -15, 7.5], [-3, -1.8, -15, -2.2],
      [12.5, 9, 15, 12], [5.2, 15, 15, 16.5], [11.5, -7, 15, -9.5],
    ];
    let lead = "", rules = "";
    const marks = [];
    for (const [u, v, lu, lv] of leaders) {
      lead += `M${sh(u, v)}L${sh(lu, lv)}`;
      const dir = lu < 0 ? -1 : 1;
      rules += `M${sh(lu, lv)}L${sh(lu + dir * 1.5, lv)}M${sh(lu, lv + 0.8)}L${sh(lu + dir * 1, lv + 0.8)}`;
      marks.push([u, v]);
    }
    const dot = (u, v) => `<circle cx="${u.toFixed(2)}" cy="${(-cz + v).toFixed(2)}" r="0.42"/>`;
    const title = `M${sh(-6, -19.6)}L${sh(6, -19.6)}M${sh(-9.5, -18.2)}L${sh(9.5, -18.2)}`;
    const caption = `M${sh(-13, 21.6)}L${sh(13, 21.6)}M${sh(-13, 22.9)}L${sh(11, 22.9)}M${sh(-13, 24.2)}L${sh(4, 24.2)}M${sh(9, 26)}L${sh(13, 26)}`;
    // The glass: two faint glints across the upper corner.
    const glint = `M${sh(-16.5, -16)}L${sh(-8.5, -24)}M${sh(-16.5, -12.5)}L${sh(-6, -23)}`;
    out.push(`<g transform="${T}">` +
      `<path class="m-brain" d="${cerebrum}"/>` + `<path class="m-brain-dark" d="${cerebellum}"/>` + `<path class="m-brain" d="${stem}"/>` + `<path class="m-brain-dark" d="${callosum}"/>` +
      g(gyri, "lo") + g(sulci, "mid") + g(folia, "lo") + g(cerebrum, "hi") + g(cerebellum, "mid") + g(stem, "mid") + g(pons, "lo") + g(callosum, "mid") +
      g(lead, "lo") + `<g class="iso-dots" data-tone="hi">${marks.map(([u, v]) => dot(u, v)).join("")}</g>` +
      g(rules, "lo", 'data-free="true"') + g(title, "mid", 'data-free="true"') + g(caption, "lo", 'data-free="true"') + g(glint, "faint", 'data-free="true"') +
      `</g>`);

    // The frame: four dark rails standing proud, mitred at the corners, the near one last.
    const rail = (ya, za, yb, zb) => `<g class="m-wood-dark">${box(D, ya, za, D + RAIL, yb, zb, { r: 0.25, steps: 2, bevel: 0.35, ...solid })}</g>`;
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
