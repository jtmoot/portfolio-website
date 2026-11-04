import { useEffect, useRef } from "react";
import svg from "./art/chess.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";
import { MATE } from "../../lib/chessMate.js";

const Art = artComponent("chess", svg);

/** After he reaches the table: the queen lifts and glides to g7 (in step with his reach)... */
export const MATE_AFTER_MS = 1300;
/** ...then the black king tips over... */
export const KING_AFTER_MS = 1100;
/** ...and once he walks away the board is set back up. */
export const RESET_AFTER_MS = 1500;
const GLIDE_MS = 900;
const LIFT_CM = 6;

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const sq = (s) => s.split(",").map(Number);

/**
 * The chess table. When he stands at it (`active`), he plays Qxg7#: the queen glides with a small
 * lift onto g7, the bishop there goes, and the black king tips over. When he leaves, the pieces
 * go back. Pieces are groups tagged with their square (data-sq); moves are screen-space
 * translations by whole ranks and files (data-chess-step in the drawing).
 * @param {{ active?: boolean }} props
 */
function Chess({ active = false }) {
  const host = useRef(null);
  const board = useRef(null);

  useEffect(() => {
    const root = host.current;
    if (!root || still()) return undefined;
    const meta = root.querySelector("[data-chess-step]")?.getAttribute("data-chess-step");
    const queen = root.querySelector(`[data-sq="${MATE.from}"]`);
    const taken = root.querySelector(`[data-sq="${MATE.to}"]`);
    const king = root.querySelector(`[data-sq="${MATE.king}"]`);
    if (!meta || !queen || !king) return undefined;
    const [rx, ry, fx, fy, zy] = meta.split(",").map(Number);
    const [r0, f0] = sq(MATE.from);
    const [r1, f1] = sq(MATE.to);
    const dest = { x: (r1 - r0) * rx + (f1 - f0) * fx, y: (r1 - r0) * ry + (f1 - f0) * fy };
    const t = (p) => `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px)`;
    const home = { x: 0, y: 0 };
    const mid = { x: dest.x / 2, y: dest.y / 2 + LIFT_CM * zy };
    king.style.transformBox = "fill-box";
    king.style.transformOrigin = "50% 100%";
    const glide = (a, b) =>
      queen.animate?.([{ transform: t(a) }, { transform: t(mid), offset: 0.5 }, { transform: t(b) }], { duration: GLIDE_MS, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" });
    const fade = (el, from, to, delay = 0) => el?.animate?.([{ opacity: from }, { opacity: to }], { duration: 350, delay, fill: "forwards" });
    const tip = (from, to) => king.animate?.([{ transform: `rotate(${from}deg)` }, { transform: `rotate(${to}deg)` }], { duration: 650, easing: "cubic-bezier(.5,0,.75,1)", fill: "forwards" });
    let timers = [];
    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };
    board.current = {
      play() {
        clear();
        if (queen.dataset.at === MATE.to) return;
        timers.push(
          setTimeout(() => {
            glide(home, dest);
            fade(taken, 1, 0, GLIDE_MS * 0.7);
            queen.dataset.at = MATE.to;
            if (taken) taken.dataset.taken = "";
          }, MATE_AFTER_MS),
          setTimeout(() => {
            tip(0, -78);
            king.dataset.fallen = "";
          }, MATE_AFTER_MS + KING_AFTER_MS),
        );
      },
      reset() {
        clear();
        timers.push(
          setTimeout(() => {
            if (queen.dataset.at === MATE.to) glide(dest, home);
            if (taken?.hasAttribute("data-taken")) fade(taken, 0, 1, GLIDE_MS * 0.4);
            if (king.hasAttribute("data-fallen")) tip(-78, 0);
            queen.dataset.at = MATE.from;
            delete taken?.dataset.taken;
            delete king.dataset.fallen;
          }, RESET_AFTER_MS),
        );
      },
    };
    queen.dataset.at = MATE.from;
    return () => {
      clear();
      board.current = null;
    };
  }, []);

  useEffect(() => {
    if (active) board.current?.play();
    else board.current?.reset();
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
