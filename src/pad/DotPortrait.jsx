import { useEffect, useRef, useState } from "react";

const N = 64; // dots per side
const S = 320; // canvas resolution
const REPEL = 54; // px of canvas space

/**
 * Halftone headshot drawn as dots; the dots part around the cursor and spring back.
 * @param {{ src: string, alt: string }} props
 */
export default function DotPortrait({ src, alt }) {
  const ref = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext?.("2d");
    if (!ctx) {
      setFallback(true);
      return undefined;
    }
    cv.width = S;
    cv.height = S;
    const dots = [];
    const mouse = { x: -9999, y: -9999 };
    let frame = 0;
    let alive = true;
    const ink = () => getComputedStyle(cv).getPropertyValue("--ink").trim() || "#2a2a28";

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      ctx.fillStyle = ink();
      let moving = false;
      for (const p of dots) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL) {
          const f = (REPEL - dist) / REPEL;
          p.x += (dx / (dist || 1)) * f * 6;
          p.y += (dy / (dist || 1)) * f * 6;
        }
        p.x += (p.ox - p.x) * 0.08;
        p.y += (p.oy - p.y) * 0.08;
        if (Math.abs(p.x - p.ox) > 0.05 || Math.abs(p.y - p.oy) > 0.05) moving = true;
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
      const side = Math.min(img.width, img.height);
      o.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, N, N);
      const d = o.getImageData(0, 0, N, N).data;
      const cell = S / N;
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const k = (y * N + x) * 4;
          const lum = (0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]) / 255;
          const r = (1 - lum) * cell * 0.62;
          if (r > 0.35) dots.push({ ox: x * cell + cell / 2, oy: y * cell + cell / 2, x: x * cell + cell / 2, y: y * cell + cell / 2, r });
        }
      }
      kick();
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
    const theme = new MutationObserver(kick);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerleave", leave);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      theme.disconnect();
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerleave", leave);
    };
  }, [src]);

  if (fallback) return <img className="portrait-img" src={src} alt={alt} />;
  return <canvas ref={ref} className="portrait-dots" role="img" aria-label={alt} />;
}
