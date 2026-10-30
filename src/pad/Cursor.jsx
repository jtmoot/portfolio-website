import { useEffect, useRef } from "react";

const finePointer = () => typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches;

/** What counts as clickable: real controls, plus elements that opt in with data-c="ring". */
const CLICKABLE = 'a[href], button, summary, [role="button"], [role="slider"], [data-c="ring"], video';
/** A station in the room: he walks there if you click, so it gets its own, quieter state. */
const AREA = ".floor-station";

/**
 * A small ink dot in place of the system cursor. Over anything clickable it shrinks to an orange
 * point while a thin orange ring springs open around it; over a station in the room the dot stays
 * ink inside a wide, faint ring. Holding the button tightens the ring.
 */
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!finePointer()) return undefined;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const dot = ref.current;
    const move = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      dot.classList.add("on");
      const hot = Boolean(e.target.closest?.(CLICKABLE));
      dot.classList.toggle("hot", hot);
      dot.classList.toggle("area", !hot && Boolean(e.target.closest?.(AREA)));
    };
    const leave = () => dot.classList.remove("on", "press");
    const down = () => dot.classList.add("press");
    const up = () => dot.classList.remove("press");
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    window.addEventListener("blur", leave);
    return () => {
      root.classList.remove("has-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
