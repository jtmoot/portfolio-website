// Joshua's short library: a waist-high, three-shelf bookcase against the back wall, left of the desk.
// Local world: wall plane x = 0, case spans y in [-45, 45], front face at x = 33. Centimetres.
import { station, k, G } from "./lib.mjs";

const Y0 = -45, Y1 = 45, D = 33, H = 92;
const T = 1.8; // board thickness
const SHELVES = [7, 36, 64]; // top surface of each shelf board
const MATS = ["m-b1", "m-b2", "m-b3", "m-b4", "m-b5", "m-b2", "m-b3", "m-b1"];

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export default station("library", {
  label: "Joshua's short library: a three-shelf bookcase of books, some leaning and some stacked flat, with his current reading stack on top.",
  bounds: [[0, Y0 - 2, 0], [0, Y1 + 2, 0], [D + 4, Y0 - 2, 0], [D + 4, Y1 + 2, 0], [0, Y0, H + 30], [0, Y1, H + 30], [D, Y1, H + 14]],
  draw(c) {
    const { box, S, L, D: dots, at, halo, prism, frame } = c;
    const out = [];
    out.push(halo({ x: 1, y: Y0, w: D, d: Y1 - Y0, r: 2 }, 0, 4));
    const wood = (svg) => `<g class="m-wood-pale">${svg}</g>`;
    // Back panel and the far (right) side.
    out.push(wood(box(0.5, Y0, 0, 1.5, Y1, H, { r: 0.1, steps: 1, tone: "hi", crease: "lo" })));
    out.push(wood(box(1.5, Y0, 0, D, Y0 + T, H, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })));
    // Plinth.
    out.push(wood(box(3, Y0 + T, 0, D - 1.5, Y1 - T, SHELVES[0] - T, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })));

    const rand = rng(7);
    const spineTicks = (x, y0, y1, z0, z1) => {
      // Title ticks and two bands across the spine (on the front face x).
      const mid = (y0 + y1) / 2;
      const w = (y1 - y0) * 0.5;
      const t = (z) => k.pathOf([at([x, mid - w / 2, z]), at([x, mid + w / 2, z])]);
      const bands = t(z1 - 2.2) + t(z0 + 2.2);
      const title = k.pathOf([at([x, mid, z0 + (z1 - z0) * 0.35]), at([x, mid, z0 + (z1 - z0) * 0.72])]);
      return L(bands, { tone: "lo" }) + L(title, { tone: "lo", free: true });
    };
    const book = (y0, y1, z0, h, depth, mat) => {
      const x1 = D - 2.5 - rand() * 2.5;
      const x0 = Math.max(3, x1 - depth);
      return `<g class="${mat}">${box(x0, y0, z0, x1, y1, z0 + h, { r: 0.25, steps: 2, tone: "hi", crease: "lo" })}</g>` + spineTicks(x1, y0, y1, z0, z0 + h);
    };
    const leaning = (yBase, z0, h, thick, depth, mat, lean) => {
      // A book tipped about the x axis, its lower corner on the shelf at yBase, leaning toward -y.
      const a = (lean * Math.PI) / 180;
      const dirUp = [-Math.sin(a), Math.cos(a)];
      const dirT = [Math.cos(a), Math.sin(a)];
      const poly = [[0, 0], [dirT[0] * thick, dirT[1] * thick], [dirT[0] * thick + dirUp[0] * h, dirT[1] * thick + dirUp[1] * h], [dirUp[0] * h, dirUp[1] * h]];
      const x1 = D - 3;
      const F = frame([x1 - depth, yBase, z0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
      return `<g class="${mat}">${prism(F, poly, 0, depth, { tone: "hi", crease: "lo" })}</g>`;
    };

    SHELVES.forEach((zs, i) => {
      const shelf = [];
      // The shelf board.
      shelf.push(wood(box(1.5, Y0 + T, zs - T, D, Y1 - T, zs, { r: 0.2, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })));
      // Books along the shelf from the far end (-y) toward the near end (+y).
      let y = Y0 + T + 0.4;
      const clear = (i < 2 ? SHELVES[i + 1] - T : H - T) - zs;
      const end = Y1 - T - 0.4;
      let n = 0;
      while (y < end - 2) {
        const r = rand();
        if (i === 1 && n === 7) {
          // A flat stack in the middle of the second shelf.
          let z = zs;
          for (let s = 0; s < 4; s++) {
            const th = 2.4 + rand() * 1.6;
            const len = 20 + rand() * 4;
            shelf.push(`<g class="${MATS[(s + 3) % MATS.length]}">${box(D - 3 - 22 + s * 0.6, y + s * 0.4, z, D - 3 + s * 0.3 - 0.8, y + len - s * 0.5, z + th, { r: 0.25, steps: 2, tone: "hi", crease: "lo" })}</g>`);
            z += th;
          }
          y += 25;
          n++;
          continue;
        }
        const thick = 1.8 + r * 3.4;
        if (y + thick > end) break;
        const h = Math.min(clear - 3, 17 + rand() * 11);
        shelf.push(book(y, y + thick, zs, h, 14 + rand() * 7, MATS[(n * 3 + i) % MATS.length]));
        y += thick + (rand() < 0.15 ? 0.6 : 0.05);
        n++;
        if (i === 0 && n === 9) y += 4;
      }
      if (i === 0) shelf.push(leaning(y - 2.2, zs, Math.min(clear - 4, 24), 2.6, 17, "m-b4", 14));
      out.push(shelf.join(""));
    });
    // Near (left) side and the top board.
    out.push(wood(box(1.5, Y1 - T, 0, D, Y1, H, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })));
    out.push(wood(box(0.5, Y0 - 0.6, H, D + 0.8, Y1 + 0.6, H + 2.2, { r: 0.5, steps: 3, bevel: 0.4, tone: "hi", crease: "lo" })));
    // Top: an upright bookend with five books, and the current reading stack lying flat.
    const top = H + 2.2;
    const tops = [];
    tops.push(`<g class="m-steel-dark">${box(6, -40, top, 24, -39.4, top + 14, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}${box(6, -40, top, 24, -33, top + 0.5, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    let y = -39.2;
    for (let i = 0; i < 5; i++) {
      const th = 2.2 + rand() * 2;
      tops.push(book(y, y + th, top, 18 + rand() * 6, 15 + rand() * 4, MATS[(i + 2) % MATS.length]));
      y += th + 0.05;
    }
    let z = top;
    const stack = [[24, 17, "m-b5"], [22, 15.5, "m-b3"], [21, 14, "m-b1"]];
    stack.forEach(([len, dep, m], i) => {
      const th = 2.6 + i * 0.4;
      tops.push(`<g class="${m}">${box(9 + i * 0.8, 14 - i * 0.6, z, 9 + i * 0.8 + dep, 14 - i * 0.6 + len, z + th, { r: 0.3, steps: 2, tone: "hi", crease: "lo" })}</g>`);
      // Page edges on the visible long side.
      tops.push(L(k.pathOf([at([9 + i * 0.8 + 1, 14 - i * 0.6 + len, z + th / 2]), at([9 + i * 0.8 + dep - 1, 14 - i * 0.6 + len, z + th / 2])]), { tone: "faint" }));
      z += th;
    });
    // A pencil on top of the stack.
    tops.push(c.tube([[15, 20, z + 0.5], [21, 33, z + 0.5]], 0.45, { tone: "mid" }));
    out.push(tops.join(""));
    dots && out.push("");
    return out.join("");
  },
});
