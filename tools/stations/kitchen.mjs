// Joshua's kitchen run along the right wall: cabinets, a stone counter, a range with oven, a hood,
// subway-tile backsplash, a spice shelf, and braised short ribs going in an enamelled Dutch oven.
// Local world: wall plane y = 0, room toward +y, run spans x in [-90, 90]. Centimetres.
// Animated parts carry data-part="lid" | "steam" (CSS in src/styles/iso.css); the seasoning
// itself is his action (tools/stations/figure.mjs).
import { station, k, G } from "./lib.mjs";

const X0 = -90, X1 = 90, DEP = 60, CZ = 88, CT = 3.5; // counter top surface = CZ + CT
const TOP = CZ + CT;
const RANGE = { x0: -35, x1: 41 };
const POT = { x: 22, y: 44, r: 13, h: 11 };

export default station("kitchen", {
  label: "Joshua's kitchen: a range with braised short ribs in a Dutch oven on the front burner, a hood, a subway-tile backsplash, a spice shelf, and a cutting board with ribs ready to go in.",
  bounds: [[X0, 0, 0], [X1, 0, 0], [X0, DEP + 4, 0], [X1, DEP + 4, 0], [X0, 0, 232], [X1, 0, 232], [X1, DEP + 4, TOP], [POT.x, POT.y, TOP + 40]],
  draw(c) {
    const { box, cyl, S, L, D, at, path3, halo, P, frame, planeY } = c;
    const out = [];
    const items = [];
    const put = (p, svg) => items.push({ d: c.depth(p), svg });
    const Fz = (x, y, z) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);

    out.push(halo({ x: X0, y: 0, w: X1 - X0, d: DEP + 2, r: 2 }, 0, 5));

    // --- Backsplash: subway tile, brick bond, on the wall from the counter to 150 -------------------
    const BZ1 = 150;
    out.push(`<path class="m-tile" d="${path3([[X0, 0.3, TOP], [X1, 0.3, TOP], [X1, 0.3, BZ1], [X0, 0.3, BZ1]], true)}"/>`);
    let grout = "";
    for (let z = TOP + 7.5, row = 0; z < BZ1; z += 7.5, row++) grout += k.pathOf([at([X0, 0.32, z]), at([X1, 0.32, z])]);
    for (let z = TOP, row = 0; z < BZ1 - 0.1; z += 7.5, row++) {
      for (let x = X0 + (row % 2 ? 7.5 : 15); x < X1; x += 15) grout += k.pathOf([at([x, 0.32, z]), at([x, 0.32, Math.min(BZ1, z + 7.5)])]);
    }
    out.push(L(grout, { tone: "faint" }) + L(path3([[X0, 0.32, BZ1], [X1, 0.32, BZ1]]), { tone: "lo" }));

    // --- Hood: chimney and canopy over the range -----------------------------------------------------
    const HX0 = RANGE.x0 - 4, HX1 = RANGE.x1 + 4;
    out.push(`<g class="m-steel">${box(-12, 0, 172, 18, 26, 232, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    const canopy = G.prismOf(G.frameOf([HX0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]), [[0, 160], [50, 160], [50, 164], [26, 174], [0, 174]], 0, HX1 - HX0, P);
    out.push(`<g class="m-steel">${S(canopy, { tone: "hi", crease: "lo" })}</g>`);
    out.push(L(k.pathOf([at([HX0 + 4, 50, 160]), at([HX1 - 4, 50, 160])]), { tone: "lo" }));
    out.push(D([at([HX0 + 10, 50, 162]), at([HX1 - 10, 50, 162])], { size: 0.5, tone: "hi" }));

    // --- Spice shelf left of the hood -----------------------------------------------------------------
    out.push(`<g class="m-wood">${box(X0 + 2, 0, 162, HX0 - 6, 18, 165, { r: 0.4, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })}</g>`);
    for (let i = 0; i < 7; i++) {
      const x = X0 + 7 + i * 6.2;
      const h = i === 3 ? 13 : 9;
      out.push(cyl(x, 9, 2.4, 165, 165 + h, { steps: 20, tone: "hi", crease: "lo", className: "m-jar" }));
      out.push(cyl(x, 9, 2.5, 165 + h, 165 + h + 1.6, { steps: 20, tone: "hi", crease: "lo", className: i % 2 ? "m-dark" : "m-wood" }));
      out.push(`<path class="m-spice-${i % 4}" d="${k.pathOf([at([x - 2.3, 11.35, 166]), at([x + 2.3, 11.35, 166]), at([x + 2.3, 11.35, 165 + h * 0.6]), at([x - 2.3, 11.35, 165 + h * 0.6])], true)}"/>`);
    }

    // --- Cabinets either side of the range ---------------------------------------------------------
    const cabinet = (xa, xb, kind) => {
      const s = [];
      s.push(`<g class="m-dark">${box(xa + 0.5, 0, 0, xb - 1.8, DEP - 7, 10, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}</g>`);
      // End panel down to the floor, then the carcass.
      if (xb === X1) s.push(`<g class="m-paint">${box(xb - 1.8, 0, 0, xb, DEP - 1.6, 10, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}</g>`);
      s.push(`<g class="m-paint">${box(xa, 0, 10, xb, DEP - 1.6, CZ, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}</g>`);
      const fy = DEP - 1.6;
      const front = (za, zb, xa2, xb2) => `<g class="m-paint">${box(xa2 + 0.3, fy, za, xb2 - 0.3, DEP, zb, { r: 0.3, steps: 2, bevel: 0.2, tone: "hi", crease: "lo" })}</g>`;
      const pull = (xm, z) => `<g class="m-steel-dark">${box(xm - 6, DEP + 0.6, z - 0.5, xm + 6, DEP + 1.6, z + 0.5, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}</g>`;
      if (kind === "doors") {
        const mid = (xa + xb) / 2;
        s.push(front(10.5, CZ - 0.5, xa, mid) + front(10.5, CZ - 0.5, mid, xb));
        s.push(pull(mid - 5, CZ - 10).replace("xm - 6", "") + pull(mid + 5, CZ - 10));
      } else {
        const rows = [[10.5, 40], [40.5, 64], [64.5, CZ - 0.5]];
        rows.forEach(([a, b]) => { s.push(front(a, b, xa, xb)); s.push(pull((xa + xb) / 2, b - 6)); });
      }
      return s.join("");
    };
    out.push(cabinet(X0, RANGE.x0, "doors"));

    // --- Range ------------------------------------------------------------------------------------------
    const rg = [];
    rg.push(`<g class="m-steel">${box(RANGE.x0, 0, 0, RANGE.x1, DEP + 1, TOP - 1, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    // Backguard.
    rg.push(`<g class="m-steel">${box(RANGE.x0, 0, TOP - 1, RANGE.x1, 5, TOP + 9, { r: 0.4, steps: 2, bevel: 0.3, tone: "hi", crease: "lo" })}</g>`);
    // Oven door with window and handle; control strip with knobs; storage drawer.
    const FY = DEP + 1;
    const rect = (xa, xb, za, zb, y = FY + 0.02) => path3([[xa, y, za], [xb, y, za], [xb, y, zb], [xa, y, zb]], true);
    rg.push(L(rect(RANGE.x0 + 2, RANGE.x1 - 2, 12, 70), { tone: "lo" }));
    rg.push(`<path class="m-glass" d="${rect(RANGE.x0 + 10, RANGE.x1 - 10, 26, 56)}"/>` + L(rect(RANGE.x0 + 10, RANGE.x1 - 10, 26, 56), { tone: "lo" }));
    // Oven light glow and a rack line seen through the window.
    rg.push(`<path class="m-oven-glow" d="${rect(RANGE.x0 + 14, RANGE.x1 - 14, 30, 44)}"/>`);
    rg.push(L(k.pathOf([at([RANGE.x0 + 10, FY + 0.03, 40]), at([RANGE.x1 - 10, FY + 0.03, 40])]), { tone: "mid" }));
    rg.push(L(rect(RANGE.x0 + 2, RANGE.x1 - 2, 2, 10.5), { tone: "lo" }));
    rg.push(L(rect(RANGE.x0 + 2, RANGE.x1 - 2, 74, TOP - 3), { tone: "faint" }));
    for (let i = 0; i < 5; i++) {
      const x = RANGE.x0 + 9 + i * 14.5;
      const F = frame([x, FY, 82.5], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
      rg.push(`<g class="m-dark">${S(G.disc(0, 1.4, 2.1, F, P), { tone: "hi", crease: "lo" })}${S(G.disc(1.4, 2.6, 1.4, F, P), { tone: "hi", crease: "lo" })}</g>`);
      rg.push(L(k.pathOf([at([x, FY + 2.65, 82.5]), at([x, FY + 2.65, 83.9])]), { tone: "lit", free: "end" }));
    }
    // Handle on two posts.
    for (const x of [RANGE.x0 + 6, RANGE.x1 - 6]) rg.push(`<g class="m-steel">${box(x - 1, FY, 66.5, x + 1, FY + 4, 68.5, { r: 0.3, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    rg.push(`<g class="m-steel">${S(G.solidOf([[RANGE.x0 + 4, 1.1], [RANGE.x1 - 4, 1.1]], G.frameOf([0, FY + 4.5, 67.5], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P), { tone: "hi", crease: "lo" })}</g>`);
    // Tea towel over the handle.
    const towel = G.prismOf(G.frameOf([RANGE.x0 + 22, FY + 4.5, 67.5], [1, 0, 0], [0, 1, 0], [0, 0, 1]), [[-1.4, 0], [1.4, 0], [2.2, -24], [0.6, -26], [-0.4, -25]], 0, 16, P);
    rg.push(`<g class="m-towel">${S(towel, { tone: "hi", crease: "lo" })}</g>`);
    let stripes = "";
    for (const z of [-19, -21]) stripes += k.pathOf([at([RANGE.x0 + 22, FY + 6.4, 67.5 + z]), at([RANGE.x0 + 38, FY + 6.4, 67.5 + z])]);
    rg.push(L(stripes, { tone: "lo" }));

    // Cooktop: black glass deck, four burners, two cast-iron grates.
    rg.push(`<g class="m-dark">${box(RANGE.x0 + 0.5, 5, TOP - 1, RANGE.x1 - 0.5, DEP + 0.5, TOP, { r: 0.4, steps: 2, tone: "hi", crease: "lo" })}</g>`);
    const burners = [[-16, 18], [22, 18], [-16, 44], [22, 44]];
    for (const [bx, by] of burners) {
      rg.push(cyl(bx, by, 5.4, TOP, TOP + 0.8, { steps: 32, tone: "hi", crease: "lo", className: "m-steel-dark" }));
      rg.push(cyl(bx, by, 3.4, TOP + 0.8, TOP + 1.6, { steps: 24, tone: "hi", crease: "lo", className: "m-dark" }));
    }
    // The lit burner under the pot: a warm ring of flame tips.
    const flames = [];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      flames.push(at([POT.x + Math.cos(a) * 5.6, POT.y + Math.sin(a) * 5.6, TOP + 1.4]));
    }
    rg.push(`<g class="m-flame">${D(flames, { size: 0.9, tone: "hi" })}</g>`);
    const grate = (gx0, gx1) => {
      const s = [];
      const gz = TOP + 1.6;
      for (const y of [7, 31, DEP - 2]) s.push(box(gx0, y - 0.8, gz, gx1, y + 0.8, gz + 1.6, { r: 0.3, steps: 2, tone: "hi", crease: "lo" }));
      for (const x of [gx0, (gx0 + gx1) / 2, gx1 - 1.6]) s.push(box(x, 6.2, gz, x + 1.6, DEP - 1.2, gz + 1.6, { r: 0.3, steps: 2, tone: "hi", crease: "lo" }));
      return `<g class="m-iron">${s.join("")}</g>`;
    };
    rg.push(grate(RANGE.x0 + 1.5, 3) + grate(4, RANGE.x1 - 1.5));
    put([3, 30, 0], rg.join(""));

    put([65, 30, 0], cabinet(RANGE.x1, X1, "drawers"));

    // --- Counters ------------------------------------------------------------------------------------
    const counter = (xa, xb) => `<g class="m-stone">${box(xa, 0, CZ, xb, DEP + 3, TOP, { r: 0.6, steps: 3, bevel: 0.5, tone: "hi", crease: "lo" })}</g>`;
    put([-62, 30, CZ], counter(X0, RANGE.x0));
    put([66, 30, CZ], counter(RANGE.x1, X1));

    // --- Dutch oven ------------------------------------------------------------------------------------
    const PF = Fz(POT.x, POT.y, TOP + 3.2);
    const potBody = G.solidOf([[0, 10.5], [0.6, 11.8, 1], [1.8, 12.7, 1], [3.5, 13, 1], [POT.h, 13], [POT.h, 13.6]], PF, P);
    const handles = (sign) => {
      const hx = POT.x + sign * 14.6;
      return c.tube([[POT.x + sign * 12.6, POT.y - 3.2, TOP + 3.2 + POT.h - 2.6], [hx, POT.y - 3.2, TOP + 3.2 + POT.h - 2.2], [hx + sign * 1.2, POT.y, TOP + 3.2 + POT.h - 2], [hx, POT.y + 3.2, TOP + 3.2 + POT.h - 2.2], [POT.x + sign * 12.6, POT.y + 3.2, TOP + 3.2 + POT.h - 2.6]], 0.9, { tone: "hi" });
    };
    const LZ = TOP + 3.2 + POT.h;
    const LF = Fz(POT.x, POT.y, LZ);
    const lidBody = G.solidOf([[0, 13.8], [0.8, 13.8], [1.2, 13.2, 1], [2.6, 11.5, 1], [3.6, 8.5, 1], [4.2, 4.5, 1], [4.4, 0]], LF, P);
    const knob = G.solidOf([[4.1, 1.6], [5.2, 1.6], [5.4, 2.6], [7.2, 2.6], [7.4, 0]], LF, P);
    const pot = [];
    pot.push(c.halo({ x: POT.x - 12, y: POT.y - 12, w: 24, d: 24, r: 12 }, TOP + 2, 2));
    pot.push(`<g class="m-enamel">${handles(-1)}${S(potBody, { tone: "hi", crease: "lo", inner: L(G.arcOf(PF, POT.h - 1.5, 13, P), { tone: "faint" }) })}${handles(1)}</g>`);
    // Inside the pot, seen when the lid lifts: dark braise with a rib bone.
    pot.push(`<g data-part="inside"><path class="m-braise" d="${k.pathOf(k.circleRing(POT.x, POT.y, 12.6, 48).map(([x, y]) => at([x, y, LZ - 1.4])), true)}"/>` +
      L(k.pathOf([at([POT.x - 5, POT.y - 2, LZ - 1.2]), at([POT.x + 4, POT.y + 3, LZ - 1.2])]), { tone: "faint" }) + `</g>`);
    pot.push(`<g data-part="lid"><g class="m-enamel">${S(lidBody, { tone: "hi", crease: "lo", inner: L(G.arcOf(LF, 0.8, 13.8, P), { tone: "faint" }) })}</g>` +
      `<g class="m-steel">${S(knob, { tone: "hi", crease: "lo" })}</g></g>`);
    // Steam, always rising: five wisps from the lid's edge, tall enough to read at room scale.
    const wisp = (dx, dy, phase, tall) => {
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const spread = 1 + t * 1.6;
        pts.push(at([POT.x + dx + Math.sin(t * 6 + phase) * 2.6 * spread, POT.y + dy + Math.cos(t * 5 + phase) * 1.6 * spread, LZ + 6 + t * tall]));
      }
      return `<path class="m-steam" d="${k.pathOf(pts)}" pathLength="100"/>`;
    };
    pot.push(`<g data-part="steam">${wisp(-6, -4, 0, 58)}${wisp(2, -6, 1.7, 66)}${wisp(7, 2, 3.1, 52)}${wisp(-1, 5, 4.4, 62)}${wisp(5, -1, 5.6, 70)}</g>`);
    put([POT.x, POT.y, TOP + 10], pot.join(""));

    // --- Left counter: cutting board with short ribs and a knife, a crock of spoons -------------------
    const board = [];
    board.push(c.halo({ x: -82, y: 26, w: 36, d: 26, r: 2 }, TOP, 1));
    board.push(`<g class="m-wood">${box(-82, 26, TOP, -46, 52, TOP + 2.2, { r: 1.5, steps: 4, bevel: 0.4, tone: "hi", crease: "lo" })}</g>`);
    board.push(L(k.planOutline({ x: -80, y: 28, w: 32, d: 22, r: 1 }, TOP + 2.2, P, 3), { tone: "faint" }));
    for (const [rx, ry] of [[-77, 30], [-69, 31.5], [-61, 30.5]]) {
      board.push(`<g class="m-rib">${box(rx, ry, TOP + 2.2, rx + 6, ry + 9, TOP + 7, { r: 2, steps: 4, tone: "hi", crease: "lo" })}</g>`);
      board.push(`<g class="m-bone">${S(G.solidOf([[0, 1.1], [3.4, 1.1], [3.8, 1.5], [4.3, 0]], G.frameOf([rx + 3, ry + 9, TOP + 4.6], [0, 1, 0], [1, 0, 0], [0, 0, 1]), P), { tone: "hi", crease: "lo" })}</g>`);
    }
    // Knife: blade and handle along x.
    board.push(`<g class="m-steel">${S(G.prismOf(G.frameOf([-78, 45, TOP + 2.2], [0, 0, 1], [1, 0, 0], [0, 1, 0]), [[0, 0], [20, 0], [20, 3.2], [3, 4.2], [0, 1.6]], 0, 0.25, P), { tone: "hi", crease: "lo" })}</g>`);
    board.push(`<g class="m-dark">${box(-58, 45.4, TOP + 2.2, -47, 47.4, TOP + 4, { r: 0.8, steps: 3, tone: "hi", crease: "lo" })}</g>`);
    board.push(D([at([-55, 46.4, TOP + 4]), at([-50, 46.4, TOP + 4])], { size: 0.35, tone: "hi" }));
    put([-64, 40, TOP], board.join(""));

    const crock = [];
    crock.push(cyl(-80, 12, 6, TOP, TOP + 16, { steps: 40, tone: "hi", crease: "lo", className: "m-ceramic-dark" }));
    crock.push(c.tube([[-80, 12, TOP + 8], [-82, 10, TOP + 30]], 0.6, { tone: "hi" }).replace(/class="tb"/g, 'class="tb m-wood-tube"'));
    crock.push(`<g class="m-wood">${S(G.solidOf([[0, 0.3], [1, 2.2, 1], [4, 2.4, 1], [6, 0.6]], G.frameOf([-82, 10, TOP + 29], [-0.08, -0.08, 1], [1, 0, 0], [0, 1, 0]), P), { tone: "hi", crease: "lo" })}</g>`);
    crock.push(c.tube([[-78, 13, TOP + 8], [-76, 15, TOP + 27]], 0.55, { tone: "hi" }).replace(/class="tb"/g, 'class="tb m-steel-tube"'));
    put([-80, 12, TOP], crock.join(""));

    // Pepper mill, salt, oil beside the range.
    put([-45, 20, TOP], `<g class="m-wood">${S(G.solidOf([[0, 2.6], [2, 2.6], [3, 2.0, 1], [10, 1.9, 1], [13, 2.4, 1], [16, 2.4], [17, 1.6, 1], [18.5, 0.6, 1], [19, 0]], Fz(-44, 18, TOP), P), { tone: "hi", crease: "lo" })}</g>` +
      `<g class="m-glass-bottle">${S(G.solidOf([[0, 3], [16, 3], [19, 1.2, 1], [24, 1], [24, 1.2], [26, 1.2], [26.4, 0]], Fz(-48, 9, TOP), P), { tone: "hi", crease: "lo" })}</g>`);

    // --- Right counter: a bowl of onions ---------------------------------------------------------------
    const bowl = [];
    const BF = Fz(66, 36, TOP);
    bowl.push(c.halo({ x: 58, y: 28, w: 16, d: 16, r: 8 }, TOP, 1));
    bowl.push(`<g class="m-ceramic">${S(G.solidOf([[0, 4], [0.6, 4.4], [2, 7, 1], [4.5, 8.6, 1], [6.2, 9.2], [6.6, 9.2]], BF, P), { tone: "hi", crease: "lo" })}</g>`);
    for (const [ox, oy, oz] of [[64, 34, 7.5], [69, 37, 7.2], [65.5, 39.5, 8.2]]) {
      bowl.push(`<g class="m-onion">${S(G.sphereOf([ox, oy, TOP + oz], 3.4, P), { tone: "hi", crease: "lo" })}</g>`);
    }
    put([66, 36, TOP], bowl.join(""));

    out.push(...items.sort((a, b) => a.d - b.d).map((i) => i.svg));
    void planeY;
    return out.join("");
  },
});
