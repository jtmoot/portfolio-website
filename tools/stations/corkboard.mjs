// A corkboard on the back wall holding Joshua's four posters (history, tech, philosophy, finance)
// as pinned sheets, each a small drawing standing in for the real print.
// Local world: wall plane x = 0, board centred on y = 0. Centimetres.
import { station, k } from "./lib.mjs";

const W = 72, H = 50, Z0 = 112;
const FR = 2.4; // frame width
const D = 2.2; // board depth

export default station("corkboard", {
  label: "A corkboard with four pinned sheets: a map for history, a circuit for tech, a bust for philosophy and a chart for finance.",
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

    // Sheets: drawn in the wall plane with (u along -y, v up) coordinates, centred on (u, v).
    const T = c.planeX(X + 0.05);
    const sheet = (u, v, w, h, rot, content, pin) => {
      const rad = (rot * Math.PI) / 180;
      const pt = (a, b) => [u + a * Math.cos(rad) - b * Math.sin(rad), -(v + a * Math.sin(rad) + b * Math.cos(rad))];
      const corners = [pt(-w / 2, -h / 2), pt(w / 2, -h / 2), pt(w / 2, h / 2 - 3), pt(w / 2 - 3, h / 2), pt(-w / 2, h / 2)];
      const fold = [pt(w / 2, h / 2 - 3), pt(w / 2 - 3, h / 2), pt(w / 2 - 2.6, h / 2 - 2.6)];
      const P2 = (pts, closed = true) => "M" + pts.map((p) => p.map((n) => n.toFixed(2)).join(" ")).join("L") + (closed ? "Z" : "");
      const inner = content((a, b) => pt(a, b), P2);
      const pinAt = pt(0, h / 2 - 1.6);
      return `<g transform="${T}"><path class="m-sheet-shadow" d="${P2(corners)}" transform="translate(0.5 0.7)"/><path class="m-sheet" d="${P2(corners)}"/><path class="m-sheet-fold" d="${P2(fold)}"/>${inner}<path class="iso-line" data-tone="lo" d="${P2(corners)}"/><circle class="m-pin-${pin}" cx="${pinAt[0].toFixed(2)}" cy="${pinAt[1].toFixed(2)}" r="0.9"/></g>`;
    };
    const line = (d, tone = "lo") => `<path class="iso-line" data-tone="${tone}" data-free="true" d="${d}"/>`;
    // History: a coastline map with a dotted route.
    const map = (p, P2) => {
      const coast = [];
      for (let i = 0; i <= 24; i++) { const a = -6 + i * 0.5; coast.push(p(a, -3 + Math.sin(i * 0.9) * 2 + Math.cos(i * 0.37) * 2.5)); }
      const route = [p(-5, 4), p(-2, 2), p(1, 3.5), p(4, 1)];
      return line(P2(coast, false), "mid") + `<path class="iso-line" data-tone="hi" data-dotted="true" data-free="true" d="${P2(route, false)}"/>` + line(P2([p(-6, 7), p(2, 7)], false));
    };
    // Tech: a chip with pins and traces.
    const chip = (p, P2) => {
      let d = P2([p(-3, -3), p(3, -3), p(3, 3), p(-3, 3)]);
      let pins = "";
      for (let i = -2; i <= 2; i += 1) pins += P2([p(i, 3), p(i, 4.4)], false) + P2([p(i, -3), p(i, -4.4)], false) + P2([p(3, i), p(4.4, i)], false) + P2([p(-3, i), p(-4.4, i)], false);
      const traces = P2([p(4.4, 1), p(6, 1), p(6, 6)], false) + P2([p(-4.4, -1), p(-6, -1), p(-6, -6)], false);
      return line(d, "mid") + line(pins) + line(traces, "faint");
    };
    // Philosophy: a classical bust in profile.
    const bust = (p, P2) => {
      const prof = [p(1.5, -6), p(1.8, -3), p(3.2, -1.6), p(2.6, -0.6), p(3, 0.4), p(2.6, 1.4), p(3.4, 2.6), p(2.4, 3.6), p(2.6, 5.4), p(0.4, 7.2), p(-2.6, 7), p(-4.2, 4.8), p(-4, 1.8), p(-2.6, -0.6), p(-3.6, -3.4), p(-3, -6), p(-5.4, -7), p(4.6, -7), p(1.5, -6)];
      return `<path class="m-bust" d="${P2(prof)}"/>` + line(P2(prof), "mid");
    };
    // Finance: candlesticks over a rising line.
    const candles = (p, P2) => {
      let d = "";
      const vals = [[-5, -2, 1, -4, 2], [-3, 0, 2, -1, 3], [-1, 1, -1, -2, 2.5], [1, -0.5, 2.5, -1.5, 4], [3, 2, 4, 1, 5.5], [5, 3.5, 5, 2.5, 6.5]];
      let bodies = "";
      for (const [x, o, cl, lo, hi] of vals) {
        d += P2([p(x, lo - 1), p(x, hi)], false);
        bodies += P2([p(x - 0.6, Math.min(o, cl)), p(x + 0.6, Math.min(o, cl)), p(x + 0.6, Math.max(o, cl)), p(x - 0.6, Math.max(o, cl))]);
      }
      return line(d) + `<path class="m-candle" d="${bodies}"/>` + line(P2([p(-6.5, -6), p(6.5, -6)], false), "faint");
    };
    const cu = (y) => -y; // wall u for a given world y
    out.push(sheet(cu(-22), Z0 + 30, 17, 22, -4, map, "a"));
    out.push(sheet(cu(-3), Z0 + 32, 15, 19, 3, chip, "b"));
    out.push(sheet(cu(15), Z0 + 29, 16, 21, -2, bust, "a"));
    out.push(sheet(cu(0), Z0 + 11, 22, 14, 2, candles, "c"));
    // An index card and a ticket stub.
    out.push(sheet(cu(-24), Z0 + 9, 13, 9, 6, (p, P2) => line(P2([p(-5, 1.5), p(4, 1.5)], false)) + line(P2([p(-5, -0.5), p(3, -0.5)], false)) + line(P2([p(-5, -2.5), p(1, -2.5)], false)), "b"));
    out.push(sheet(cu(24), Z0 + 10, 11, 6, -7, (p, P2) => `<path class="iso-line" data-tone="lo" data-dashed="true" data-free="true" d="${P2([p(2.5, -2.5), p(2.5, 2.5)], false)}"/>`, "c"));
    return out.join("");
  },
});
