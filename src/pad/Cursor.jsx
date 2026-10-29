import { useEffect, useRef } from "react";

const finePointer = () => typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches;

/** A small ink dot in place of the system cursor; it opens into a ring over anything clickable. */
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
      const hit = e.target.closest?.("a, button, [data-c], video, canvas");
      dot.classList.toggle("ring", Boolean(hit));
    };
    const leave = () => dot.classList.remove("on");
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      root.classList.remove("has-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
