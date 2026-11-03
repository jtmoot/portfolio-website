// The window corner right of the desk: a four-pane window with a sill, two monsteras on moss poles,
// a corn plant (Dracaena fragrans) on three canes, a hosta, and a money tree (Pachira aquatica) with
// a braided trunk, all in big pots with saucers.
// Local world: wall plane x = 0, room toward +x, centred on y = 0. Centimetres.
import { station, k, G } from "./lib.mjs";

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export default station("plants", {
  label: "Joshua's plants by the window: two big monsteras on moss poles, a corn plant on three canes, a hosta and a money tree with a braided trunk, in large pots under a four-pane window.",
  bounds: [[0, -58, 0], [0, 58, 0], [72, -58, 0], [72, 58, 0], [0, -46, 212], [0, 46, 212], [40, 58, 150], [60, -58, 120], [72, 52, 130]],
  draw(c) {
    const { box, cyl, S, L, D, at, path3, halo, P } = c;
    const out = [];
    const V = G.viewOf(P);
    const rand = rng(11);

    // --- Window ---------------------------------------------------------------------------------
    const WY0 = -42, WY1 = 42, WZ0 = 92, WZ1 = 206;
    const glassPts = [[0.6, WY1, WZ0], [0.6, WY0, WZ0], [0.6, WY0, WZ1], [0.6, WY1, WZ1]];
    out.push(`<path class="m-sky" d="${path3(glassPts, true)}"/>`);
    // Light falling through: two pale diagonal bands on the glass.
    const band = (t0, t1) => path3([[0.62, WY1 - (WY1 - WY0) * t0, WZ1], [0.62, WY1 - (WY1 - WY0) * t1, WZ1], [0.62, WY1 - (WY1 - WY0) * (t1 + 0.35), WZ0], [0.62, WY1 - (WY1 - WY0) * (t0 + 0.35), WZ0]], true);
    out.push(`<clipPath id="plants-glass"><path d="${path3(glassPts, true)}"/></clipPath><g clip-path="url(#plants-glass)"><path class="m-glint" d="${band(0.1, 0.22) + band(0.3, 0.34)}"/></g>`);
    const frameBar = (y0, y1, z0, z1) => `<g class="m-paint">${box(0, y0, z0, 3.2, y1, z1, { r: 0.2, steps: 2, tone: "hi", crease: "lo" })}</g>`;
    out.push(frameBar(WY0 - 4, WY0, WZ0, WZ1 + 4));
    out.push(frameBar(WY0, WY1, WZ1, WZ1 + 4));
    out.push(frameBar(-1.2, 1.2, WZ0, WZ1));
    out.push(frameBar(WY0, WY1, (WZ0 + WZ1) / 2 - 1.2, (WZ0 + WZ1) / 2 + 1.2));
    out.push(frameBar(WY1, WY1 + 4, WZ0, WZ1 + 4));
    // Sash locks.
    out.push(D([at([3.3, -3, (WZ0 + WZ1) / 2 + 1.2]), at([3.3, 3, (WZ0 + WZ1) / 2 + 1.2])], { size: 0.5, tone: "mid" }));
    // Sill.
    out.push(`<g class="m-paint">${box(0, WY0 - 7, WZ0 - 3.5, 13, WY1 + 7, WZ0, { r: 0.6, steps: 3, bevel: 0.4, tone: "hi", crease: "lo" })}</g>`);
    // A small cutting-propagation jar on the sill.
    out.push(cyl(7, 30, 3, WZ0, WZ0 + 9, { steps: 24, tone: "hi", crease: "lo", className: "m-jar" }));
    out.push(L(k.ring(7, 30, 2.4, WZ0 + 9, P, 24), { tone: "lo" }));

    const items = [];
    const put = (p, svg) => items.push({ d: c.depth(p), svg });

    // --- Leaf helpers -------------------------------------------------------------------------------
    const leafTone = (n) => {
      const facing = G.dot3(n, V);
      const nn = facing < 0 ? G.mul3(n, -1) : n;
      const t = Math.max(0, Math.min(3, G.toneOf(nn, P) | 0));
      return facing < 0 ? `m-leaf-under` : `m-leaf-${t}`;
    };
    const basis = (yaw, pitch, roll) => {
      const d = [Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch)];
      const side0 = G.unit3(G.cross3(d, [0, 0, 1]));
      const up0 = G.cross3(side0, d);
      const e = G.add3(G.mul3(side0, Math.cos(roll)), G.mul3(up0, Math.sin(roll)));
      const n = G.unit3(G.cross3(d, e));
      return { d, e, n };
    };
    // Each leaf sways a degree or two about its own base (CSS: [data-sway] in iso.css), staggered.
    const sway = (B) => {
      const [ox, oy] = at(B);
      const delay = ((Math.abs(ox * 7.3 + oy * 3.1) % 60) / 10).toFixed(2);
      return `data-sway="" style="--ox:${ox.toFixed(1)}px;--oy:${oy.toFixed(1)}px;--sd:-${delay}s"`;
    };
    const monsteraLeaf = (B, yaw, pitch, roll, Lm, Wm) => {
      const { d, e, n } = basis(yaw, pitch, roll);
      const P3 = (s, w) => G.add3(B, G.add3(G.mul3(d, s), G.mul3(e, w)));
      const half = (t) => Wm * 0.5 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.92 + 0.08)), 0.75) * (1 - 0.15 * t);
      const cuts = [0.22, 0.36, 0.5, 0.63, 0.76];
      const side = (sign) => {
        const pts = [];
        for (let i = 0; i <= 40; i++) {
          const t = i / 40;
          const s = t * Lm;
          let w = half(t);
          const cut = cuts.find((cc) => Math.abs(t - cc) < 0.018);
          if (cut !== undefined) w *= 0.32;
          pts.push(P3(s - (t < 0.06 ? Lm * 0.06 * (1 - t / 0.06) * 0.6 : 0), sign * w));
        }
        return pts;
      };
      const right = side(1);
      const left = side(-1).reverse();
      const outline = [...right, ...left];
      let veins = k.pathOf([at(P3(0, 0)), at(P3(Lm * 0.97, 0))]);
      for (const cc of cuts) for (const sg of [1, -1]) veins += k.pathOf([at(P3(cc * Lm - 2, 0)), at(P3(cc * Lm + 2.5, sg * half(cc) * 0.3))]);
      const cls = leafTone(n);
      return { mid: P3(Lm * 0.5, 0), svg: `<g class="${cls}" ${sway(B)}><path class="m-leaf-fill" d="${k.pathOf(outline.map(at), true)}"/>${L(veins, { tone: "lo" })}${L(k.pathOf(outline.map(at), true), { tone: "hi" })}</g>` };
    };
    const strapLeaf = (B, yaw, rise, Lm, Wm) => {
      // An arching ribbon: starts rising, bends over under its own weight.
      const pts = [];
      let p = B;
      let pitch = rise;
      const segs = 14;
      for (let i = 0; i <= segs; i++) {
        pts.push(p);
        const step = Lm / segs;
        p = G.add3(p, [Math.cos(pitch) * Math.cos(yaw) * step, Math.cos(pitch) * Math.sin(yaw) * step, Math.sin(pitch) * step]);
        pitch -= 0.13;
      }
      const side = G.unit3(G.cross3([Math.cos(yaw), Math.sin(yaw), 0], [0, 0, 1]));
      const w = (t) => Wm * 0.5 * Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.9));
      const a = pts.map((q, i) => G.add3(q, G.mul3(side, w(i / segs))));
      const b = pts.map((q, i) => G.sub3(q, G.mul3(side, w(i / segs)))).reverse();
      const n = G.unit3(G.cross3(G.sub3(pts[segs >> 1], pts[0]), side));
      const cls = leafTone(n.map((x) => -x));
      const outline = [...a, ...b];
      return { mid: pts[segs >> 1], svg: `<g class="${cls}" ${sway(B)}><path class="m-leaf-fill" d="${k.pathOf(outline.map(at), true)}"/>${L(k.pathOf(pts.map(at)), { tone: "faint" })}${L(k.pathOf(outline.map(at), true), { tone: "hi" })}</g>` };
    };
    const hostaLeaf = (B, yaw, pitch, Lm, Wm) => {
      const { d, e, n } = basis(yaw, pitch, 0.15);
      const P3 = (s, w) => G.add3(B, G.add3(G.mul3(d, s), G.mul3(e, w)));
      const half = (t) => Wm * 0.5 * Math.pow(Math.sin(Math.PI * t), 0.9) * (1 + 0.25 * Math.sin(Math.PI * t * 0.7));
      const outline = [];
      for (let i = 0; i <= 30; i++) outline.push(P3((i / 30) * Lm, half(i / 30)));
      for (let i = 30; i >= 0; i--) outline.push(P3((i / 30) * Lm, -half(i / 30)));
      let ribs = "";
      for (const f of [-0.6, -0.3, 0, 0.3, 0.6]) {
        const r = [];
        for (let i = 2; i <= 28; i++) r.push(at(P3((i / 30) * Lm, half(i / 30) * f)));
        ribs += k.pathOf(r);
      }
      const cls = leafTone(n);
      return { mid: P3(Lm * 0.5, 0), svg: `<g class="${cls}" ${sway(B)}><path class="m-leaf-fill" d="${k.pathOf(outline.map(at), true)}"/>${L(ribs, { tone: "lo" })}${L(k.pathOf(outline.map(at), true), { tone: "hi" })}</g>` };
    };

    // --- Pots ---------------------------------------------------------------------------------------
    const pot = (cx, cy, r, h, cls) => {
      const s = [];
      s.push(halo({ x: cx - r, y: cy - r, w: r * 2, d: r * 2, r }, 0, 3));
      s.push(cyl(cx, cy, r + 2.2, 0, 1.6, { steps: 56, tone: "hi", crease: "lo", className: cls }));
      const F = G.frameOf([cx, cy, 1.6], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
      s.push(`<g class="${cls}">${S(G.solidOf([[0, r * 0.82], [h - 4, r], [h - 4, r + 0.6], [h, r + 0.6]], F, P), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, h - 4, r, P), { tone: "lo" }) })}</g>`);
      s.push(`<path class="m-soil" d="${k.pathOf(k.circleRing(cx, cy, r - 0.2, 48).map(([x, y]) => at([x, y, h - 1.2])), true)}"/>`);
      return s.join("");
    };
    const pole = (cx, cy, z0, z1) =>
      `<g class="m-moss">${S(G.solidOf([[0, 2.4], [z1 - z0, 2.4]], G.frameOf([cx, cy, z0], [0, 0, 1], [1, 0, 0], [0, 1, 0]), P), { tone: "hi", crease: "lo" })}</g>` +
      k.fadedSvg(G.ribsOf(G.frameOf([cx, cy, z0], [0, 0, 1], [1, 0, 0], [0, 1, 0]), 2, z1 - z0 - 2, 2.42, 10, P, { twist: 3, fade: [0.1, 0.5] }), { tone: "lo" });

    // Monstera A, left (+y), big.
    const monstera = (cx, cy, r, h, poleTop, leaves, seed) => {
      const rr = rng(seed);
      put([cx, cy, 0], pot(cx, cy, r, h, "m-ceramic"));
      put([cx - 2, cy, h], pole(cx - 3, cy, h - 2, poleTop));
      for (let i = 0; i < leaves; i++) {
        const z = h + 14 + (i / leaves) * (poleTop - h - 10);
        const yaw = (i * 2.4 + rr() * 0.6) % (Math.PI * 2);
        const reach = 10 + rr() * 8;
        const base = [cx + Math.cos(yaw) * reach * 0.4, cy + Math.sin(yaw) * reach * 0.4, z];
        const stemFrom = [cx - 1, cy, h + 2 + i * 3];
        const leaf = monsteraLeaf(base, yaw, -0.25 - rr() * 0.35, (rr() - 0.5) * 0.7, 30 + rr() * 10, 26 + rr() * 8);
        put(G.lerp3(stemFrom, base, 0.5), c.tube([stemFrom, [base[0], base[1], base[2] + 4], base], 0.55, { tone: "lo" }).replace(/class="tb"/g, 'class="tb m-stem"'));
        put(leaf.mid, leaf.svg);
      }
    };
    monstera(26, 32, 17, 34, 150, 8, 3);
    monstera(22, -30, 15, 30, 128, 7, 5);

    // Corn plant: three canes of different heights at the back centre, tufts at their tops.
    const cornX = 14, cornY = 2;
    put([cornX, cornY, 0], pot(cornX, cornY, 13, 30, "m-ceramic-dark"));
    [[0, -3, 112], [3, 3, 88], [-2.5, 3.5, 136]].forEach(([dx, dy, top], ci) => {
      const F = G.frameOf([cornX + dx, cornY + dy, 28], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
      let scars = "";
      for (let z = 6; z < top - 30; z += 7) scars += G.arcOf(F, z, 2.3, P);
      put([cornX + dx, cornY + dy, 60], `<g class="m-cane">${S(G.solidOf([[0, 2.5], [top - 28, 2.1]], F, P), { tone: "hi", crease: "lo", inner: L(scars, { tone: "lo" }) })}</g>`);
      const n = 11;
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + ci;
        const leaf = strapLeaf([cornX + dx, cornY + dy, top - 2 + (i % 3) * 3], yaw, 0.9 + rand() * 0.45, 46 + rand() * 18, 6.5);
        put(leaf.mid, leaf.svg);
      }
    });

    // Hosta: low mound in front.
    const hx = 46, hy = -2;
    put([hx, hy, 0], pot(hx, hy, 14, 22, "m-ceramic"));
    for (let i = 0; i < 14; i++) {
      const yaw = (i / 14) * Math.PI * 2 + rand() * 0.3;
      const leaf = hostaLeaf([hx + Math.cos(yaw) * 3, hy + Math.sin(yaw) * 3, 26 + (i % 4) * 2.5], yaw, 0.55 - rand() * 0.6, 22 + rand() * 6, 15 + rand() * 4);
      put(leaf.mid, leaf.svg);
    }

    // Money tree, front left: five stems braided for a turn and a half, splaying into branches that
    // each carry a couple of palm-shaped leaves (five or six leaflets on a long stalk).
    const mx = 56, my = 30, MH = 24;
    put([mx, my, 0], pot(mx, my, 11, MH, "m-ceramic"));
    const STEMS = 5, BRAID = 52, rt = rng(17);
    for (let i = 0; i < STEMS; i++) {
      const a0 = (i / STEMS) * Math.PI * 2;
      const pts = [];
      for (let z = 0; z <= BRAID; z += 4) {
        const a = a0 + (z / BRAID) * Math.PI * 3;
        const r = 1.7 - (z / BRAID) * 0.5;
        pts.push([mx + Math.cos(a) * r, my + Math.sin(a) * r, MH - 1 + z]);
      }
      // Out of the braid, each stem leans away on its own.
      const aEnd = a0 + Math.PI * 3;
      const top = MH - 1 + BRAID;
      const lean = 9 + rt() * 7;
      const tip = [mx + Math.cos(aEnd) * lean, my + Math.sin(aEnd) * lean, top + 22 + rt() * 16];
      pts.push(G.lerp3(pts.at(-1), tip, 0.5), tip);
      put([mx, my, MH + BRAID * 0.5 + i * 0.1], c.tube(pts, 0.9 - i * 0.04, { tone: "lo" }).replace(/class="tb"/g, 'class="tb m-trunk"'));
      for (let j = 0; j < 2; j++) {
        const yaw = aEnd + (j - 0.5) * 1.1 + (rt() - 0.5) * 0.4;
        const stalk = 10 + rt() * 5;
        const hub = [tip[0] + Math.cos(yaw) * stalk, tip[1] + Math.sin(yaw) * stalk, tip[2] + 4 + rt() * 4];
        put(G.lerp3(tip, hub, 0.5), c.tube([tip, G.add3(G.lerp3(tip, hub, 0.5), [0, 0, 2]), hub], 0.4, { tone: "lo" }).replace(/class="tb"/g, 'class="tb m-stem"'));
        const leaflets = 5 + (j % 2);
        for (let l = 0; l < leaflets; l++) {
          const spread = yaw + (l - (leaflets - 1) / 2) * 0.55;
          const leaf = hostaLeaf(hub, spread, -0.15 - rt() * 0.35, 13 + rt() * 4, 4.6 + rt() * 1.2);
          put(leaf.mid, leaf.svg);
        }
      }
    }

    out.push(...items.sort((a, b) => a.d - b.d).map((i) => i.svg));
    return out.join("");
  },
});
