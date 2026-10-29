import { useEffect, useRef, useState } from "react";
import { CARD, clampPreview } from "../lib/preview.js";

const finePointer = () => typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * One floating card for the whole page. Any element with data-prev (image url), data-ph
 * (placeholder text) or data-cap (caption) shows it while hovered.
 */
export default function HoverPreview() {
  const [card, setCard] = useState(null);
  const [shown, setShown] = useState(false);
  const pos = useRef({ left: 0, top: 0 });
  const el = useRef(null);
  const timer = useRef(0);

  useEffect(() => {
    if (!finePointer()) return undefined;
    const place = (e) => {
      const size = { w: CARD.w, h: el.current?.offsetHeight || CARD.h };
      pos.current = clampPreview({ x: e.clientX, y: e.clientY }, size, { w: window.innerWidth, h: window.innerHeight });
      if (el.current) el.current.style.transform = `translate(${pos.current.left}px, ${pos.current.top}px)`;
    };
    const over = (e) => {
      const t = e.target.closest?.("[data-prev],[data-ph]");
      if (!t) return;
      place(e);
      setCard({ src: t.dataset.prev || null, ph: t.dataset.ph || null, cap: t.dataset.cap || "" });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShown(true), 120);
    };
    const out = (e) => {
      const t = e.target.closest?.("[data-prev],[data-ph]");
      if (!t || t.contains(e.relatedTarget)) return;
      clearTimeout(timer.current);
      setShown(false);
    };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("mousemove", place, { passive: true });
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("mousemove", place);
    };
  }, []);

  return (
    <div ref={el} className={`preview${shown ? " on" : ""}`} aria-hidden="true">
      {card?.src ? <img src={card.src} alt="" /> : <div className="preview-ph">{card?.ph}</div>}
      {card?.cap && <div className="preview-cap hand">{card.cap}</div>}
    </div>
  );
}
