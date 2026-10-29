// A framed anatomy chart on the back wall: a brain in sagittal section in the manner of a
// Gray's plate, with leader lines to label rules and a caption rule. Local world: wall plane x = 0.
import { station, k } from "./lib.mjs";

const W = 46, H = 62, Z0 = 122, D = 2.4, FR = 2.6;

export default station("anatomy", {
  label: "A framed anatomy chart of the brain in sagittal section, with labelled parts, in the style of an old engraved plate.",
  bounds: [[0, -W / 2 - 1, Z0 - 1], [0, W / 2 + 1, Z0 - 1], [D + 1, -W / 2 - 1, Z0 - 1], [0, -W / 2, Z0 + H + 1], [0, W / 2, Z0 + H + 1], [D + 1, W / 2 + 1, Z0 + H]],
  pad: 4,
  draw(c) {
    const { box, at } = c;
    const out = [];
    const y0 = -W / 2, y1 = W / 2, z1 = Z0 + H;
    out.push(`<g class="m-wood-dark">${box(0, y0, Z0, D, y1, z1, { r: 0.3, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })}</g>`);
    const X = D + 0.02;
    const paper = [[X, y1 - FR, Z0 + FR], [X, y0 + FR, Z0 + FR], [X, y0 + FR, z1 - FR], [X, y1 - FR, z1 - FR]];
    out.push(`<path class="m-plate-paper" d="${k.pathOf(paper.map(at), true)}"/>`);
    out.push(`<path class="iso-line" data-tone="lo" d="${k.pathOf(paper.map(at), true)}"/>`);
    // Plate drawing in the wall plane: u along -y (screen right on this wall), v down.
    const cz = Z0 + H * 0.56;
    const T = c.planeX(X + 0.04);
    const g = (d, tone = "mid", extra = "") => `<path class="iso-line" data-tone="${tone}" ${extra} d="${d}"/>`;
    const sh = (u, v) => `${(u).toFixed(2)} ${(-(cz) + v).toFixed(2)}`;
    // Cerebrum outline (frontal lobe toward -u), temporal underside, occipital pole.
    const cerebrum = `M${sh(-15, 2)}C${sh(-16, -7)} ${sh(-9, -12.5)} ${sh(0, -12.5)}C${sh(9, -12.5)} ${sh(16, -7)} ${sh(16, 0.5)}C${sh(16, 4)} ${sh(13.5, 6)} ${sh(10.5, 5.8)}C${sh(8, 5.6)} ${sh(5.5, 7.6)} ${sh(2, 7)}C${sh(-1.5, 6.4)} ${sh(-5, 8.2)} ${sh(-9, 7)}C${sh(-12.5, 6)} ${sh(-15, 5.2)} ${sh(-15, 2)}Z`;
    const cerebellum = `M${sh(6, 6.6)}C${sh(8, 5.2)} ${sh(14, 5.4)} ${sh(15, 8.2)}C${sh(15.6, 10.6)} ${sh(12, 12.2)} ${sh(8.6, 11.4)}C${sh(6.4, 10.8)} ${sh(5.4, 8.6)} ${sh(6, 6.6)}Z`;
    let folia = "";
    for (let i = 1; i <= 4; i++) folia += `M${sh(6.6 + i * 0.4, 7 + i * 0.9)}C${sh(9, 6 + i * 0.9)} ${sh(13, 6.4 + i * 0.9)} ${sh(14.6, 8 + i * 0.7)}`;
    const stem = `M${sh(2.4, 7)}C${sh(2.6, 11)} ${sh(3.2, 15)} ${sh(3.8, 19)}L${sh(6.6, 19)}C${sh(6.4, 15)} ${sh(6.4, 11)} ${sh(6.2, 7.4)}`;
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
        const wave = 1 + (amp / 10) * Math.sin(i * Math.PI / 4);
        const u = cu + Math.cos(t) * 14.5 * f * wave;
        const v = cv + Math.sin(t) * 9.6 * f * wave;
        d += (i ? "L" : "M") + sh(u, v);
      }
      return d;
    };
    for (const [f, a0, a1, amp, n] of [[0.88, 3.25, 6.2, 0.9, 9], [0.74, 3.35, 6.1, 1.1, 8], [0.6, 3.5, 5.9, 1.3, 6], [0.92, 2.55, 3.05, 1, 2], [0.78, 0.25, 0.75, 1, 2]]) gyri += arcWave(f, a0, a1, amp, n);
    gyri += wig(-12, 3.6, -2, 5.2, 1, 6) + wig(-11, 1, -4, 3, 0.8, 4);
    // Leader lines to label rules in the left and right margins.
    const leaders = [
      [-11, -6, -16.5, -10], [-6, 5.5, -16.5, 7], [-4, -1, -16.5, -2],
      [12, 9, 16.5, 12], [4.8, 15, 16.5, 16], [11, -6, 16.5, -9],
    ];
    let lead = "", rules = "";
    for (const [u, v, lu, lv] of leaders) {
      lead += `M${sh(u, v)}L${sh(lu, lv)}`;
      const dir = lu < 0 ? -1 : 1;
      rules += `M${sh(lu, lv)}L${sh(lu + dir * 1.6, lv)}`;
    }
    const caption = `M${sh(-14, 21.5)}L${sh(14, 21.5)}M${sh(-10, 23.5)}L${sh(10, 23.5)}`;
    const title = `M${sh(-8, -19)}L${sh(8, -19)}`;
    out.push(`<g transform="${T}">` +
      `<path class="m-brain" d="${cerebrum}"/>` + `<path class="m-brain-dark" d="${cerebellum}"/>` + `<path class="m-brain" d="${stem}"/>` + `<path class="m-brain-dark" d="${callosum}"/>` +
      g(gyri, "lo") + g(folia, "lo") + g(cerebrum, "hi") + g(cerebellum, "mid") + g(stem, "mid") + g(callosum, "mid") +
      g(lead, "lo") + g(rules, "lo", 'data-free="true"') + g(caption, "lo", 'data-free="true"') + g(title, "mid", 'data-free="true"') +
      
      `</g>`);
    return out.join("");
  },
});
