import { useEffect, useRef } from "react";
import svg from "./art/chess.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";
import { LINE, stepsOf } from "../../lib/chessReplay.js";

const Art = artComponent("chess", svg);

/** One move every 4 s, gliding with a small lift. */
export const MOVE_MS = 4000;
const GLIDE_MS = 900;
const LIFT_CM = 5;
const STEPS = stepsOf(LINE);

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const sq = (s) => s.split(",").map(Number);

/**
 * The chess table, with the game slowly replaying: each piece is a group tagged with its home
 * square (data-sq); a move translates it in screen space by whole ranks and files, lifting on the
 * way. `active` (him standing at the table) plays the next move straight away.
 * @param {{ active?: boolean }} props
 */
function Chess({ active = false }) {
  const host = useRef(null);
  const next = useRef(() => {});

  useEffect(() => {
    const root = host.current;
    if (!root || still()) return undefined;
    const meta = root.querySelector("[data-chess-step]")?.getAttribute("data-chess-step");
    if (!meta) return undefined;
    const [rx, ry, fx, fy, zy] = meta.split(",").map(Number);
    const offset = (home, at) => {
      const [r0, f0] = sq(home);
      const [r1, f1] = sq(at);
      return { x: (r1 - r0) * rx + (f1 - f0) * fx, y: (r1 - r0) * ry + (f1 - f0) * fy };
    };
    const bySquare = new Map();
    for (const el of root.querySelectorAll("[data-sq]")) {
      el.dataset.at = el.dataset.sq;
      bySquare.set(el.dataset.sq, el);
    }
    const t = (p) => `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px)`;
    let i = 0;
    const play = () => {
      if (document.hidden) return;
      const s = STEPS[i];
      i = (i + 1) % STEPS.length;
      const el = bySquare.get(s.from);
      if (!el || typeof el.animate !== "function") return;
      const home = el.dataset.sq;
      const a = offset(home, s.from);
      const b = offset(home, s.to);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + LIFT_CM * zy };
      el.animate([{ transform: t(a) }, { transform: t(mid), offset: 0.5 }, { transform: t(b) }], { duration: GLIDE_MS, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" });
      bySquare.delete(s.from);
      if (s.captured && !s.undo) {
        const taken = bySquare.get(s.to);
        taken?.animate?.([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: GLIDE_MS * 0.7, fill: "forwards" });
        if (taken) {
          taken.dataset.taken = s.to;
          bySquare.delete(s.to);
        }
      }
      if (s.captured && s.undo) {
        const back = root.querySelector(`[data-taken="${s.captured}"]`);
        if (back) {
          back.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: GLIDE_MS * 0.5, fill: "forwards" });
          delete back.dataset.taken;
          bySquare.set(s.captured, back);
        }
      }
      el.dataset.at = s.to;
      bySquare.set(s.to, el);
    };
    next.current = play;
    const timer = setInterval(play, MOVE_MS);
    return () => {
      clearInterval(timer);
      next.current = () => {};
    };
  }, []);

  useEffect(() => {
    if (active) next.current();
  }, [active]);

  return (
    <div ref={host}>
      <Art active={active} />
    </div>
  );
}
Chess.meta = Art.meta;

export const station = { ...LAYOUT.chess, Component: Chess };

export default Chess;
