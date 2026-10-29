// Joshua's standing desk against the back wall.
// Local world: wall plane x = 0, room toward +x, desk spans y in [-80, 80], z up, centimetres.
// Parts: 6 acoustic panels; T-frame (2 feet, 4 glides, 2 two-stage columns, 2 side rails, crossbar);
// desktop; keypad; 2 monitors (bezel, glass, content, chin, neck, base); 2 laptops (base, deck,
// trackpad, lid, glass); 2 speakers (cabinet, tweeter, woofer, port); keyboard (wedge, 64 keys);
// mouse; boom arm (clamp, post, 2 sprung segments, 3 joints) and broadcast mic; cables.
import { station, k, G } from "./lib.mjs";

const TOP_Z = 98;
const TOP_T = 2.6;
const DESK = { x: 8, y: -80, w: 70, d: 160, r: 1.2 };
const ON = TOP_Z + TOP_T; // desk surface

export default station("desk", {
  label:
    "Joshua's standing desk: two monitors over a work laptop and a school laptop, a low keyboard and mouse, two speakers, a broadcast mic on a boom arm, and black acoustic panels on the wall behind.",
  bounds: [
    [0, -82, 0], [0, 82, 0], [80, -82, 0], [80, 82, 0],
    [0, -78, 212], [0, 78, 212], [80, 82, ON], [40, -60, 182],
  ],
  draw(c) {
    const { box, cyl, prism, frame, S, L, D, at, path3, halo, face, planeX } = c;
    const out = [];

    // Floor shadow under the whole desk.
    out.push(halo({ x: 4, y: -84, w: 78, d: 168, r: 6 }, 0, 6));

    // --- Acoustic panels: 3 x 2 bevelled black tiles on the wall --------------------------------
    const panels = [];
    for (const row of [0, 1]) {
      for (const col of [-1, 0, 1]) {
        const yc = col * 49;
        const z0 = 110 + row * 50;
        panels.push({ y0: yc - 23.5, y1: yc + 23.5, z0, z1: z0 + 47 });
      }
    }
    const P_D = 3.2; // panel depth
    const panelSvg = panels
      .map(({ y0, y1, z0, z1 }) => {
        const body = box(0, y0, z0, P_D, y1, z1, { r: 0.6, tone: "hi", crease: "lo" });
        // Bevel: inner face rectangle plus corner chamfer lines on the front face.
        const b = 4.2;
        const outer = [[P_D, y1, z0], [P_D, y0, z0], [P_D, y0, z1], [P_D, y1, z1]];
        const inner = [[P_D, y1 - b, z0 + b], [P_D, y0 + b, z0 + b], [P_D, y0 + b, z1 - b], [P_D, y1 - b, z1 - b]];
        const chamfers = outer.map((o, i) => k.pathOf([at(o), at(inner[i])])).join("");
        const faceFill = `<path class="m-panel-face" d="${path3(inner, true)}"/>`;
        // A shallow centre field, the moulded groove that makes the tile read as a panel.
        const g2 = 9.5;
        const field = [[P_D, y1 - g2, z0 + g2], [P_D, y0 + g2, z0 + g2], [P_D, y0 + g2, z1 - g2], [P_D, y1 - g2, z1 - g2]];
        return `<g class="m-dark">${body}${faceFill}${L(chamfers, { tone: "lo" })}${L(path3(inner, true), { tone: "lo" })}${L(path3(field, true), { tone: "faint" })}</g>`;
      })
      .join("");
    out.push(panelSvg);

    // --- Frame: right side (far) first, then crossbar, then left side (near) --------------------
    const side = (yc) => {
      const s = [];
      // Foot bar running front to back, with glides.
      for (const gx of [13, 73]) s.push(cyl(gx, yc, 1.6, 0, 1.2, { steps: 16, tone: "lo" }));
      s.push(box(10, yc - 3.5, 1.2, 76, yc + 3.5, 5.2, { r: 1.2, steps: 4, bevel: 0.4, tone: "mid" }));
      s.push(L(k.planOutline({ x: 12, y: yc - 1.2, w: 62, d: 2.4, r: 1.2 }, 5.2, c.P, 4), { tone: "faint" }));
      // Two-stage column: wide outer stage, slimmer inner stage above.
      s.push(box(38, yc - 4.5, 5.2, 49, yc + 4.5, 58, { r: 0.8, steps: 3, tone: "mid" }));
      s.push(box(39.2, yc - 3.4, 58, 47.8, yc + 3.4, 94, { r: 0.6, steps: 3, tone: "hi" }));
      s.push(L(k.sideSeam({ x: 38, y: yc - 4.5, w: 11, d: 9, r: 0.8 }, 50, c.P, 3), { tone: "faint" }));
      // Side rail under the top.
      s.push(box(12, yc - 2.5, 94, 74, yc + 2.5, TOP_Z, { r: 0.5, steps: 3, tone: "mid" }));
      s.push(D([at([16, yc + 2.5, 96]), at([70, yc + 2.5, 96])], { size: 0.45, tone: "mid" }));
      return s.join("");
    };
    out.push(side(-58));
    // Crossbar and motor housing between the columns.
    out.push(box(41, -54, 88, 46, 54, 93, { r: 0.5, steps: 3, tone: "mid" }));
    out.push(box(40, -12, 84, 47, 12, 88, { r: 1, steps: 3, tone: "lo" }));
    out.push(D([at([47, -9, 86]), at([47, 9, 86])], { size: 0.45, tone: "mid" }));
    // Cable tray under the back of the top.
    out.push(box(12, -46, 86, 24, 46, 87, { r: 0.4, steps: 2, tone: "lo" }));
    out.push(box(23, -46, 87, 24, 46, 92, { r: 0.2, steps: 2, tone: "lo" }));
    out.push(side(58));

    // --- Desktop ------------------------------------------------------------------------------
    out.push(halo({ x: DESK.x + 2, y: DESK.y + 2, w: DESK.w - 4, d: DESK.d - 4, r: 2 }, TOP_Z - 6, 4));
    out.push(S(k.slabOf(DESK, TOP_Z, TOP_T, c.P, 4, 0.6), {
      tone: "hi",
      crease: "lo",
      inner: L(k.sideSeam(DESK, TOP_Z + 0.9, c.P, 4), { tone: "faint" }),
    }));
    // Keypad under the front-right edge.
    out.push(box(73, -70, 94.2, 79, -56, TOP_Z, { r: 0.6, steps: 3, tone: "mid" }));
    out.push(D([[79, -68.5], [79, -66], [79, -63.5]].map(([x, y]) => at([x, y, 96.1])), { size: 0.5, tone: "hi" }));
    out.push(L(k.pathOf([at([79, -61.5, 96.9]), at([79, -57.5, 96.9])]), { tone: "hi", free: true }));

    // Items on the desk, painted back to front.
    const items = [];
    const put = (p, svg) => items.push({ d: c.depth(p), svg });

    // --- Speakers ------------------------------------------------------------------------------
    const speaker = (yc) => {
      const x0 = 11, x1 = 25, y0 = yc - 5.5, y1 = yc + 5.5, z0 = ON + 1.2, z1 = ON + 23;
      const s = [];
      for (const [px, py] of [[x0 + 2, y0 + 2], [x0 + 2, y1 - 2], [x1 - 2, y0 + 2], [x1 - 2, y1 - 2]])
        s.push(cyl(px, py, 0.9, ON, z0, { steps: 12, tone: "lo" }));
      s.push(`<g class="m-dark">${box(x0, y0, z0, x1, y1, z1, { r: 1.2, steps: 4, bevel: 0.5, tone: "hi", crease: "lo" })}</g>`);
      // Drivers on the front face (x = x1).
      const F = frame([x1, yc, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
      const ringAt = (z, r) => G.circleOf(frame([x1, yc, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, r, c.P, 40);
      s.push(`<g class="m-dark">${S(G.disc(0, 0.6, 4.4, frame([x1, yc, z0 + 7], [1, 0, 0], [0, 1, 0], [0, 0, 1]), c.P), { tone: "hi", crease: "lo" })}</g>`);
      s.push(L(ringAt(z0 + 7, 3.1), { tone: "lo" }) + L(ringAt(z0 + 7, 1.4), { tone: "mid" }));
      s.push(`<g class="m-dark">${S(G.disc(0, 0.5, 1.7, frame([x1, yc, z0 + 15.5], [1, 0, 0], [0, 1, 0], [0, 0, 1]), c.P), { tone: "hi", crease: "lo" })}</g>`);
      s.push(D([at([x1 + 0.5, yc, z0 + 15.5])], { size: 0.5, tone: "hi" }));
      s.push(L(k.pathOf([at([x1, yc - 2.6, z0 + 2.2]), at([x1, yc + 2.6, z0 + 2.2])]), { tone: "lo" }));
      void F;
      return s.join("");
    };
    put([18, 74, ON], speaker(74));
    put([18, -74, ON], speaker(-74));

    // --- Monitors ------------------------------------------------------------------------------
    const monitor = (yc, content) => {
      const s = [];
      const MX = 18, MT = 2.4, Z0 = ON + 12, H = 37, W = 62;
      // Base plate and neck (behind the panel).
      s.push(c.halo({ x: 9, y: yc - 11, w: 19, d: 22, r: 3 }, ON, 2));
      s.push(box(9, yc - 11, ON, 27, yc + 11, ON + 1.1, { r: 3, steps: 5, bevel: 0.4, tone: "mid" }));
      s.push(box(12, yc - 3.2, ON + 1.1, 15.4, yc + 3.2, Z0 + 20, { r: 0.8, steps: 3, tone: "mid" }));
      s.push(box(13.6, yc - 9, Z0 + 10, MX, yc + 9, Z0 + 27, { r: 2, steps: 4, tone: "mid" }));
      // Panel body.
      s.push(`<g class="m-dark">${box(MX, yc - W / 2, Z0, MX + MT, yc + W / 2, Z0 + H, { r: 0.5, steps: 3, tone: "hi", crease: "lo" })}</g>`);
      // Glass, inset 1 cm, with a 2 cm chin.
      const g = { y0: yc - W / 2 + 1, y1: yc + W / 2 - 1, z0: Z0 + 2.2, z1: Z0 + H - 1 };
      const X = MX + MT + 0.02;
      const glass = [[X, g.y1, g.z0], [X, g.y0, g.z0], [X, g.y0, g.z1], [X, g.y1, g.z1]];
      s.push(face(glass, "m-glass", "lo"));
      s.push(content(X, g));
      // Chin logo dot.
      s.push(D([at([X, yc, Z0 + 1.1])], { size: 0.35, tone: "mid" }));
      return s.join("");
    };
    // Left monitor: Forge dashboard (chart + table rows). Right monitor: code.
    const forge = (X, g) => {
      const u = (t) => g.y1 - (g.y1 - g.y0) * t; // 0 = left edge on screen
      const v = (t) => g.z1 - (g.z1 - g.z0) * t; // 0 = top
      const P3 = (a, b) => at([X, u(a), v(b)]);
      let d = "";
      // Sidebar rule and nav rows.
      d += k.pathOf([P3(0.18, 0), P3(0.18, 1)]);
      let rows = "";
      for (let i = 0; i < 6; i++) rows += k.pathOf([P3(0.04, 0.12 + i * 0.08), P3(0.13, 0.12 + i * 0.08)]);
      // Chart frame and curve.
      const chart = [P3(0.24, 0.1), P3(0.95, 0.1), P3(0.95, 0.56), P3(0.24, 0.56)];
      const curve = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const val = 0.5 - 0.32 * (1 - Math.exp(-3.2 * t)) + 0.03 * Math.sin(t * 19);
        curve.push(P3(0.26 + t * 0.67, val));
      }
      let table = "";
      for (let i = 0; i < 4; i++) table += k.pathOf([P3(0.24, 0.66 + i * 0.08), P3(0.95, 0.66 + i * 0.08)]);
      return (
        L(d, { tone: "lit" }) +
        L(rows, { tone: "lit", free: true }) +
        L(k.pathOf(chart, true), { tone: "lit" }) +
        `<path class="iso-line m-screen-line" data-tone="lit" d="${k.pathOf(curve)}" data-free="true"/>` +
        L(table, { tone: "lit" })
      );
    };
    const code = (X, g) => {
      const u = (t) => g.y1 - (g.y1 - g.y0) * t;
      const v = (t) => g.z1 - (g.z1 - g.z0) * t;
      const P3 = (a, b) => at([X, u(a), v(b)]);
      const lens = [0.42, 0.6, 0.35, 0.7, 0.52, 0.28, 0.64, 0.46, 0.58, 0.31, 0.5, 0.66];
      const indents = [0, 0.04, 0.08, 0.08, 0.04, 0.08, 0.12, 0.12, 0.08, 0.04, 0, 0.04];
      let d = "";
      lens.forEach((len, i) => {
        const y = 0.08 + i * 0.075;
        d += k.pathOf([P3(0.1 + indents[i], y), P3(0.1 + indents[i] + len * 0.75, y)]);
      });
      let gutter = "";
      lens.forEach((_, i) => {
        const y = 0.08 + i * 0.075;
        gutter += k.pathOf([P3(0.03, y), P3(0.06, y)]);
      });
      return L(d, { tone: "lit", free: true }) + L(gutter, { tone: "mid", free: true }) + L(k.pathOf([P3(0.08, 0), P3(0.08, 1)]), { tone: "mid" });
    };
    put([16, 31.5, ON], monitor(31.5, forge));
    put([16, -31.5, ON], monitor(-31.5, code));

    // --- Boom arm and mic (clamped to the back edge, right side) --------------------------------
    const arm = () => {
      const s = [];
      const cy = -62;
      // C-clamp around the back edge of the desktop.
      s.push(box(6, cy - 3, TOP_Z - 4, 11, cy + 3, ON + 3, { r: 0.6, steps: 3, tone: "mid" }));
      s.push(cyl(13, cy, 1.3, TOP_Z - 6, TOP_Z - 0.2, { steps: 14, tone: "mid" }));
      s.push(cyl(13, cy, 2.4, TOP_Z - 8, TOP_Z - 6, { steps: 18, tone: "lo" }));
      // Post with a swivel collar.
      s.push(cyl(8.5, cy, 1.6, ON + 3, ON + 18, { steps: 16, tone: "mid" }));
      s.push(cyl(8.5, cy, 2.2, ON + 14, ON + 18, { steps: 18, tone: "lo" }));
      const J1 = [8.5, cy, ON + 18];
      const J2 = [13, cy + 4, ON + 62];
      const J3 = [42, cy + 16, ON + 47];
      const seg = (a, b) => {
        const dir = G.unit3(G.sub3(b, a));
        const side = G.unit3(G.cross3(dir, [0, 0, 1]));
        const off = G.mul3(side, 1.1);
        const r1 = [G.add3(a, off), G.add3(b, off)];
        const r2 = [G.sub3(a, off), G.sub3(b, off)];
        return c.tube(r1, 0.55, { tone: "mid" }) + c.tube(r2, 0.55, { tone: "mid" });
      };
      const spring = (a, b) => {
        // Tension spring between the rods: a zig-zag line under the segment.
        const pts = [];
        const n = 22;
        for (let i = 0; i <= n; i++) {
          const t = 0.18 + (i / n) * 0.55;
          const p = G.lerp3(a, b, t);
          pts.push(at([p[0], p[1] + (i % 2 ? 0.9 : -0.9), p[2] - 2.2 + (i % 2 ? 0.5 : -0.5)]));
        }
        return L(k.pathOf(pts), { tone: "lo" });
      };
      const joint = (p) => S(G.disc(-1.6, 1.6, 2.1, frame(p, [0, 1, 0], [1, 0, 0], [0, 0, 1]), c.P), { tone: "mid", crease: "lo" });
      s.push(spring(J1, J2) + seg(J1, J2) + joint(J1) + joint(J2));
      s.push(spring(J2, J3) + seg(J2, J3) + joint(J3));
      // Mic: a broadcast dynamic mic hanging from a yoke at J3, pointing at the room.
      const axis = G.unit3([1, 0.2, -0.25]);
      const base = [J3[0] + 0.5, J3[1], J3[2] - 7];
      const yokeA = [J3[0], J3[1] - 4, J3[2]];
      const yokeB = [J3[0], J3[1] + 4, J3[2]];
      s.push(c.tube([J3, [J3[0], J3[1], J3[2] - 1.5]], 0.6, { tone: "mid" }));
      s.push(c.tube([[yokeA[0], yokeA[1], yokeA[2] - 1.5], yokeA, yokeB, [yokeB[0], yokeB[1], yokeB[2] - 1.5]], 0.5, { tone: "mid", caps: false }));
      s.push(c.tube([[yokeA[0], yokeA[1], yokeA[2] - 1.5], [base[0], base[1] - 4, base[2]]], 0.5, { tone: "mid" }));
      const F = frame(G.sub3(base, G.mul3(axis, 4)), axis, ...(() => {
        const u = G.unit3(G.cross3(axis, [0, 0, 1]));
        return [u, G.cross3(u, axis)];
      })());
      s.push(`<g class="m-dark">${S(G.solidOf([[0, 2.6], [1.2, 3.1, 1], [3, 3.3, 1], [11, 3.3], [11, 3.7], [13, 3.9, 1], [17, 3.9, 1], [19.2, 3.5, 1], [20.6, 2.6, 1], [21.2, 1.2, 1], [21.4, 0]], F, c.P), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, 11, 3.3, c.P) + G.arcOf(F, 3, 3.3, c.P), { tone: "faint" }) })}</g>`);
      s.push(c.tube([[base[0], base[1] + 4, base[2]], [yokeB[0], yokeB[1], yokeB[2] - 1.5]], 0.5, { tone: "mid" }));
      // XLR cable down the arm.
      const tail = G.sub3(base, G.mul3(axis, 4));
      s.push(c.tube([tail, [tail[0] - 4, tail[1] - 2, tail[2] - 4], [J2[0] + 1, J2[1] + 1, J2[2] - 6], [J1[0] + 2, J1[1] + 1.5, J1[2] + 4], [9.5, cy + 4, ON + 0.4]], 0.45, { tone: "lo" }));
      return s.join("");
    };
    put([52, -50, ON + 1], arm());

    // --- Laptops, each tethered to its monitor -------------------------------------------------
    const laptop = (y0, open = 108) => {
      const s = [];
      const X0 = 44, X1 = 65, Y1 = y0 + 31, Z = ON;
      s.push(c.halo({ x: X0 + 1, y: y0 + 1, w: 19, d: 29, r: 2 }, Z, 1.5));
      // Lid first (it stands behind the deck), hinged on the back edge and tipped back.
      const a = (open - 90) * (Math.PI / 180);
      const dir = [-Math.sin(a), Math.cos(a)];
      const back = [-Math.cos(a) * 0.6, -Math.sin(a) * 0.6];
      const L21 = 20.5;
      const poly = [[0, 0], [dir[0] * L21, dir[1] * L21], [dir[0] * L21 + back[0], dir[1] * L21 + back[1]], [back[0], back[1]]];
      const F = frame([X0 + 0.4, y0, Z + 1.3], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
      s.push(`<g class="m-alu">${prism(F, poly, 0, 31, { tone: "hi", crease: "lo" })}</g>`);
      // Screen on the lid's front face.
      const p = (t, w) => [X0 + 0.42 + dir[0] * L21 * t, y0 + w, Z + 1.3 + dir[1] * L21 * t];
      const glass = [p(0.08, 30), p(0.08, 1), p(0.95, 1), p(0.95, 30)];
      s.push(face(glass, "m-glass", "lo"));
      let rows = "";
      for (let i = 0; i < 5; i++) {
        const t = 0.82 - i * 0.13;
        rows += k.pathOf([at(p(t, 27)), at(p(t, 27 - (8 + ((i * 7) % 13))))]);
      }
      s.push(L(rows, { tone: "lit", free: true }));
      // Base: thin slab with keyboard well, key grid and trackpad.
      s.push(`<g class="m-alu">${box(X0, y0, Z, X1, Y1, Z + 1.3, { r: 1, steps: 4, bevel: 0.3, tone: "hi", crease: "lo" })}</g>`);
      const well = { x: X0 + 2, y: y0 + 2.5, w: 9.2, d: 26, r: 0.6 };
      s.push(L(k.planOutline(well, Z + 1.3, c.P, 3), { tone: "lo" }));
      let keys = "";
      for (let r = 0; r < 5; r++) {
        for (let q = 0; q < 13; q++) {
          keys += k.planOutline({ x: well.x + 0.4 + r * 1.75, y: well.y + 0.45 + q * 1.95, w: 1.45, d: 1.6, r: 0.25 }, Z + 1.3, c.P, 2);
        }
      }
      s.push(L(keys, { tone: "faint" }));
      s.push(L(k.planOutline({ x: X0 + 12.6, y: y0 + 9.5, w: 6.8, d: 12, r: 0.8 }, Z + 1.3, c.P, 3), { tone: "lo" }));
      return s.join("");
    };
    // Cables from each laptop's back-left port to its monitor base.
    const cable = (from, to) => c.tube([from, [from[0] - 4, from[1], from[2]], [to[0] + 3, to[1], to[2]], to], 0.35, { tone: "lo" });
    put([48, 34, ON], cable([44.5, 38, ON + 0.6], [26, 34, ON + 0.6]) + laptop(36));
    put([48, -66, ON], cable([44.5, -40, ON + 0.6], [26, -36, ON + 0.6]) + laptop(-67));

    // --- Felt desk mat under the keyboard and mouse ---------------------------------------------
    put([30, -40, ON], `<g class="m-felt">${box(48, -34, ON, 70, 20, ON + 0.3, { r: 1.5, steps: 4, tone: "hi", crease: "lo" })}</g>` +
      L(k.planOutline({ x: 49.2, y: -32.8, w: 19.6, d: 51.6, r: 1 }, ON + 0.3, c.P, 3), { tone: "faint" }));

    // --- Mug, left of the keyboard -------------------------------------------------------------
    const mug = () => {
      const s = [];
      s.push(c.halo({ x: 61, y: 23, w: 8, d: 8, r: 4 }, ON, 1));
      s.push(cyl(65, 27, 4, ON, ON + 9.5, { steps: 40, bevel: 0, tone: "hi", crease: "lo" }));
      s.push(L(k.ring(65, 27, 3.4, ON + 9.5, c.P, 40), { tone: "lo" }));
      s.push(`<path class="m-coffee" d="${k.pathOf(k.circleRing(65, 27, 3.35, 40).map(([x, y]) => at([x, y, ON + 8.6])), true)}"/>`);
      s.push(L(k.sideArc(65, 27, 4, ON + 1.2, c.P, 24), { tone: "faint" }));
      // Handle on the +x side, a flat D loop.
      s.push(c.tube([[68.6, 28.6, ON + 7.8], [71.4, 29.6, ON + 7.2], [71.6, 29.8, ON + 3.2], [68.6, 28.6, ON + 2.4]], 0.65, { tone: "hi" }));
      return s.join("");
    };
    put([65, 27, ON], mug());

    // --- Keyboard: low aluminium wedge with 5 rows of keys ------------------------------------
    const keyboard = () => {
      const s = [];
      const X0 = 52, X1 = 63.5, Y0 = -14, Y1 = 14;
      const zb = (x) => ON + 0.9 - ((x - X0) / (X1 - X0)) * 0.5; // top surface height
      const F = frame([0, Y0, ON], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
      s.push(c.halo({ x: X0, y: Y0, w: X1 - X0, d: Y1 - Y0, r: 1 }, ON, 1));
      s.push(`<g class="m-alu">${prism(F, [[X0, 0], [X1, 0], [X1, 0.4], [X0, 0.9]], 0, Y1 - Y0, { tone: "hi", crease: "lo" })}</g>`);
      let keys = "";
      const rows = 5;
      for (let r = 0; r < rows; r++) {
        const x = X0 + 0.8 + r * 2.05;
        const n = 14;
        for (let q = 0; q < n; q++) {
          const y = Y0 + 0.7 + q * 1.9;
          const w = r === 4 && q > 3 && q < 10 ? 0 : 1.6;
          if (!w) continue;
          const z = zb(x + 0.8) + 0.02;
          keys += k.pathOf([at([x, y, z]), at([x, y + 1.6, z]), at([x + 1.7, y + 1.6, z - 0.07]), at([x + 1.7, y, z - 0.07])], true);
        }
      }
      // Space bar.
      const xs = X0 + 0.8 + 4 * 2.05;
      const zs = zb(xs + 0.8) + 0.02;
      keys += k.pathOf([at([xs, Y0 + 0.7 + 4 * 1.9, zs]), at([xs, Y0 + 0.7 + 9 * 1.9 + 1.6, zs]), at([xs + 1.7, Y0 + 0.7 + 9 * 1.9 + 1.6, zs]), at([xs + 1.7, Y0 + 0.7 + 4 * 1.9, zs])], true);
      s.push(`<path class="m-keys" d="${keys}"/>`);
      s.push(L(keys, { tone: "lo" }));
      return s.join("");
    };
    put([57, 0, ON], keyboard());

    // --- Mouse ---------------------------------------------------------------------------------
    const mouse = () =>
      c.halo({ x: 56, y: -29, w: 11, d: 5.8, r: 2.9 }, ON, 1) +
      `<g class="m-alu">${box(56, -29, ON, 67, -23.2, ON + 0.9, { r: 2.8, steps: 8, tone: "hi", crease: "lo" })}` +
      box(56.8, -28.3, ON + 0.9, 66.2, -23.9, ON + 1.7, { r: 2.1, steps: 8, tone: "hi", crease: "faint" }) + `</g>` +
      L(k.lineOnTop([57.5, -26.1], [61.2, -26.1], ON + 1.7, c.P), { tone: "faint" });
    put([61, -26, ON], mouse());

    out.push(...items.sort((a, b) => a.d - b.d).map((i) => i.svg));
    return out.join("");
  },
});
