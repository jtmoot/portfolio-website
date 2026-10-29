import { useEffect, useRef } from "react";
import { renderSticker } from "../lib/halftone.js";

const PROPS = ["fill", "stroke", "stroke-width", "opacity", "fill-opacity", "stroke-opacity", "stroke-dasharray", "stroke-linecap", "stroke-linejoin"];

/** Serialises an on-page SVG with its computed paint inlined, so it can be drawn into a canvas. */
function flatten(svg) {
  const clone = svg.cloneNode(true);
  const src = svg.querySelectorAll("*");
  const dst = clone.querySelectorAll("*");
  src.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const style = PROPS.map((p) => `${p}:${cs.getPropertyValue(p)}`).join(";");
    dst[i].setAttribute("style", style + (el.classList.contains("iso-halo") ? ";display:none" : ""));
  });
  const vb = svg.viewBox.baseVal;
  clone.setAttribute("width", String(vb.width * 4));
  clone.setAttribute("height", String(vb.height * 4));
  return new XMLSerializer().serializeToString(clone);
}

/**
 * A die-cut halftone sticker. Pass `src` (a photo on white) or `Art` (a station drawing component).
 * @param {{ src?: string, Art?: Function, cell?: number, crop?: number[], alt: string }} props
 */
export default function Sticker({ src, Art, cell = 2.4, crop, alt }) {
  const canvas = useRef(null);
  const art = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled && canvas.current) renderSticker(canvas.current, img, { cell, crop });
    };
    img.onerror = () => {
      if (canvas.current) canvas.current.dataset.failed = "true";
    };
    if (src) {
      img.src = src;
    } else {
      const svg = art.current?.querySelector("svg");
      if (!svg) return undefined;
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(flatten(svg))}`;
    }
    return () => {
      cancelled = true;
    };
  }, [src, cell, crop]);

  return (
    <>
      {Art && (
        <div ref={art} className="sticker-source" aria-hidden="true">
          <Art />
        </div>
      )}
      <canvas ref={canvas} className="sticker" role="img" aria-label={alt} />
    </>
  );
}
