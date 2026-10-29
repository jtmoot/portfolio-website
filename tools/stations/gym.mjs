// The gym corner: rubber tiles, a Rogue-style squat stand with a pull-up bar, a loaded barbell
// in J-cups, a weighted vest on a hook, two kettlebells, a plyo box, an agility ladder and a
// pair of Asics Novablast. Local world: stand centred on x = 0, uprights at y = +-55, cm.
import { station, k, G } from "./lib.mjs";

const UP = 3.75; // half width of a 3x3 in upright
const UY = 55; // upright centre y
const TOP = 230;
const BAR = { x: 5.5, z: 137 };
const PLATE_R = 22.5;

export default station("gym", {
  label:
    "Joshua's gym corner: a squat stand with a pull-up bar and a loaded barbell, a weighted vest hanging on it, two kettlebells, a plyo box, an agility ladder on the floor and a pair of Asics Novablast running shoes.",
  bounds: [
    [-60, -112, 0], [-60, 112, 0], [118, -112, 0], [118, 112, 0],
    [-10, -55, TOP + 2], [-10, 55, TOP + 2], [5, -112, BAR.z + PLATE_R], [5, 112, BAR.z + PLATE_R],
  ],
  draw(c) {
    const { box, cyl, prism, frame, S, L, D, at, path3, halo } = c;
    const P = c.P;
    const out = [];

    // --- Rubber floor tiles -----------------------------------------------------------------------
    out.push(halo({ x: -58, y: -112, w: 116, d: 224, r: 4 }, 0, 2));
    const tiles = [];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) tiles.push({ x: -55 + i * 55, y: -110 + j * 55 });
    out.push(
      `<g class="m-rubber">` +
        c.byDepth(tiles, (t) => [t.x + 27, t.y + 27, 0])
          .map((t) => box(t.x, t.y, 0, t.x + 55, t.y + 55, 1.6, { r: 0.4, steps: 2, tone: "hi", crease: "lo" }) +
            D(k.dotGrid(t.x + 9, t.y + 9, 5, 5, 9.25, 1.6, P), { size: 0.3, tone: "faint" }))
          .join("") +
        `</g>`,
    );
    const F0 = 1.6; // floor level on the tiles

    // --- Agility ladder on the floor in front ----------------------------------------------------
    const ladder = [];
    const LX0 = 74, LX1 = 114;
    ladder.push(`<g class="m-strap">`);
    for (const x of [LX0, LX1]) ladder.push(box(x - 1.2, -100, 0, x + 1.2, 100, 0.3, { r: 0.2, steps: 2, tone: "hi", crease: "lo" }));
    for (let y = -96; y <= 96; y += 48) {
      ladder.push(box(LX0 - 1.6, y - 1.6, 0.3, LX1 + 1.6, y + 1.6, 1.1, { r: 0.6, steps: 3, tone: "hi", crease: "lo" }));
      ladder.push(D([at([LX0, y, 1.1]), at([LX1, y, 1.1])], { size: 0.4, tone: "mid" }));
    }
    ladder.push(`</g>`);

    // --- Barbell pieces (built along y) ----------------------------------------------------------
    const BF = frame([BAR.x, 0, BAR.z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
    const sleeve = (sign, from, to) => {
      // Sleeve from |y| = from to |y| = to, radius 2.5, with a chamfered end cap at 110.
      const a = sign > 0 ? from : -to;
      const b = sign > 0 ? to : -from;
      const prof = to >= 110 ? (sign > 0 ? [[a, 2.5], [b - 0.6, 2.5], [b, 2.1]] : [[a, 2.1], [a + 0.6, 2.5], [b, 2.5]]) : [[a, 2.5], [b, 2.5]];
      return `<g class="m-steel">${S(G.solidOf(prof, BF, P), { tone: "hi", crease: "lo" })}</g>`;
    };
    const collar = (sign) => {
      const s0 = sign > 0 ? 64.5 : -66.5;
      return `<g class="m-steel">${S(G.disc(s0, s0 + 2, 3.4, BF, P), { tone: "hi", crease: "lo" })}</g>`;
    };
    const plate = (sign) => {
      // A black bumper plate: 6 cm thick, steel hub, raised rim, ring grooves on the face.
      const s0 = sign > 0 ? 69 : -75;
      const s1 = s0 + 6;
      const faceS = sign > 0 ? s1 : s1; // the +y face is the one we see on both sides
      const body = `<g class="m-dark">${S(G.disc(s0, s1, PLATE_R, BF, P), { tone: "hi", crease: "lo" })}</g>`;
      const rings = L(G.circleOf(BF, faceS, PLATE_R - 2.2, P) + G.circleOf(BF, faceS, 12, P), { tone: "lo" }) + L(G.circleOf(BF, faceS, 16.5, P), { tone: "faint" });
      const hub = `<g class="m-steel">${S(G.ringBand(faceS, faceS + 0.4, 2.55, 5.4, BF, P), { tone: "hi", crease: "lo" })}</g>`;
      const clip = `<g class="m-steel">${S(G.ringBand(faceS + 0.4, faceS + 2.4, 2.55, 3.5, BF, P), { tone: "mid", crease: "lo" })}</g>`;
      // A raised weight mark: a short stadium on the face, upper left.
      return body + rings + hub + (sign > 0 ? clip : "");
    };
    const shaft = () => {
      const shaftSolid = `<g class="m-steel">${S(G.solidOf([[-64.5, 1.4], [64.5, 1.4]], BF, P), { tone: "hi", crease: "lo" })}</g>`;
      // Knurling: two zones of faded axial ribs plus the centre knurl.
      const knurl = (a, b) => k.fadedSvg(G.ribsOf(BF, a, b, 1.42, 26, P, { fade: [0.15, 0.6], seams: true }), { tone: "lo" });
      return shaftSolid + knurl(-52, -14) + knurl(-6, 6) + knurl(14, 52);
    };

    // --- The stand ------------------------------------------------------------------------------
    const foot = (yc) =>
      `<g class="m-steel-dark">${box(-46, yc - UP, 0, 42, yc + UP, 5.5, { r: 0.6, steps: 3, bevel: 0.4, tone: "hi", crease: "lo" })}</g>` +
      cyl(38, yc, 2.2, 5.5, 6.4, { steps: 14, tone: "lo" }) + cyl(-42, yc, 2.2, 5.5, 6.4, { steps: 14, tone: "lo" }) +
      D([at([38, yc, 6.4]), at([-42, yc, 6.4])], { size: 0.45, tone: "hi" });
    const holes = (yc) => {
      // Westside spacing: 1 in through the bench zone, 2 in elsewhere; on the two visible faces.
      const zs = [];
      for (let z = 20; z < 215; z += z > 95 && z < 150 ? 2.54 : 5.08) zs.push(z);
      const front = zs.map((z) => k.sideRing([UP, yc, z], 0.75, "x", P, 12)).join("");
      const sideFace = zs.map((z) => k.sideRing([0, yc + UP, z], 0.75, "y", P, 12)).join("");
      return `<path class="m-hole" d="${front}${sideFace}"/>`;
    };
    const upright = (yc) =>
      `<g class="m-steel-dark">${box(-UP, yc - UP, 5.5, UP, yc + UP, TOP, { r: 0.4, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })}</g>` +
      holes(yc) +
      // Gusset plate where it meets the foot.
      `<g class="m-steel-dark">${box(UP, yc - 1, 5.5, UP + 10, yc + 1, 9, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}</g>`;
    const jcup = (yc) =>
      `<g class="m-steel-dark">${box(UP, yc - 3, BAR.z - 6, UP + 2.2, yc + 3, BAR.z + 4, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}` +
      box(UP + 2.2, yc - 3, BAR.z - 3.5, BAR.x + 3.6, yc + 3, BAR.z - 1.4, { r: 0.4, steps: 2, tone: "hi", crease: "lo" }) + `</g>` +
      `<g class="m-uhmw">${box(UP + 2.2, yc - 2.6, BAR.z - 1.4, BAR.x + 2.2, yc + 2.6, BAR.z - 1.1, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}</g>`;
    const jcupLip = (yc) => `<g class="m-steel-dark">${box(BAR.x + 2.2, yc - 3, BAR.z - 1.4, BAR.x + 3.6, yc + 3, BAR.z + 2.2, { r: 0.3, steps: 2, tone: "hi", crease: "lo" })}</g>`;
    const crossTop = () =>
      `<g class="m-steel-dark">${box(-UP, -UY, TOP - 7.5, UP, UY, TOP, { r: 0.4, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })}` +
      box(UP, -UY - 2, TOP - 6, 13, -UY + 2, TOP - 2, { r: 0.3, steps: 2, tone: "hi", crease: "lo" }) +
      box(UP, UY - 2, TOP - 6, 13, UY + 2, TOP - 2, { r: 0.3, steps: 2, tone: "hi", crease: "lo" }) + `</g>` +
      `<g class="m-steel">${S(G.solidOf([[-UY - 2, 1.6], [UY + 2, 1.6]], frame([14.6, 0, TOP - 4], [0, 1, 0], [1, 0, 0], [0, 0, 1]), P), { tone: "hi", crease: "lo" })}</g>`;
    const rear = () =>
      `<g class="m-steel-dark">${box(-46, -UY + UP, 0, -38.5, UY - UP, 5.5, { r: 0.4, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })}</g>` +
      k.faceTextSvg(k.sideMatrix([-38.5, 0], 0, P, "right"), "", { size: 3 });

    // --- Weighted vest on a hook (front face of the left upright, below the J-cup) ---------------
    const vest = () => {
      const s = [];
      const yc = UY;
      s.push(`<g class="m-steel-dark">${box(UP, yc - 1, 101, UP + 4, yc + 1, 103, { r: 0.3, steps: 2, tone: "hi", crease: "lo" })}` +
        box(UP + 3, yc - 1, 103, UP + 4, yc + 1, 106, { r: 0.3, steps: 2, tone: "hi", crease: "lo" }) + `</g>`);
      const X0 = UP + 1, X1 = UP + 7, Y0 = yc - 13, Y1 = yc + 13, Z0 = 60, Z1 = 90;
      // Shoulder straps (behind the hook), body, then the front webbing.
      for (const sy of [Y0 + 1, Y1 - 7]) {
        s.push(`<g class="m-dark">${box(X0 + 0.5, sy, Z1, X1 - 1, sy + 6, Z1 + 9, { r: 1, steps: 3, tone: "hi", crease: "lo" })}</g>`);
      }
      s.push(`<g class="m-dark">${c.tube([[X0 + 3, Y0 + 4, Z1 + 9], [UP + 3.5, yc - 0.6, 104]], 0.9, { tone: "hi" })}${c.tube([[X0 + 3, Y1 - 4, Z1 + 9], [UP + 3.5, yc + 0.6, 104]], 0.9, { tone: "hi" })}</g>`);
      s.push(`<g class="m-dark">${box(X0, Y0, Z0, X1, Y1, Z1, { r: 2.4, steps: 4, bevel: 0.5, tone: "hi", crease: "lo" })}</g>`);
      const fx = X1 + 0.02;
      const rect = (y0, y1, z0, z1) => path3([[fx, y1, z0], [fx, y0, z0], [fx, y0, z1], [fx, y1, z1]], true);
      // Plate pocket seam, three rows of MOLLE webbing, and a small patch.
      s.push(L(rect(Y0 + 2.5, Y1 - 2.5, Z0 + 3, Z1 - 3), { tone: "lo" }));
      for (const z of [Z0 + 6, Z0 + 10, Z0 + 14]) {
        s.push(`<g class="m-dark">${box(X1, Y0 + 2.5, z, X1 + 0.5, Y1 - 2.5, z + 2, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}</g>`);
        let bars = "";
        for (let y = Y0 + 6; y < Y1 - 3; y += 4) bars += k.pathOf([at([X1 + 0.5, y, z]), at([X1 + 0.5, y, z + 2])]);
        s.push(L(bars, { tone: "lo" }));
      }
      s.push(`<path class="m-patch" d="${rect(yc - 4, yc + 4, Z1 - 10, Z1 - 6.5)}"/>` + L(rect(yc - 4, yc + 4, Z1 - 10, Z1 - 6.5), { tone: "lo" }));
      return s.join("");
    };

    // --- Kettlebells ----------------------------------------------------------------------------
    const kettlebell = (cx, cy, r) => {
      const s = [];
      s.push(halo({ x: cx - r * 0.8, y: cy - r * 0.8, w: r * 1.6, d: r * 1.6, r: r * 0.8 }, F0, 1));
      s.push(`<g class="m-dark">`);
      s.push(cyl(cx, cy, r * 0.62, F0, F0 + 1.2, { steps: 32, tone: "hi", crease: "lo" }));
      s.push(S(G.sphereOf([cx, cy, F0 + r * 0.92], r, P), { tone: "hi", crease: "lo" }));
      // Handle: horns rising from the shoulders, the grip across the top.
      const hz = F0 + r * 1.55;
      const h = [[cx, cy - r * 0.55, F0 + r * 1.6], [cx, cy - r * 0.62, hz + r * 0.5], [cx, cy - r * 0.35, hz + r * 0.95], [cx, cy + r * 0.35, hz + r * 0.95], [cx, cy + r * 0.62, hz + r * 0.5], [cx, cy + r * 0.55, F0 + r * 1.6]];
      s.push(c.tube(G.fillet(h, r * 0.3), r * 0.13, { tone: "hi" }));
      s.push(`</g>`);
      return s.join("");
    };

    // --- Plyo box (plywood, 50 x 60 x 75) ------------------------------------------------------
    const plyo = () => {
      const X0 = 22, X1 = 72, Y0 = -108, Y1 = -48, H = 75;
      const s = [];
      s.push(halo({ x: X0, y: Y0, w: X1 - X0, d: Y1 - Y0, r: 2 }, F0, 2));
      s.push(`<g class="m-wood">${box(X0, Y0, F0, X1, Y1, F0 + H, { r: 0.6, steps: 2, bevel: 0.5, tone: "hi", crease: "lo" })}</g>`);
      // Ply edges: the side panels show their edges on the front face (full height lines).
      s.push(L(path3([[X1, Y0 + 1.8, F0], [X1, Y0 + 1.8, F0 + H]]) + path3([[X1, Y1 - 1.8, F0], [X1, Y1 - 1.8, F0 + H]]), { tone: "faint" }));
      // Handholds: stadium cut-outs on the front (x = X1) and side (y = Y1) faces.
      const slotX = (yc, zc) => {
        const pts = [];
        for (let i = 0; i <= 16; i++) { const a = Math.PI / 2 + (i / 16) * Math.PI; pts.push([X1, yc - 5 + Math.cos(a) * -2, zc + Math.sin(a) * 2]); }
        for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + (i / 16) * Math.PI; pts.push([X1, yc + 5 + Math.cos(a) * -2, zc + Math.sin(a) * 2]); }
        return path3(pts, true);
      };
      const slotY = (xc, zc) => {
        const pts = [];
        for (let i = 0; i <= 16; i++) { const a = Math.PI / 2 + (i / 16) * Math.PI; pts.push([xc - 5 + Math.cos(a) * 2, Y1, zc + Math.sin(a) * 2]); }
        for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + (i / 16) * Math.PI; pts.push([xc + 5 + Math.cos(a) * 2, Y1, zc + Math.sin(a) * 2]); }
        return path3(pts, true);
      };
      const slots = slotX((Y0 + Y1) / 2, F0 + H - 12) + slotY((X0 + X1) / 2, F0 + H - 12);
      s.push(`<path class="m-hole" d="${slots}"/>` + L(slots, { tone: "lo" }));
      // Screws along the top edges of the visible faces.
      const screws = [];
      for (let y = Y0 + 8; y < Y1; y += 11) screws.push(at([X1, y, F0 + H - 1.2]));
      for (let x = X0 + 6; x < X1; x += 11) screws.push(at([x, Y1, F0 + H - 1.2]));
      s.push(D(screws, { size: 0.4, tone: "mid" }));
      return s.join("");
    };

    // --- Asics Novablast pair --------------------------------------------------------------------
    // Rounded foot outline in the floor plane, heel at u = 0, toe at u = len, pointing +x.
    const footRing = (x0, y0, len, w, heel = 0.38) => {
      const ring = [];
      const rt = w / 2, rh = w * heel, cy = y0 + w / 2;
      for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI; ring.push([x0 + len - rt + Math.cos(a) * rt, cy + Math.sin(a) * rt]); }
      for (let i = 0; i <= 12; i++) { const a = Math.PI / 2 + (i / 12) * Math.PI; ring.push([x0 + rh + Math.cos(a) * rh, cy + Math.sin(a) * rh * (rt / rh) * 0.86]); }
      return ring;
    };
    const ex = (ring, z, h, cls, style = {}) => `<g class="${cls}">${S(k.extrude(ring, z, h, P, {}), { tone: "hi", crease: "lo", ...style })}</g>`;
    const shoe = (x0, y0) => {
      const s = [];
      const W = 10, LEN = 29;
      s.push(halo({ x: x0, y: y0, w: LEN, d: W, r: 4 }, F0, 1));
      s.push(ex(footRing(x0, y0, LEN, W), F0, 0.8, "m-dark"));
      s.push(ex(footRing(x0 + 0.1, y0 + 0.1, LEN - 0.2, W - 0.2), F0 + 0.8, 3.4, "m-foam"));
      // Heel counter wedge: the Novablast stack is taller at the back.
      s.push(ex(footRing(x0 + 0.2, y0 + 0.4, 11, W - 0.8, 0.45), F0 + 4.2, 0.9, "m-foam"));
      // Knit upper in three courses, each smaller and further back.
      s.push(ex(footRing(x0 + 0.6, y0 + 0.7, LEN - 1.6, W - 1.4), F0 + 4.2, 2.6, "m-knit"));
      s.push(ex(footRing(x0 + 0.8, y0 + 1.0, 21, W - 2.0, 0.42), F0 + 6.8, 2.4, "m-knit"));
      s.push(ex(footRing(x0 + 0.9, y0 + 1.3, 12, W - 2.6, 0.45), F0 + 9.2, 2.0, "m-knit"));
      // Collar opening and heel tab.
      const open = footRing(x0 + 2.2, y0 + 2.6, 8, W - 5.2, 0.5).map(([x, y]) => at([x, y, F0 + 11.22]));
      s.push(`<path class="m-hole" d="${k.pathOf(open, true)}"/>`);
      // Laces across the tongue (top of the middle course, ahead of the collar).
      let laces = "";
      for (let u = 13.5; u <= 20.5; u += 1.75) laces += k.pathOf([at([x0 + u, y0 + 2.6, F0 + 9.22]), at([x0 + u + 0.4, y0 + W - 2.6, F0 + 9.22])]);
      s.push(L(laces, { tone: "lit" }));
      // Side stripe on the visible (+y) face of the lower course.
      s.push(L(k.pathOf([at([x0 + 5, y0 + W - 0.7, F0 + 4.6]), at([x0 + 11, y0 + W - 0.7, F0 + 6.6]), at([x0 + 17, y0 + W - 0.7, F0 + 4.6])]), { tone: "lit", free: true }));
      return s.join("");
    };

    // --- Paint order: back to front ----------------------------------------------------------------
    out.push(rear());
    out.push(foot(-UY));
    out.push(sleeve(-1, 75, 110) + plate(-1) + sleeve(-1, 66.5, 69) + collar(-1));
    out.push(upright(-UY) + jcup(-UY));
    out.push(crossTop());
    out.push(foot(UY));
    out.push(upright(UY) + jcup(UY));
    out.push(vest());
    out.push(shaft());
    out.push(jcupLip(-UY) + jcupLip(UY));
    out.push(collar(1) + sleeve(1, 66.5, 69) + plate(1) + sleeve(1, 77.4, 110));
    // Floor items, sorted by depth.
    const floor = [
      { p: [45, 2, 0], svg: kettlebell(42, -22, 10.5) },
      { p: [45, 22, 0], svg: kettlebell(44, 12, 8.6) },
      { p: [47, -78, 0], svg: plyo() },
      { p: [55, 80, 0], svg: shoe(38, 63) + shoe(35, 76) },
      { p: [70, -100, 0], svg: ladder.join("") },
    ];
    out.push(...c.byDepth(floor, (f) => f.p).map((f) => f.svg));
    return out.join("");
  },
});
