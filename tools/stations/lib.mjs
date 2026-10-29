// Shared drawing context for Joshua's room stations.
// World units are centimetres. The camera is true isometric (azimuth 45, elevation 35.264),
// the same projection as the CSS floor, and every station uses one fixed scale (1 svg unit per cm).
import * as k from "../iso-kit/iso-kit.mjs";
import * as G from "../iso-kit/lathe.mjs";
import { tubePieces, tubeSvg } from "../iso-kit/tube.mjs";

export { k, G, tubePieces, tubeSvg };

export const CAM = { azimuth: 45, elevation: 35.264 };
export const SCALE = 1 / Math.sqrt(1.6);

/**
 * Define a station drawing.
 * @param {string} id
 * @param {{ label: string, bounds: number[][], pad?: number, draw: (c: object) => string, css?: string }} spec
 */
export function station(id, spec) {
  return { id, ...spec, render: () => render(id, spec) };
}

function render(id, { label, bounds, pad = 6, draw }) {
  const P0 = { origin: [0, 0], scale: SCALE, ...CAM };
  const flat = bounds.map((p) => k.iso(p, P0));
  const minX = Math.min(...flat.map((p) => p[0]));
  const maxX = Math.max(...flat.map((p) => p[0]));
  const minY = Math.min(...flat.map((p) => p[1]));
  const maxY = Math.max(...flat.map((p) => p[1]));
  const P = { ...P0, origin: [pad - minX, pad - minY] };
  const width = round(maxX - minX + pad * 2);
  const height = round(maxY - minY + pad * 2);
  const body = draw(context(P, id));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg st-${id}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label.replace(/"/g, "&quot;")}">${body}</svg>`;
  return { svg, meta: { width, height, anchor: [round(P.origin[0]), round(P.origin[1])] } };
}

const round = (n) => Math.round(n * 100) / 100;

function context(P, id) {
  let clipCount = 0;
  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (points, style) => k.dotsSvg(points, style);
  const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
  const depth = (p) => k.depthOf(p, P);
  const byDepth = (list, key = (x) => x) => [...list].sort((a, b) => depth(key(a)) - depth(key(b)));

  /** Axis-aligned rounded box from corner (x0,y0,z0) to (x1,y1,z1). */
  const box = (x0, y0, z0, x1, y1, z1, { r = 0.3, steps = 3, bevel = 0, ...style } = {}) =>
    S(k.slabOf({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r }, z0, z1 - z0, P, steps, bevel), style);

  const cyl = (cx, cy, r, z0, z1, { steps = 24, bevel = 0, ...style } = {}) =>
    S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);

  /** A prism of a convex polygon (in the u,v plane of frame F) extruded along F.a from s0 to s1. */
  const prism = (F, polygon, s0, s1, style) => S(G.prismOf(F, polygon, s0, s1, P), style);

  /** Frame helper. */
  const frame = (o, a, u, v) => G.frameOf(o, a, u, v);

  /** Transform for drawing flat on the vertical plane x = X (u runs along -y, v down). */
  const planeX = (X) => k.sideMatrix([X, 0], 0, P, "right");
  /** Transform for drawing flat on the vertical plane y = Y (u runs along +x, v down). */
  const planeY = (Y) => k.sideMatrix([0, Y], 0, P, "left");

  const halo = (plan, z = 0, h = 4) => `<path class="iso-halo" d="${k.haloOf(plan, z, h, P)}"/>`;

  /** A filled polygon through 3D points (glass, cloth, cork), with an optional outline tone. */
  const face = (points, cls, line = "lo") =>
    `<path class="${cls}" d="${path3(points, true)}"/>` + (line ? L(path3(points, true), { tone: line }) : "");

  /** A tube along 3D points, as one piece list drawn in route order. */
  const tube = (points, radius, { tone = "mid", maxLength = 400, caps = true, rings } = {}) =>
    tubePieces(points, radius, P, { maxLength, caps, rings }).map((piece) => tubeSvg(piece, { tone })).join("");

  const clipId = () => `${id}-c${clipCount++}`;

  return { P, k, G, at, S, L, D, path3, depth, byDepth, box, cyl, prism, frame, planeX, planeY, halo, face, tube, clipId };
}
