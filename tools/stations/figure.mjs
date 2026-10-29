// Joshua as a walking figure, drawn with the kit in the room's projection and scale.
// Output: one sprite sheet of 20 <symbol>s, f-{dl|dr|ul|ur}-{idle|w1|w2|w3|w4}, sharing one viewBox
// whose anchor (meta) is the point between his feet.
import { k, G, CAM, SCALE, context } from "./lib.mjs";
import { ACTIONS } from "../../src/lib/figure.js";

const H = 183; // cm
const FACINGS = {
  dr: [1, 0], // screen down-right = kit +x
  dl: [0, 1], // screen down-left = kit +y
  ur: [0, -1],
  ul: [-1, 0],
};
const FRAMES = { idle: 0, w1: 1, w2: 0.35, w3: -1, w4: -0.35 };
const R = 56; // reach: room for a kettlebell swung out in front
const BOUNDS = [[-R, -R, 0], [R, -R, 0], [-R, R, 0], [R, R, 0], [-R, -R, H + 6], [R, -R, H + 6], [-R, R, H + 6], [R, R, H + 6]];
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

/** Where his arms go for a walk frame: they swing against the legs. */
function walkArms(stride) {
  const arm = (side) => {
    const reach = -side * stride * 0.8;
    return { elbow: [reach * 0.5, side * 22.5, 118], hand: [reach, side * 22, 96] };
  };
  return { L: arm(1), R: arm(-1) };
}

/**
 * Joshua, from his photos: 183 cm, broad square shoulders on a lean frame, a heather quarter-zip,
 * tapered joggers, Novablasts, a watch on a brown strap on his left wrist, and wavy dirty-blonde
 * hair, long on top with a loose middle part and a few pieces falling forward.
 * @param {object} c drawing context
 * @param {"dr" | "dl" | "ur" | "ul"} facing
 * @param {{ swing?: number, arms?: { L?: object, R?: object }, extras?: (h: object) => { at: number[], svg: string }[] }} pose
 *   arms: elbow and hand points in (forward, his-left, z) cm, overriding the walk swing per arm;
 *   extras: props he holds or touches, drawn in depth order with him
 */
function person(c, facing, pose = {}) {
  const { P, S, L, D, at } = c;
  const swing = pose.swing ?? 0;
  const [fx, fy] = FACINGS[facing];
  const f = [fx, fy, 0];
  const s = [-fy, fx, 0]; // his left
  const V = G.viewOf(P);
  const pt = (along, side, z) => [f[0] * along + s[0] * side, f[1] * along + s[1] * side, z];
  const ptv = (v) => pt(v[0], v[1], v[2]);
  const items = [];
  const put = (centre, svg) => items.push({ d: G.dot3(centre, V), svg });
  // Parts that never change between frames of one facing: drawn once into a shared body symbol.
  const body = (centre, svg) => items.push({ d: G.dot3(centre, V), svg, body: true });
  const stride = 20 * swing;
  const front = facing === "dr" || facing === "dl";

  // Shadow.
  items.push({ d: -1e9, svg: `<path class="iso-halo" d="${k.haloOf({ x: -15, y: -15, w: 30, d: 30, r: 15 }, 0, 2, P)}"/>` });

  // --- Legs: tapered joggers with a cuff, Novablasts -----------------------------------------------
  for (const side of [1, -1]) {
    const reach = side * stride;
    const hip = pt(0, side * 9, 94);
    const knee = pt(reach * 0.55 + 1.5, side * 8.6, 50);
    const ankle = pt(reach, side * 8.4, 11);
    put(G.lerp3(hip, knee, 0.5), `<g class="fm-jog">${c.tube([hip, knee], 7, { tone: "hi", spacing: 7 })}</g>`);
    put(G.lerp3(knee, ankle, 0.5), `<g class="fm-jog">${c.tube([knee, G.lerp3(knee, ankle, 0.85)], 5.6, { tone: "hi", spacing: 7 })}</g>`);
    put(G.lerp3(knee, ankle, 0.92), `<g class="fm-cuff">${c.tube([G.lerp3(knee, ankle, 0.85), ankle], 4.9, { tone: "hi", spacing: 7 })}</g>`);
    const heel = pt(reach - 8.5, side * 8.4, 0);
    const F = G.frameOf(heel, s, f, [0, 0, 1]);
    // Novablast: a deep, rockered foam stack under a knit upper.
    const sole = [[0, 0.6], [26, 0], [30, 1.8], [29.5, 4.4], [0, 5.8]];
    const upper = [[1, 5.6], [27.5, 4.2], [28.6, 6.2], [22, 9.4], [6, 11.6], [1.2, 10.8]];
    const shoe =
      `<g class="fm-dark">${S(G.prismOf(F, [[0.8, 0.6], [26, 0], [29.8, 1.6]], -4.8, 4.8, P), { tone: "hi", crease: "lo" })}</g>` +
      `<g class="fm-foam">${S(G.prismOf(F, sole, -5.2, 5.2, P), { tone: "hi", crease: "lo" })}</g>` +
      `<g class="fm-knit">${S(G.prismOf(F, upper, -4.4, 4.4, P), { tone: "hi", crease: "lo" })}</g>`;
    put(G.add3(heel, G.mul3(f, 14)), shoe);
  }

  // --- Torso: a V from narrow hips to broad square shoulders, in a quarter-zip --------------------
  const box = (fa, fb, sa, sb) => {
    const xs = [f[0] * fa + s[0] * sa, f[0] * fb + s[0] * sb];
    const ys = [f[1] * fa + s[1] * sa, f[1] * fb + s[1] * sb];
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.abs(xs[1] - xs[0]), d: Math.abs(ys[1] - ys[0]) };
  };
  const waist = { ...box(-10.5, 10.5, -16.5, 16.5), r: 8 };
  const chest = { ...box(-11.6, 11.6, -21.5, 21.5), r: 10 };
  const traps = { ...box(-9, 9, -16, 16), r: 8 };
  const torso =
    `<g class="fm-zip">` +
    S(k.slabOf(waist, 90, 18, P, 8, 0.6), { tone: "hi", crease: "lo", inner: L(k.sideSeam(waist, 93, P, 8), { tone: "lo" }) }) +
    S(k.slabOf(chest, 108, 38, P, 8, 1.2), { tone: "hi", crease: "lo" }) +
    S(k.slabOf(traps, 146, 3.5, P, 8, 1), { tone: "hi", crease: "lo" }) +
    `</g>`;
  body([0, 0, 120], torso);
  // The zip collar, standing up round the neck and a little open at the front.
  const collar = pt(0.5, 0, 149.5);
  body(G.add3(collar, [0, 0, 1]), `<g class="fm-zip">${c.cyl(collar[0], collar[1], 7.2, 149.5, 156.5, { steps: 22, tone: "hi", crease: "lo" })}</g>`);
  if (front) {
    const zip = k.pathOf([at(pt(7.7, 0, 156)), at(pt(7.7, 0, 149.6)), at(pt(9, 0, 149.5)), at(pt(11.6, 0, 146)), at(pt(11.65, 0, 125))]);
    const vee = k.pathOf([at(pt(6.9, -2.6, 156.5)), at(pt(7.7, 0, 153.2)), at(pt(6.9, 2.6, 156.5))]);
    const hem = k.pathOf([at(pt(10.6, -15, 93.2)), at(pt(10.6, 15, 93.2))]);
    body(pt(14, 0, 140), `<path class="fm-stitch" d="${zip}"/><path class="fm-stitch" d="${vee}"/><path class="fm-stitch fm-faint" d="${hem}"/>` +
      D([at(pt(11.4, 0.9, 145))], { size: 0.8, tone: "mid" }));
  }

  // --- Arms: round shoulder caps, sleeves, hands; the watch on his left wrist ---------------------
  const arms = walkArms(stride);
  for (const [key, side] of [["L", 1], ["R", -1]]) {
    const a = { ...arms[key], ...(pose.arms?.[key] || {}) };
    const shoulder = pt(0, side * 20, 141);
    const elbow = ptv(a.elbow);
    const hand = ptv(a.hand);
    const wrist = G.lerp3(elbow, hand, 0.86);
    put(G.lerp3(shoulder, elbow, 0.5), `<g class="fm-zip">${c.tube([shoulder, elbow], 5.2, { tone: "hi", spacing: 7 })}</g>`);
    put(G.lerp3(elbow, wrist, 0.5), `<g class="fm-zip">${c.tube([elbow, wrist], 4.5, { tone: "hi", spacing: 7 })}</g>`);
    if (side === 1) {
      const w0 = G.lerp3(elbow, hand, 0.78);
      put(G.lerp3(w0, wrist, 0.5), `<g class="fm-watch">${c.tube([w0, wrist], 4.7, { tone: "hi", spacing: 7, caps: false })}</g>` +
        `<g class="fm-silver">${S(G.sphereOf(G.add3(G.lerp3(w0, wrist, 0.5), G.mul3(s, 3.6)), 1.6, P, { steps: 6 }), { tone: "hi", crease: "lo" })}</g>`);
    }
    put(hand, `<g class="fm-skin">${S(G.sphereOf(hand, 4.3, P, { steps: 8 }), { tone: "hi", crease: "lo" })}</g>`);
  }

  // --- Neck, head, ears, face -----------------------------------------------------------------------
  body(pt(0, 0, 153), `<g class="fm-skin">${c.cyl(0, 0, 5, 150, 160, { steps: 18, tone: "hi", crease: "lo" })}</g>`);
  const head = pt(0.6, 0, 168);
  body(head, `<g class="fm-skin">${S(G.sphereOf(head, 10.8, P, { steps: 18 }), { tone: "hi", crease: "lo" })}</g>`);
  for (const side of [1, -1]) {
    const ear = pt(-0.5, side * 10.6, 167);
    body(ear, `<g class="fm-skin">${S(G.sphereOf(ear, 2.4, P, { steps: 6 }), { tone: "hi", crease: "lo" })}</g>`);
  }
  if (front) {
    const eye = (side) => at(pt(10.3, side * 3.9, 168.6));
    const brow = (side) => k.pathOf([at(pt(10.2, side * 2.2, 171.6)), at(pt(9.8, side * 6, 171.9))]);
    const smile = k.pathOf([at(pt(10.5, -2.8, 162.6)), at(pt(10.9, 0, 161.8)), at(pt(10.5, 2.8, 162.6))]);
    const nose = k.pathOf([at(pt(11.2, 0.4, 167.4)), at(pt(11.6, 0.2, 165.2)), at(pt(11.1, -0.6, 164.9))]);
    body(pt(14, 0, 168), D([eye(1), eye(-1)], { size: 0.8, tone: "hi" }) + L(brow(1) + brow(-1), { tone: "hi" }) +
      `<path class="fm-skinline" d="${smile}"/><path class="fm-skinline fm-faint" d="${nose}"/>`);
  }

  // --- Hair: one swept mass, not a pile of balls. The mass is the union of overlapping volumes:
  // every circle is drawn outlined underneath, then filled on top, so only the outer edge keeps its
  // line and the slightly wavy edge reads as tousled waves. A sunlit top, strands sweeping out from a
  // loose middle part, and two pieces falling forward on the forehead.
  const sk = G.scaleOf(P);
  const circle = (q, r, cls) => {
    const [cx, cy] = at(q);
    return `<circle class="${cls}" cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(r * sk).toFixed(2)}"/>`;
  };
  const VOL = [
    // crown and top, either side of the part
    [-6.5, 0, 181, 5.4], [2.2, 5.8, 181, 5], [-3.2, 6.8, 180.2, 5.2], [2, -6, 180.8, 5], [-3.4, -7, 180, 5.2],
    // the front: a hairline about 4 cm above the brows
    [6.6, 3.2, 179.6, 4], [6.4, -3.4, 179.4, 3.9], [8, 0.2, 179.8, 3.4],
    // sides: shorter, down over the tops of the ears
    [4.4, 8.6, 176.6, 3.4], [-2, 10, 173.6, 3.8], [-8, 6.3, 176, 5], [4.2, -8.7, 176.4, 3.3], [-2.4, -10.1, 173.4, 3.8], [-8.2, -6.2, 175.8, 5],
    // back of the head
    [-9.6, 0, 173, 5.8],
  ];
  if (!front) VOL.push([-7.6, 3.5, 166.5, 4.6], [-7.6, -3.5, 166.5, 4.6], [-8.6, 0, 168, 5.2]);
  const SUN = VOL.filter((v) => v[3] >= 3.9 && v[2] >= 179).map(([a2, sd, z, r]) => [a2 * 0.9, sd * 0.85, z + 1.4, r * 0.6]);
  const strands = [];
  for (const sd of [1, -1]) {
    for (const [a0, a1, z1] of [[7, 4.5, 176], [3, -1, 178], [-2, -6.5, 176.5]]) {
      strands.push(k.pathOf([at(pt(a0, sd * 0.6, 182.4)), at(pt((a0 + a1) / 2, sd * 6, 181.6)), at(pt(a1, sd * 9.4, z1))]));
    }
  }
  const part = k.pathOf([at(pt(8.6, 0.3, 181.6)), at(pt(3, 0.2, 184.4)), at(pt(-3, 0.1, 185))]);
  const lock = (sd) => k.pathOf([at(pt(8.8, sd * 0.8, 180.4)), at(pt(11, sd * 2.6, 176.2)), at(pt(10.7, sd * 3.6, 174.6)), at(pt(10.5, sd * 4.4, 177.4)), at(pt(9.4, sd * 4.2, 179.8))], true);
  const vols = VOL.map(([a2, sd, z, r]) => [pt(a2, sd, z), r]);
  body(pt(6, 0, 190),
    `<g class="fm-hair">` +
    vols.map(([q, r]) => circle(q, r, "fm-hair-edge")).join("") +
    vols.map(([q, r]) => circle(q, r, "fm-hair-fill")).join("") +
    SUN.map(([a2, sd, z, r]) => circle(pt(a2, sd, z), r, "fm-hair-sun")).join("") +
    `<path class="fm-hair-strand" d="${strands.join("")}"/>` +
    `<path class="fm-hair-strand" data-part="hair-part" d="${part}"/>` +
    (front ? `<path class="fm-hair-lock" d="${lock(1)}"/><path class="fm-hair-lock" d="${lock(-1)}"/>` : "") +
    `</g>`);

  for (const e of pose.extras ? pose.extras({ pt, ptv, f, s, put, P, S, L, D, at, c }) : []) put(e.at, e.svg);
  items.sort((a, b) => a.d - b.d);
  // The shared body sits in the paint order at the torso's depth: limbs behind it go first.
  const key = G.dot3([0, 0, 120], V);
  const join = (list) => list.map((i) => i.svg).join("");
  const moving = items.filter((i) => !i.body);
  return {
    body: join(items.filter((i) => i.body)),
    back: join(moving.filter((i) => i.d < key)),
    front: join(moving.filter((i) => i.d >= key)),
  };
}

// --- Station actions and the wave: arm poses in (forward, his-left, z) cm, plus what he holds ---
const hang = (side) => ({ elbow: [0, side * 22.5, 118], hand: [0, side * 22, 96] });
const book = (centre, lift = 0) => (h) => {
  const { pt, c, S } = h;
  const F = G.frameOf(h.ptv(centre), h.f, h.s, [0, 0, 1]);
  const page = (sign) => [[0, -1.2], [sign * 11.5, 0], [sign * 11.5, 15.5], [0, 14.3]].map(([u, v]) => (sign > 0 ? [u, v] : [u, v]));
  const left = G.prismOf(F, page(1), -0.4, 0.4, h.P);
  const right = G.prismOf(F, page(-1).reverse(), -0.4, 0.4, h.P);
  const lifted = lift ? G.prismOf(G.frameOf(h.ptv([centre[0] - 3, centre[1], centre[2]]), h.f, h.s, [0, 0, 1]), [[0, -1], [-6, 4], [-8, 14], [0, 14.3]].reverse(), -0.2, 0.2, h.P) : null;
  void pt;
  void c;
  return [
    { at: h.ptv(centre), svg: `<g class="fm-page">${S(left, { tone: "hi", crease: "lo" })}${S(right, { tone: "hi", crease: "lo" })}${lifted ? S(lifted, { tone: "hi", crease: "lo" }) : ""}</g>` },
  ];
};
const shaker = (hand) => (h) => {
  const q = h.ptv(hand);
  return [{ at: G.add3(q, [0, 0, 6]), svg: `<g class="fm-silver">${h.c.cyl(q[0], q[1], 2.1, q[2] + 2, q[2] + 9, { steps: 14, tone: "hi", crease: "lo" })}</g><g class="fm-dark">${h.c.cyl(q[0], q[1], 2.2, q[2] + 9, q[2] + 10.4, { steps: 14, tone: "hi", crease: "lo" })}</g>` }];
};
const pawn = (hand) => (h) => {
  const q = G.add3(h.ptv(hand), [0, 0, -3]);
  return [{ at: q, svg: `<g class="fm-dark">${h.S(G.sphereOf(q, 1.7, h.P, { steps: 8 }), { tone: "hi", crease: "lo" })}</g>` }];
};
const bell = (centre) => (h) => {
  const q = h.ptv(centre);
  const handle = [h.ptv([centre[0], centre[1] + 4.5, centre[2] + 4]), h.ptv([centre[0], centre[1] + 3.6, centre[2] + 9.5]), h.ptv([centre[0], centre[1], centre[2] + 11]), h.ptv([centre[0], centre[1] - 3.6, centre[2] + 9.5]), h.ptv([centre[0], centre[1] - 4.5, centre[2] + 4])];
  return [{ at: q, svg: `<g class="fm-iron">${h.c.tube(handle, 1.3, { tone: "hi", spacing: 3 })}${h.S(G.sphereOf(q, 7.5, h.P, { steps: 16 }), { tone: "hi", crease: "lo" })}</g>` }];
};
const POSES = {
  type1: { arms: { L: { elbow: [8, 18, 117], hand: [27, 9, 105] }, R: { elbow: [8, -18, 117], hand: [27, -10, 103.5] } } },
  type2: { arms: { L: { elbow: [8, 18, 117], hand: [27, 9.5, 103.4] }, R: { elbow: [8, -18, 117], hand: [27.5, -9.5, 105.5] } } },
  book1: { arms: { L: hang(1), R: { elbow: [12, -19, 122], hand: [30, -13, 108] } } },
  book2: { arms: { L: { elbow: [10, 18, 122], hand: [22, 12, 132] }, R: { elbow: [10, -18, 122], hand: [22, -4, 132] } }, extras: book([24, 4, 128]) },
  book3: { arms: { L: { elbow: [10, 18, 122], hand: [22, 12, 132] }, R: { elbow: [12, -16, 126], hand: [21, 1, 140] } }, extras: book([24, 4, 128], 1) },
  cook1: { arms: { L: { elbow: [12, 19, 116], hand: [28, 12, 106] }, R: { elbow: [12, -18, 126], hand: [26, -8, 130] } }, extras: shaker([26, -8, 130]) },
  cook2: { arms: { L: { elbow: [12, 19, 116], hand: [28, 12, 106] }, R: { elbow: [16, -16, 124], hand: [34, -3, 123] } }, extras: shaker([34, -3, 123]) },
  cook3: { arms: { L: { elbow: [12, 19, 116], hand: [28, 12, 106] }, R: { elbow: [16, -16, 121], hand: [34, -3, 118] } }, extras: shaker([34, -3, 118]) },
  chess1: { arms: { L: hang(1), R: { elbow: [12, -18, 112], hand: [28, -9, 94] } }, extras: pawn([28, -9, 94]) },
  chess2: { arms: { L: hang(1), R: { elbow: [14, -16, 106], hand: [34, -5, 86] } }, extras: pawn([34, -5, 86]) },
  kb1: { arms: { L: { elbow: [6, 11, 114], hand: [9, 3.5, 84] }, R: { elbow: [6, -11, 114], hand: [9, -3.5, 84] } }, extras: bell([10, 0, 70]) },
  kb2: { arms: { L: { elbow: [22, 9, 134], hand: [44, 3.5, 140] }, R: { elbow: [22, -9, 134], hand: [44, -3.5, 140] } }, extras: bell([47, 0, 128]) },
  wave1: { arms: { L: hang(1), R: { elbow: [4, -27, 150], hand: [8, -24, 178] } } },
  wave2: { arms: { L: hang(1), R: { elbow: [4, -27, 150], hand: [9, -33, 175] } } },
};
const POSE_FACING = { wave1: "dr", wave2: "dr" };
for (const a of Object.values(ACTIONS)) for (const [name] of a.frames) POSE_FACING[name] = a.facing;

export default {
  render() {
    const { P, width, height } = projection();
    const symbols = [];
    for (const facing of Object.keys(FACINGS)) {
      for (const [name, swing] of Object.entries(FRAMES)) {
        const c = context(P, `fig-${facing}-${name}`);
        const fig = person(c, facing, { swing });
        if (name === "idle") symbols.push(`<symbol id="f-${facing}-body" viewBox="0 0 ${width} ${height}">${fig.body}</symbol>`);
        symbols.push(`<symbol id="f-${facing}-${name}" viewBox="0 0 ${width} ${height}">${fig.back}<use href="#f-${facing}-body" width="${width}" height="${height}"/>${fig.front}</symbol>`);
      }
      // Action poses, only in the facing each one is used in.
      for (const [name, pose] of Object.entries(POSES)) {
        if (POSE_FACING[name] !== facing) continue;
        const c = context(P, `fig-${facing}-${name}`);
        const fig = person(c, facing, pose);
        symbols.push(`<symbol id="f-${facing}-${name}" viewBox="0 0 ${width} ${height}">${fig.back}<use href="#f-${facing}-body" width="${width}" height="${height}"/>${fig.front}</symbol>`);
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="figure-sheet" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">${symbols.join("")}</svg>`;
    return { svg, meta: { width, height, anchor: [Math.round(P.origin[0] * 100) / 100, Math.round(P.origin[1] * 100) / 100] } };
  },
};
