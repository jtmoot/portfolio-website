/**
 * Dot radius for a halftone cell.
 * @param {number} lum 0 (black) to 1 (white)
 * @param {number} cell cell size in px
 */
export function dotRadius(lum, cell) {
  return Math.max(0.35, (1 - lum) * cell * 0.72);
}

/** True for the near-white paper an object was photographed on. */
export function isNearWhite(r, g, b, t = 235) {
  return 0.299 * r + 0.587 * g + 0.114 * b >= t;
}

/**
 * Draws a die-cut halftone sticker of `image` onto `canvas`: the white background is cut away,
 * a 6 px white border is stamped around the shape, and the rest is printed in ink dots.
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasImageSource & { width: number, height: number }} image
 * @param {{ cell?: number, crop?: number[], width?: number, ink?: string }} [opts]
 */
export function renderSticker(canvas, image, { cell = 2.4, crop = [0, 0, 1, 1], width = 260, ink = "#2a2a27" } = {}) {
  const [cx, cy, cw, ch] = crop;
  const sx = image.width * cx, sy = image.height * cy, sw = image.width * cw, sh = image.height * ch;
  const W = width, H = Math.round((W * sh) / sw), pad = 10;
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const o = off.getContext("2d", { willReadFrequently: true });
  o.drawImage(image, sx, sy, sw, sh, 0, 0, W, H);
  const d = o.getImageData(0, 0, W, H).data;
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const m = mask.getContext("2d");
  const mi = m.createImageData(W, H);
  for (let i = 0; i < W * H; i++) {
    const k = i * 4;
    const inside = d[k + 3] > 40 && !isNearWhite(d[k], d[k + 1], d[k + 2], 238);
    mi.data[k] = mi.data[k + 1] = mi.data[k + 2] = 255;
    mi.data[k + 3] = inside ? 255 : 0;
  }
  m.putImageData(mi, 0, 0);
  canvas.width = W + pad * 2;
  canvas.height = H + pad * 2;
  const g = canvas.getContext("2d");
  for (let t = 0; t < 24; t++) {
    const a = (t / 24) * Math.PI * 2;
    g.drawImage(mask, pad + Math.cos(a) * 6, pad + Math.sin(a) * 6);
  }
  g.drawImage(mask, pad, pad);
  g.fillStyle = ink;
  for (let y = 0; y < H; y += cell) {
    for (let x = 0; x < W; x += cell) {
      const k = ((y | 0) * W + (x | 0)) * 4;
      if (mi.data[k + 3] === 0) continue;
      const l = (0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]) / 255;
      g.beginPath();
      g.arc(pad + x + cell / 2, pad + y + cell / 2, dotRadius(l, cell), 0, Math.PI * 2);
      g.fill();
    }
  }
}
