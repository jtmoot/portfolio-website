// Joshua as a walking figure, drawn with the kit in the room's projection and scale.
// Output: one sprite sheet of <symbol>s, f-{dl|dr|ul|ur}-{idle|w1..w6|j1..j6} plus the station
// poses, sharing one viewBox whose anchor (meta) is the point between his feet.
import { k, G, CAM, SCALE, context } from "./lib.mjs";
import { ACTIONS } from "../../src/lib/figure.js";

const H = 183; // cm
const FACINGS = {
  dr: [1, 0], // screen down-right = kit +x
  dl: [0, 1], // screen down-left = kit +y
  ur: [0, -1],
  ul: [-1, 0],
};
/** Six frames a cycle; the runtime advances them by distance walked (src/lib/figure.js). */
const CYCLE = 6;
/** Per gait: leg reach either side (cm), how high the swinging foot lifts, and the jog's bounce. */
const GAITS = {
  w: { amp: 22, lift: 7, bounce: 0 },
  j: { amp: 30, lift: 18, bounce: 3.5 },
};
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

/** Jogging arms: bent about 90 degrees, pumping against the legs, raised by the bounce. */
function jogArms(stride, b) {
  const arm = (side) => {
    const reach = -side * stride * 0.55;
    return { elbow: [reach * 0.5 - 4, side * 22, 121 + b], hand: [reach + 11, side * 15, 121 + b] };
  };
  return { L: arm(1), R: arm(-1) };
}

/** How far up the screen a rise of b cm draws, in sheet px (for the shared body's bounce). */
const riseOf = (b, P) => k.iso([0, 0, b], P)[1] - k.iso([0, 0, 0], P)[1];

/**
 * Joshua, from his photos: 183 cm, broad square shoulders on a lean frame, a heather quarter-zip,
 * tapered joggers, Novablasts, a watch on a brown strap on his left wrist, and wavy dirty-blonde
 * hair, long on top with a loose middle part and a few pieces falling forward.
 * @param {object} c drawing context
 * @param {"dr" | "dl" | "ur" | "ul"} facing
 * @param {{ swing?: number, gait?: "w" | "j", phase?: number, sink?: number, arms?: { L?: object, R?: object }, extras?: (h: object) => { at: number[], svg: string }[] }} pose
 *   gait and phase: a walk or jog frame at this angle of the cycle (radians); swing: legs apart
 *   without a gait (0 is standing);
 *   arms: elbow and hand points in (forward, his-left, z) cm, overriding the walk swing per arm;
 *   reach: "L" or "R", an arm drawn on its own layer (returned as `over`) to sit above the station;
 *   sit: seated (with sink, the drop from standing hip height to the seat);
 *   front: both arms are in front of his body (a kettlebell between the legs), so draw them after it;
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
  const gait = pose.gait ? GAITS[pose.gait] : null;
  const th = pose.phase ?? 0;
  const stride = gait ? gait.amp * Math.cos(th) : 20 * swing;
  /** The jog's bounce (highest with the legs apart, lowest as they pass), less any sink: a
   * pose's hinge, where his hips drop and his knees bend (the bottom of a kettlebell swing). */
  const sink = pose.sink ?? 0;
  const b = (gait ? gait.bounce * Math.abs(Math.cos(th)) : 0) - sink;
  const front = facing === "dr" || facing === "dl";

  // Shadow.
  items.push({ d: -1e9, svg: `<path class="iso-halo" d="${k.haloOf({ x: -15, y: -15, w: 30, d: 30, r: 15 }, 0, 2, P)}"/>` });

  // --- Legs: tapered joggers with a cuff, Novablasts -----------------------------------------------
  for (const side of [1, -1]) {
    const reach = side * stride;
    // The leg swinging forward lifts its foot and drives its knee; the planted one stays down.
    const lift = gait ? gait.lift * Math.max(0, -side * Math.sin(th)) : 0;
    const hip = pt(0, side * 9, 94 + b);
    // Seated: thighs run forward along the seat, shins drop to the floor.
    const knee = pose.sit ? pt(40, side * 10, 96 + b + 2) : pt(reach * 0.55 + 1.5 + lift * 0.8 + sink * 0.9, side * 8.6, 50 + lift * 0.85 + b * 0.5);
    const ankle = pose.sit ? pt(43, side * 9, 11) : pt(reach - lift * 0.3, side * 8.4, 11 + lift);
    put(G.lerp3(hip, knee, 0.5), `<g class="fm-jog">${c.tube([hip, knee], 7, { tone: "hi", spacing: 7 })}</g>`);
    put(G.lerp3(knee, ankle, 0.5), `<g class="fm-jog">${c.tube([knee, G.lerp3(knee, ankle, 0.85)], 5.6, { tone: "hi", spacing: 7 })}</g>`);
    put(G.lerp3(knee, ankle, 0.92), `<g class="fm-cuff">${c.tube([G.lerp3(knee, ankle, 0.85), ankle], 4.9, { tone: "hi", spacing: 7 })}</g>`);
    const heel = pose.sit ? pt(34.5, side * 8.4, 0) : pt(reach - lift * 0.3 - 8.5, side * 8.4, lift);
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
  const arms = gait && pose.gait === "j" ? jogArms(stride, b) : walkArms(stride);
  const limbPut = put;
  for (const [key, side] of [["L", 1], ["R", -1]]) {
    const put =
      pose.reach === key
        ? (centre, svg) => items.push({ d: G.dot3(centre, V), svg, over: true })
        : pose.front
          ? (centre, svg) => items.push({ d: 1e6 + G.dot3(centre, V), svg })
          : limbPut;
    const a = { ...arms[key], ...(pose.arms?.[key] || {}) };
    const shoulder = pt(0, side * 20, 141 + b); // rides with the body: the bounce, a hinge, sitting
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
  const moving = items.filter((i) => !i.body && !i.over);
  return {
    body: join(items.filter((i) => i.body)),
    over: join(items.filter((i) => i.over)),
    back: join(moving.filter((i) => i.d < key)),
    front: join(moving.filter((i) => i.d >= key)),
    rise: b ? Math.round(riseOf(b, P) * 100) / 100 : 0,
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
/**
 * A salt shaker gripped round its middle at `hand`, tipped `tilt` degrees forward from upright (180
 * is upside down); `pour` (0, 1 or 2) drops flakes from its cap at one of two offsets.
 */
const shaker = (hand, tilt = 0, pour = 0) => (h) => {
  const a = (tilt * Math.PI) / 180;
  const up = [Math.sin(a), 0, Math.cos(a)];
  const add = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k, p[2] + q[2] * k];
  const v = (q) => h.ptv(q);
  // Gripped near its base, so most of the jar shows above his fingers.
  const cap = add(hand, up, 16);
  const items = [
    { at: v(add(hand, [0, -3, 0])), svg: `<g class="fm-silver">${h.c.tube([v(add(hand, up, -3)), v(add(hand, up, 13))], 3.8, { tone: "hi", spacing: 3 })}</g><g class="fm-dark">${h.c.tube([v(add(hand, up, 13)), v(cap)], 3.9, { tone: "hi", spacing: 3 })}</g>` },
  ];
  if (pour) {
    // A fine fall of seasoning: small dark pepper specks and a few pale salt ones, no outlines,
    // ending at the braise. Alternate frames offset the specks so they read as falling.
    const sk = G.scaleOf(h.P);
    const specks = [];
    for (let i = 0; i < 9; i++) {
      const k = 2 + ((i * 2.1 + (pour === 1 ? 0 : 1.05)) % 18);
      const jitter = [Math.sin(i * 2.3) * 1.1, Math.cos(i * 1.7) * 1.1, -k];
      const [x, y] = h.at(v(add(cap, jitter)));
      const salt = i % 4 === 3;
      specks.push(`<circle class="${salt ? "fm-salt" : "fm-pepper"}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${((salt ? 0.42 : 0.36) * sk).toFixed(2)}"/>`);
    }
    items.push({ at: v(add(cap, [0, 0, -10])), svg: `<g class="fm-seasoning">${specks.join("")}</g>` });
  }
  return items;
};
const bell = (centre) => (h) => {
  const q = h.ptv(centre);
  const handle = [h.ptv([centre[0], centre[1] + 4.5, centre[2] + 4]), h.ptv([centre[0], centre[1] + 3.6, centre[2] + 9.5]), h.ptv([centre[0], centre[1], centre[2] + 11]), h.ptv([centre[0], centre[1] - 3.6, centre[2] + 9.5]), h.ptv([centre[0], centre[1] - 4.5, centre[2] + 4])];
  return [{ at: q, svg: `<g class="fm-iron">${h.c.tube(handle, 1.3, { tone: "hi", spacing: 3 })}${h.S(G.sphereOf(q, 7.5, h.P, { steps: 16 }), { tone: "hi", crease: "lo" })}</g>` }];
};
/**
 * A galvanized watering can held by its top handle at `hand`, tipped forward by `tilt` degrees;
 * `pour` (0, 1 or 2) draws falling drops under the rose at one of two offsets, so alternating
 * frames read as a stream.
 */
const can = (hand, tilt, pour = 0) => (h) => {
  const a = (tilt * Math.PI) / 180;
  const at3 = (v) => h.ptv(v);
  const add = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k, p[2] + q[2] * k];
  const up = [Math.sin(a), 0, Math.cos(a)]; // the can's axis, in (forward, side, z)
  const ahead = [Math.cos(a), 0, -Math.sin(a)]; // across it, toward the spout
  const base = add(hand, up, -22);
  const top = add(base, up, 18);
  const spout0 = add(add(base, up, 4), ahead, 7.5);
  const dir = [ahead[0] * 0.72 + up[0] * 0.7, 0, ahead[2] * 0.72 + up[2] * 0.7];
  const tip = add(spout0, dir, 20);
  const items = [
    { at: at3(add(base, up, 9)), svg: `<g class="fm-can">${h.c.tube([at3(base), at3(top)], 8, { tone: "hi", spacing: 4 })}</g>` },
    { at: at3(add(top, ahead, -1)), svg: `<g class="fm-can">${h.c.tube([at3(add(top, ahead, -7)), at3(add(hand, up, 2)), at3(add(top, ahead, 4))], 1, { tone: "hi", spacing: 3 })}</g>` },
    { at: at3(add(spout0, dir, 8)), svg: `<g class="fm-can">${h.c.tube([at3(spout0), at3(tip)], 1.1, { tone: "hi", spacing: 3 })}${h.S(G.sphereOf(at3(tip), 1.8, h.P, { steps: 8 }), { tone: "hi", crease: "lo" })}</g>` },
  ];
  if (pour) {
    const offs = pour === 1 ? [5, 13, 21, 29] : [9, 17, 25, 33];
    const drops = offs.map((k, i) => h.S(G.sphereOf(at3(add(tip, [0.8 * (i % 2 ? 1 : -1), 0, -k])), 1.4, h.P, { steps: 6 }), { tone: "hi", crease: "lo" })).join("");
    items.push({ at: at3(add(tip, [0, 0, -14])), svg: `<g class="fm-drop">${drops}</g>` });
  }
  return items;
};
/** A mug of coffee in his hand, rim up. */
const mug = (hand) => (h) => {
  const q = h.ptv([hand[0], hand[1], hand[2] - 4]);
  const ring = k.circleRing(q[0], q[1], 3.2, 20).map(([x, y]) => h.at([x, y, q[2] + 7.6]));
  return [{ at: G.add3(q, [0, 0, 4]), svg: `<g class="fm-mug">${h.c.cyl(q[0], q[1], 3.8, q[2], q[2] + 8.2, { steps: 20, tone: "hi", crease: "lo" })}</g><path class="fm-coffee" d="${k.pathOf(ring, true)}"/>` }];
};
const POSES = {
  type1: { arms: { L: { elbow: [8, 18, 117], hand: [27, 9, 105] }, R: { elbow: [8, -18, 117], hand: [27, -10, 103.5] } } },
  type2: { arms: { L: { elbow: [8, 18, 117], hand: [27, 9.5, 103.4] }, R: { elbow: [8, -18, 117], hand: [27.5, -9.5, 105.5] } } },
  book1: { arms: { L: hang(1), R: { elbow: [12, -19, 122], hand: [30, -13, 108] } } },
  book2: { arms: { L: { elbow: [10, 18, 122], hand: [22, 12, 132] }, R: { elbow: [10, -18, 122], hand: [22, -4, 132] } }, extras: book([24, 4, 128]) },
  book3: { arms: { L: { elbow: [10, 18, 122], hand: [22, 12, 132] }, R: { elbow: [12, -16, 126], hand: [21, 1, 140] } }, extras: book([24, 4, 128], 1) },
  // Seasoning, facing the stove with the left hand (the one on the room side): lift the shaker,
  // tip it over the Dutch oven and shake it in short arcs, flakes falling into the pot.
  cook1: { arms: { L: { elbow: [14, 22, 124], hand: [30, 18, 136] }, R: { elbow: [12, -19, 112], hand: [26, -14, 102] } }, extras: shaker([30, 18, 136]) },
  cook2: { arms: { L: { elbow: [20, 22, 134], hand: [37, 20, 148] }, R: { elbow: [12, -19, 112], hand: [26, -14, 102] } }, extras: shaker([37, 20, 148], 150, 1) },
  cook3: { arms: { L: { elbow: [20, 22, 131], hand: [37, 20, 141] }, R: { elbow: [12, -19, 112], hand: [26, -14, 102] } }, extras: shaker([37, 20, 141], 168, 2) },
  // Chess, from behind the board facing the room: reach for the queen on d4, carry it across to
  // g7 with the left hand (the one on the room side), the right on the table edge, then stand
  // back as the king falls.
  chess1: { reach: "L", sink: 8, arms: { L: { elbow: [26, 20, 116], hand: [46, 18, 88] }, R: hang(-1) } },
  chess2: { reach: "L", sink: 10, arms: { L: { elbow: [34, 25, 114], hand: [60, 31, 90] }, R: { elbow: [13, -19, 104], hand: [19, -14, 79] } } },
  chess3: { reach: "L", arms: { L: { elbow: [6, 21, 116], hand: [14, 16, 100] }, R: hang(-1) } },
  // Kettlebell swing: hike the bell back between the legs in a hinge, drive the hips through,
  // float it to chest height on straight arms.
  kb1: { sink: 12, front: true, arms: { L: { elbow: [16, 13, 108], hand: [18, 4, 70] }, R: { elbow: [16, -13, 108], hand: [18, -4, 70] } }, extras: bell([20, 0, 57]) },
  kb2: { sink: 4, front: true, arms: { L: { elbow: [18, 12, 118], hand: [29, 4, 98] }, R: { elbow: [18, -12, 118], hand: [29, -4, 98] } }, extras: bell([32, 0, 86]) },
  kb3: { front: true, arms: { L: { elbow: [24, 9, 141], hand: [44, 3.5, 148] }, R: { elbow: [24, -9, 141], hand: [44, -3.5, 148] } }, extras: bell([47, 0, 136]) },
  water1: { arms: { L: hang(1), R: { elbow: [8, -21, 116], hand: [19, -17, 106] } }, extras: can([19, -18, 108], 0) },
  water2: { arms: { L: hang(1), R: { elbow: [14, -20, 121], hand: [29, -15, 116] } }, extras: can([29, -15, 116], 52, 1) },
  water3: { arms: { L: hang(1), R: { elbow: [14, -20, 121], hand: [29, -15, 116] } }, extras: can([29, -15, 116], 52, 2) },
  // Reading in the chair: the book open on his lap, turning a page, a sip of coffee.
  // Held high enough to show over the club chair's back from behind.
  sit1: { sit: true, sink: 44, front: true, arms: { L: { elbow: [12, 19, 88], hand: [24, 9, 98] }, R: { elbow: [12, -19, 88], hand: [24, -9, 98] } }, extras: book([27, 0, 100]) },
  sit2: { sit: true, sink: 44, front: true, arms: { L: { elbow: [12, 19, 88], hand: [24, 9, 98] }, R: { elbow: [13, -17, 92], hand: [24, -3, 108] } }, extras: book([27, 0, 100], 1) },
  sip: { sit: true, sink: 44, front: true, arms: { L: { elbow: [12, 19, 86], hand: [23, 6, 94] }, R: { elbow: [8, -20, 90], hand: [11, -7, 114] } }, extras: (h) => [...book([26, 4, 96])(h), ...mug([12, -7, 114])(h)] },
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
      const frames = [["idle", {}]];
      for (const g of Object.keys(GAITS)) for (let i = 0; i < CYCLE; i++) frames.push([`${g}${i + 1}`, { gait: g, phase: (2 * Math.PI * i) / CYCLE }]);
      for (const [name, pose] of frames) {
        const c = context(P, `fig-${facing}-${name}`);
        const fig = person(c, facing, pose);
        if (name === "idle") symbols.push(`<symbol id="f-${facing}-body" viewBox="0 0 ${width} ${height}">${fig.body}</symbol>`);
        const y = fig.rise ? ` y="${fig.rise}"` : "";
        symbols.push(`<symbol id="f-${facing}-${name}" viewBox="0 0 ${width} ${height}">${fig.back}<use href="#f-${facing}-body"${y} width="${width}" height="${height}"/>${fig.front}</symbol>`);
      }
      // Action poses, only in the facing each one is used in.
      for (const [name, pose] of Object.entries(POSES)) {
        if (POSE_FACING[name] !== facing) continue;
        const c = context(P, `fig-${facing}-${name}`);
        const fig = person(c, facing, pose);
        const y = fig.rise ? ` y="${fig.rise}"` : "";
        symbols.push(`<symbol id="f-${facing}-${name}" viewBox="0 0 ${width} ${height}">${fig.back}<use href="#f-${facing}-body"${y} width="${width}" height="${height}"/>${fig.front}</symbol>`);
        if (fig.over) symbols.push(`<symbol id="f-${facing}-${name}-over" viewBox="0 0 ${width} ${height}">${fig.over}</symbol>`);
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="figure-sheet" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">${symbols.join("")}</svg>`;
    return { svg, meta: { width, height, anchor: [Math.round(P.origin[0] * 100) / 100, Math.round(P.origin[1] * 100) / 100] } };
  },
};
