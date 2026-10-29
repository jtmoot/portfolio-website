import { useCallback, useEffect, useRef } from "react";
import { initialFigure, keyToDir, standPoint, stepFigure } from "../lib/figure.js";

const typing = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/**
 * Runs the figure while `active`: a requestAnimationFrame loop, arrow keys / WASD, and taps.
 * Everything it attaches is removed when `active` turns false or the component unmounts.
 * @param {{ active: boolean, stations: object[], start: { x: number, y: number }, onFrame: (state: object) => void, wander?: boolean }} opts
 * @returns {{ tap: (p: { x: number, y: number }) => void, stateRef: { current: object } }}
 */
export function useFigure({ active, stations, start, onFrame, wander = true }) {
  const stateRef = useRef(null);
  const tapRef = useRef(null);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  if (!stateRef.current) stateRef.current = initialFigure(start);

  useEffect(() => {
    if (!active) return undefined;
    // Keyed by e.code, so Shift (which turns "w" into "W") cannot strand a key in the set.
    const held = new Map();
    const desk = stations.find((s) => s.id === "desk") || stations[0];
    const ctx = {
      stations: wander ? stations : [],
      footprints: stations.map((s) => s.footprint),
      respawn: desk ? standPoint(desk) : start,
    };
    let frame = 0;
    let last = 0;

    const dir = () => {
      let dx = 0;
      let dy = 0;
      for (const k of held.values()) {
        const d = keyToDir(k);
        if (d) {
          dx += d.dx;
          dy += d.dy;
        }
      }
      return dx || dy ? { dx, dy } : null;
    };
    const down = (e) => {
      if (typing(e.target) || e.metaKey || e.ctrlKey || e.altKey || !keyToDir(e.key)) return;
      e.preventDefault();
      held.set(e.code || e.key, e.key.length === 1 ? e.key.toLowerCase() : e.key);
    };
    const up = (e) => held.delete(e.code || e.key);
    // A keyup that happens in another window never arrives: let go of everything on blur.
    const release = () => held.clear();
    const hidden = () => document.visibilityState === "hidden" && held.clear();
    const tick = (now) => {
      const elapsed = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      let s = stateRef.current;
      if (elapsed > 0.25) {
        // Back from a hidden tab: age the world in one step without moving anyone.
        s = stepFigure(s, { dir: null, tapTarget: null }, { ...ctx, stations: [] }, Math.min(elapsed, 120));
      } else {
        s = stepFigure(s, { dir: dir(), tapTarget: tapRef.current }, ctx, elapsed);
      }
      tapRef.current = null;
      stateRef.current = s;
      onFrameRef.current(s);
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", hidden);
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [active, stations, wander, start]);

  const tap = useCallback((p) => {
    tapRef.current = p;
  }, []);

  return { tap, stateRef };
}
