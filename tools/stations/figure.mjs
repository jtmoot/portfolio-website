// Joshua as a walking figure, drawn with the kit in the room's projection and scale.
// Output: one sprite sheet of 20 <symbol>s, f-{dl|dr|ul|ur}-{idle|w1|w2|w3|w4}, sharing one viewBox
// whose anchor (meta) is the point between his feet.
import { k, G, CAM, SCALE, context } from "./lib.mjs";

const H = 182; // cm
const FACINGS = {
  dr: [1, 0], // screen down-right = kit +x
  dl: [0, 1], // screen down-left = kit +y
  ur: [0, -1],
  ul: [-1, 0],
};
const FRAMES = { idle: 0, w1: 1, w2: 0.35, w3: -1, w4: -0.35 };
const BOUNDS = [[-40, -40, 0], [40, -40, 0], [-40, 40, 0], [40, 40, 0], [-40, -40, H + 6], [40, -40, H + 6], [-40, 40, H + 6], [40, 40, H + 6]];
const PAD = 2;

function projection() {
  const P0 = { origin: [0, 0], scale: SCALE, ...CAM };
  const flat = BOUNDS.map((p) => k.iso(p, P0));
  const minX = Math.min(...flat.map((p) => p[0]));
  const maxX = Math.max(...flat.map((p) => p[0]));
  const minY = Math.min(...flat.map((p) => p[1]));
  const maxY = Math.max(...flat.map((p) => p[1]));
  const P = { ...P0, origin: [PAD - minX, PAD - minY] };
  return { P, width: Math.round((maxX - minX + PAD * 2) * 100) / 100, height: Math.round((maxY - minY + PAD * 2) * 100) / 100 };
}

function person(c, facing, swing) {
  const { P, S, L, D, at } = c;
  const [fx, fy] = FACINGS[facing];
  const f = [fx, fy, 0];
  const s = [-fy, fx, 0]; // his left
  const V = G.viewOf(P);
  const pt = (along, side, z) => [f[0] * along + s[0] * side, f[1] * along + s[1] * side, z];
  const items = [];
  const put = (centre, svg) => items.push({ d: G.dot3(centre, V), svg });
  const stride = 20 * swing;

  // Shadow.
  items.push({ d: -1e9, svg: `<path class="iso-halo" d="${k.haloOf({ x: -14, y: -14, w: 28, d: 28, r: 14 }, 0, 2, P)}"/>` });

  for (const side of [1, -1]) {
    const reach = side * stride; // left leg forward when swing > 0
    const hip = pt(0, side * 8.5, 92);
    const ankle = pt(reach, side * 8.5, 9);
    // Leg (joggers), tapering to the cuff.
    put(G.lerp3(hip, ankle, 0.5), `<g class="fm-pants">${c.tube([hip, G.lerp3(hip, ankle, 0.55), ankle], 6.2, { tone: "hi", spacing: 7 })}</g>`);
    // Shoe: a white foam midsole with a dark outsole and a grey knit upper (Novablast).
    const heel = pt(reach - 8, side * 8.5, 0);
    const F = G.frameOf(heel, s, f, [0, 0, 1]);
    const sole = [[0, 0], [28, 0], [30, 1.4], [29, 3.6], [0, 4.6]];
    const upper = [[1, 4.4], [27, 3.6], [28, 5.5], [22, 8.5], [6, 10.5], [1.5, 9.5]];
    const shoe =
      `<g class="fm-dark">${S(G.prismOf(F, [[0.5, 0], [28, 0], [29.5, 1]], -4.6, 4.6, P), { tone: "hi", crease: "lo" })}</g>` +
      `<g class="fm-foam">${S(G.prismOf(F, sole, -5, 5, P), { tone: "hi", crease: "lo" })}</g>` +
      `<g class="fm-knit">${S(G.prismOf(F, upper, -4.2, 4.2, P), { tone: "hi", crease: "lo" })}</g>`;
    put(G.add3(heel, G.mul3(f, 14)), shoe);
  }

  // Torso: a rounded hoodie block, a shoulder cap, the hood at the back, a pocket at the front.
  const along = (a, b) => (fx !== 0 ? { x: Math.min(a, b) * fx >= 0 ? Math.min(a, b) : -Math.max(a, b), w: Math.abs(b - a) } : null);
  void along;
  const box = (fa, fb, sa, sb) => {
    // Rectangle in (forward, side) coordinates, as a plan in kit floor coordinates.
    const xs = [f[0] * fa + s[0] * sa, f[0] * fb + s[0] * sb];
    const ys = [f[1] * fa + s[1] * sa, f[1] * fb + s[1] * sb];
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.abs(xs[1] - xs[0]), d: Math.abs(ys[1] - ys[0]) };
  };
  const torsoPlan = { ...box(-11.5, 11.5, -18, 18), r: 8 };
  const torso =
    `<g class="fm-hoodie">${S(k.slabOf(torsoPlan, 88, 54, P, 8, 0.6), { tone: "hi", crease: "lo", inner: L(k.sideSeam(torsoPlan, 92, P, 8), { tone: "lo" }) })}` +
    S(k.slabOf({ ...box(-10, 9, -16, 16), r: 8 }, 142, 6, P, 8), { tone: "hi", crease: "lo" }) + `</g>`;
  put([0, 0, 120], torso);
  // Hood, a soft roll at the back of the neck.
  const hoodC = pt(-8, 0, 148);
  put(hoodC, `<g class="fm-hoodie">${S(G.sphereOf(hoodC, 7.5, P, { steps: 20 }), { tone: "hi", crease: "lo" })}</g>`);
  // Pocket and drawstrings, on the front face, only when he faces us.
  if (facing === "dr" || facing === "dl") {
    const fz = 11.6;
    const pocket = [pt(fz, -10, 96), pt(fz, 10, 96), pt(fz, 8, 110), pt(fz, -8, 110)];
    const strings = k.pathOf([at(pt(fz, -3, 146)), at(pt(fz, -3.4, 131))]) + k.pathOf([at(pt(fz, 3, 146)), at(pt(fz, 3.4, 131))]);
    put(pt(12, 0, 120), L(k.pathOf(pocket.map(at), true), { tone: "lo" }) + L(strings, { tone: "faint", free: "end" }) +
      D([at(pt(fz, -3.4, 130.5)), at(pt(fz, 3.4, 130.5))], { size: 0.6, tone: "mid" }));
  }

  // Arms swing against the legs.
  for (const side of [1, -1]) {
    const reach = -side * stride * 0.8;
    const shoulder = pt(0, side * 20, 143);
    const elbow = pt(reach * 0.5, side * 21.5, 118);
    const hand = pt(reach, side * 21, 95);
    put(G.lerp3(shoulder, hand, 0.5), `<g class="fm-hoodie">${c.tube([shoulder, elbow, hand], 4.6, { tone: "hi", spacing: 7 })}</g>`);
    put(hand, `<g class="fm-skin">${S(G.sphereOf(hand, 4.2, P, { steps: 14 }), { tone: "hi", crease: "lo" })}</g>`);
  }

  // Neck, head, hair, face.
  put(pt(0, 0, 152), `<g class="fm-skin">${c.cyl(0, 0, 4.6, 147, 158, { steps: 18, tone: "hi", crease: "lo" })}</g>`);
  const head = pt(0.5, 0, 168);
  put(head, `<g class="fm-skin">${S(G.sphereOf(head, 11.5, P, { steps: 28 }), { tone: "hi", crease: "lo" })}</g>`);
  // Hair: one sphere set back and up from the head, so the face shows below a hairline.
  const hair = pt(-3.2, 0, 171.5);
  put(hair, `<g class="fm-hair">${S(G.sphereOf(hair, 11.3, P, { steps: 28 }), { tone: "hi", crease: "lo" })}</g>`);
  if (facing === "dr" || facing === "dl") {
    const eye = (side) => at(pt(11.2, side * 4.2, 168.5));
    const brow = (side) => k.pathOf([at(pt(11.0, side * 2.4, 171.8)), at(pt(10.6, side * 6.2, 172.2))]);
    put(pt(14, 0, 168), D([eye(1), eye(-1)], { size: 0.85, tone: "hi" }) + L(brow(1) + brow(-1), { tone: "hi" }) +
      L(k.pathOf([at(pt(11.4, -2, 162.6)), at(pt(11.6, 0, 162.2)), at(pt(11.4, 2, 162.6))]), { tone: "mid" }));
  }
  return items.sort((a, b) => a.d - b.d).map((i) => i.svg).join("");
}

export default {
  render() {
    const { P, width, height } = projection();
    const symbols = [];
    for (const facing of Object.keys(FACINGS)) {
      for (const [name, swing] of Object.entries(FRAMES)) {
        const c = context(P, `fig-${facing}-${name}`);
        symbols.push(`<symbol id="f-${facing}-${name}" viewBox="0 0 ${width} ${height}">${person(c, facing, swing)}</symbol>`);
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="figure-sheet" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">${symbols.join("")}</svg>`;
    return { svg, meta: { width, height, anchor: [Math.round(P.origin[0] * 100) / 100, Math.round(P.origin[1] * 100) / 100] } };
  },
};
