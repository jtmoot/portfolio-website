import { useCallback, useEffect, useRef } from "react";
import { FLOOR, floorToScreen, sceneBounds } from "../lib/floorView.js";
import { centreOn, stepCamera } from "../lib/camera.js";

/** How long the flip takes before the camera starts following (the paper's 1.5 s tip). */
export const SETTLE_MS = 1600;
/** Height of a standing figure's chest above his feet, in floor units: what the camera tracks. */
const CHEST = 26;

/**
 * The follow camera's page wiring. It writes the pan (in cqw, unitless) to the stage as --pan-x
 * and --pan-y, which the CSS applies to the poster and the floor overlay with `translate`. When
 * the paper tips it frames the start point (CSS eases that with the flip); once settled, follow()
 * moves it each frame. Going back to the pad resets the pan to zero.
 * @param {{ layerRef: { current: HTMLElement | null }, view: object, flipped: boolean, start: { x: number, y: number }, still: boolean }} o
 */
export function useCamera({ layerRef, view, flipped, start, still }) {
  const pan = useRef({ x: 0, y: 0 });
  const settled = useRef(false);
  const viewRef = useRef(view);
  viewRef.current = view;

  const stageOf = () => layerRef.current?.closest(".stage") || null;
  const write = useCallback((p) => {
    pan.current = p;
    const stage = stageOf();
    if (!stage) return;
    stage.style.setProperty("--pan-x", p.x === 0 ? "0" : p.x.toFixed(3));
    stage.style.setProperty("--pan-y", p.y === 0 ? "0" : p.y.toFixed(3));
  }, []);

  /** The visible part of the screen, in the floor layer's own cqw before the pan, under the nav. */
  const visible = useCallback(() => {
    const layer = layerRef.current;
    const parent = layer?.parentElement;
    const r = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
    const cqw = (layer && layer.offsetWidth / FLOOR.w) || window.innerWidth / 100;
    const nav = document.querySelector(".nav")?.getBoundingClientRect().bottom || 0;
    return {
      left: -r.left / cqw,
      top: (Math.max(0, nav) - r.top) / cqw,
      right: (window.innerWidth - r.left) / cqw,
      bottom: (window.innerHeight - r.top) / cqw,
    };
  }, [layerRef]);

  // Measured on flip and resize only: reading layout every frame, right after writing the pan,
  // would force a reflow each frame.
  const seen = useRef(null);
  useEffect(() => {
    if (!flipped) return undefined;
    const measure = () => (seen.current = visible());
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [flipped, visible]);

  useEffect(() => {
    const stage = stageOf();
    if (!flipped) {
      settled.current = false;
      if (stage) delete stage.dataset.settled;
      write({ x: 0, y: 0 });
      return undefined;
    }
    const v = viewRef.current;
    const p = floorToScreen(start, v);
    write(centreOn({ x: p.left, y: p.top - CHEST * 0.8165 * v.scale }, sceneBounds(v), visible()));
    const t = setTimeout(() => {
      settled.current = true;
      const s = stageOf();
      if (s) s.dataset.settled = "";
    }, still ? 0 : SETTLE_MS);
    return () => clearTimeout(t);
  }, [flipped, start, still, visible, write]);

  /**
   * One frame: keep the figure (its feet's screen point before the pan) in view.
   * @param {{ x: number, y: number }} feet
   * @param {number} dt seconds
   */
  const follow = useCallback(
    (feet, dt) => {
      if (!settled.current) return;
      const v = viewRef.current;
      const fig = { x: feet.x, y: feet.y - CHEST * 0.8165 * v.scale };
      const next = stepCamera(pan.current, { fig, scene: sceneBounds(v), view: seen.current || visible(), dt, still });
      if (Math.abs(next.x - pan.current.x) > 0.001 || Math.abs(next.y - pan.current.y) > 0.001) write(next);
    },
    [still, visible, write],
  );

  return { pan, follow, visible, seen: () => seen.current };
}
