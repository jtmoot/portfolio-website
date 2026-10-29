/**
 * An open hardback lying on the desk, seen from the front and a little above: the source drawing
 * for the "my shelf" sticker (the halftone prints it in dots, like Garvit's book). Pages are kept
 * just off white so the die-cut keeps them.
 */
const W = 260;
const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const mirror = (pts) => pts.map(([x, y]) => [W - x, y]);
const d = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");

// Left page: top edge arcs up from the outer corner and dips into the spine; the bottom edge sags.
const TOP = [[30, 34], [66, 14], [108, 22], [130, 50]];
const BOT = [[16, 118], [56, 112], [104, 124], [130, 148]];
const edge = (c, n = 28) => Array.from({ length: n + 1 }, (_, i) => cubic(...c, i / n));
const top = edge(TOP);
const bot = edge(BOT);
const leftPage = [...top, ...[...bot].reverse()];

/** Lines of type, each one a blend of the top and bottom edges, broken into words. */
function typeLines(side) {
  const out = [];
  const rows = 13;
  for (let r = 0; r < rows; r++) {
    const v = 0.1 + (r / (rows - 1)) * 0.8;
    let seed = (r + 1) * (side === "l" ? 7 : 13);
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    let t = 0.1;
    const end = r === rows - 1 || r === 5 ? 0.55 : 0.88; // short lines end paragraphs
    while (t < end) {
      const len = 0.04 + rand() * 0.09;
      const t2 = Math.min(end, t + len);
      const seg = [];
      for (let k = 0; k <= 4; k++) {
        const tt = t + ((t2 - t) * k) / 4;
        const a = cubic(...TOP, tt);
        const b = cubic(...BOT, tt);
        seg.push([a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v]);
      }
      out.push(side === "l" ? seg : mirror(seg));
      t = t2 + 0.018;
    }
  }
  return out;
}

// The page block's thickness, seen along the bottom edge: stacked page edges.
const stack = (n) =>
  Array.from({ length: n }, (_, i) => {
    const o = 1.2 + i * 1.3;
    return bot.map(([x, y], k) => [x - (1 - k / bot.length) * o * 0.5, y + o * (0.55 + 0.45 * (k / bot.length))]);
  });

export default function OpenBook() {
  const lines = [...typeLines("l"), ...typeLines("r")];
  const edges = stack(5);
  const blockL = [...bot, ...[...edges.at(-1)].reverse()];
  return (
    <svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ob-l" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#d6d1c4" />
          <stop offset="0.55" stopColor="#c4beb0" />
          <stop offset="0.85" stopColor="#9c968a" />
          <stop offset="1" stopColor="#4e4b45" />
        </linearGradient>
        <linearGradient id="ob-r" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#cdc8bb" />
          <stop offset="0.55" stopColor="#bab4a6" />
          <stop offset="0.85" stopColor="#918b80" />
          <stop offset="1" stopColor="#46433e" />
        </linearGradient>
      </defs>
      {/* Hard covers, splayed under the pages, with their board thickness. */}
      <path d="M3,124 L18,26 L130,44 L242,26 L257,124 L130,163 Z" fill="#262523" />
      <path d="M3,124 L130,163 L257,124 L257,133 L130,173 L3,133 Z" fill="#141413" />
      {/* The page block's edges. */}
      <path d={d(blockL) + "Z"} fill="#bdb8ac" />
      <path d={d(mirror(blockL)) + "Z"} fill="#b3aea2" />
      {edges.map((e, i) => (
        <g key={i} fill="none" stroke="#7d796f" strokeWidth="0.6">
          <path d={d(e)} />
          <path d={d(mirror(e))} />
        </g>
      ))}
      {/* The two open pages. */}
      <path d={d(leftPage) + "Z"} fill="url(#ob-l)" stroke="#55524b" strokeWidth="0.8" />
      <path d={d(mirror(leftPage)) + "Z"} fill="url(#ob-r)" stroke="#55524b" strokeWidth="0.8" />
      {lines.map((seg, i) => (
        <path key={i} d={d(seg)} fill="none" stroke="#5f5b53" strokeWidth="1.6" strokeLinecap="round" />
      ))}
      {/* A page lifting on the right as if just turned. */}
      <path d="M130,50 C150,30 176,14 214,18 C206,50 204,90 214,120 C180,112 150,124 130,148 Z" fill="#d3cec2" stroke="#3f3d38" strokeWidth="0.8" />
      {/* Spine gutter and a ribbon bookmark. */}
      <path d="M130,50 L130,148" stroke="#3b3934" strokeWidth="1.6" />
      <path d="M131,146 C134,156 132,166 138,176 L143,174 C137,164 139,154 135,145 Z" fill="#3a3834" />
    </svg>
  );
}
