import { useEffect, useRef, useState } from "react";

/** Dots per side: fine enough to read as a photo, coarse enough to stay a drawing. */
export const DOTS = 96;
const N = DOTS;
const S = 480; // the drawing's own coordinates; the canvas is scaled to its real size on screen
const MAX_PX = 1600; // the largest canvas side we redraw at, whatever the card's size and screen
const REPEL = 80; // in drawing coordinates
const MIN_R = 0.75; // smaller dots are dropped, so the paper-white background stays clean
const PAPER = 0.92; // lighter than this is background: no dot
const SHADE = 0.86; // each dot keeps the photo's colour, a touch deeper so it reads as ink on paper

/**
 * How many canvas pixels a side, for a card `css` px wide on a screen with `dpr` device pixels per
 * px: one per device pixel, so the dots are drawn sharp instead of a fixed canvas being scaled.
 * @param {number} css the canvas's laid-out width
 * @param {number} dpr window.devicePixelRatio
 * @returns {number}
 */
export function backingSize(css, dpr) {
  if (!(css > 0)) return S;
  return Math.min(Math.round(css * dpr), MAX_PX);
}

/**
 * Halftone headshot drawn as dots in the photo's own colours (skin, hair, shirt), sized by
 * darkness; the dots part around the cursor and spring back. onReady fires once there is something
 * to see: the first frame of dots, or the plain photo (loaded or not) when there's no canvas.
 * @param {{ src: string, alt: string, onReady?: () => void }} props
 */
export default function DotPortrait({ src, alt, onReady }) {
  const ref = useRef(null);
  const [fallback, setFallback] = useState(false);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext?.("2d");
    if (!ctx) {
      setFallback(true);
      return undefined;
    }
    // Sizing the canvas clears it and resets its transform, so the scale is set again every time.
    const fit = () => {
      const px = backingSize(cv.getBoundingClientRect().width, window.devicePixelRatio || 1);
      if (cv.width !== px) {
        cv.width = px;
        cv.height = px;
      }
      ctx.setTransform(px / S, 0, 0, px / S, 0, 0);
    };
    fit();
    const dots = [];
    const mouse = { x: -9999, y: -9999 };
    let frame = 0;
    let alive = true;

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      let moving = false;
      for (const p of dots) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL) {
          const f = (REPEL - dist) / REPEL;
          p.x += (dx / (dist || 1)) * f * 9;
          p.y += (dy / (dist || 1)) * f * 9;
        }
        p.x += (p.ox - p.x) * 0.08;
        p.y += (p.oy - p.y) * 0.08;
        if (Math.abs(p.x - p.ox) > 0.05 || Math.abs(p.y - p.oy) > 0.05) moving = true;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = alive && (moving || mouse.x > -9000) ? requestAnimationFrame(draw) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const img = new Image();
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = N;
      off.height = N;
      const o = off.getContext("2d");
      o.imageSmoothingEnabled = true;
      o.imageSmoothingQuality = "high";
      const side = Math.min(img.width, img.height);
      o.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, N, N);
      const d = o.getImageData(0, 0, N, N).data;
      const cell = S / N;
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const k = (y * N + x) * 4;
          const lum = (0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]) / 255;
          // Light skin still gets a small dot, so the face keeps its colour instead of washing out.
          const r = lum < PAPER ? (1 - lum ** 1.25) * cell * 0.66 + cell * 0.18 : 0;
          const color = `rgb(${Math.round(d[k] * SHADE)},${Math.round(d[k + 1] * SHADE)},${Math.round(d[k + 2] * SHADE)})`;
          if (r > MIN_R) dots.push({ ox: x * cell + cell / 2, oy: y * cell + cell / 2, x: x * cell + cell / 2, y: y * cell + cell / 2, r, color });
        }
      }
      kick();
      ready.current?.();
    };
    img.onerror = () => setFallback(true);
    img.src = src;

    const move = (e) => {
      const r = cv.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) * S) / r.width;
      mouse.y = ((e.clientY - r.top) * S) / r.height;
      kick();
    };
    const leave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      kick();
    };
    const resized = () => {
      fit();
      kick();
    };
    const size = typeof ResizeObserver === "function" ? new ResizeObserver(resized) : null;
    size?.observe(cv);
    // A move to a screen with a different pixel density resizes the window, not the canvas.
    window.addEventListener("resize", resized);
    const theme = new MutationObserver(kick);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerleave", leave);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      theme.disconnect();
      size?.disconnect();
      window.removeEventListener("resize", resized);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerleave", leave);
    };
  }, [src]);

  if (fallback) return <img className="portrait-img" src={src} alt={alt} onLoad={() => onReady?.()} onError={() => onReady?.()} />;
  return <canvas ref={ref} className="portrait-dots" role="img" aria-label={alt} />;
}
