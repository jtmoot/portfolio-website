import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STATIONS } from "./stations/index.js";
import Walls from "./stations/Walls.jsx";
import StationLabel from "./StationLabel.jsx";
import StationCard from "./StationCard.jsx";
import { floorToScreen, screenToFloor } from "../lib/floorView.js";
import { artPlacement } from "../lib/iso.js";
import { depthKey, nearestStation, TILE } from "../lib/floor.js";
import { standPoint, TILE_FADE_MS } from "../lib/figure.js";
import { FIGURE_START } from "../lib/travelers.js";
import { useFigure } from "./useFigure.js";
import Figure, { FIGURE_META } from "./Figure.jsx";

const FRAME_NAMES = ["idle", "w1", "w2", "w3", "w4"];
const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Stations with no margin traveler sketch themselves in a beat later. */
const LATE = new Set(["desk", "plants", "kitchen"]);

const at = (p, view, meta) => {
  const s = floorToScreen(p, view);
  const pl = artPlacement(meta);
  return { left: `${s.left + pl.left * view.scale}cqw`, top: `${s.top + pl.top * view.scale}cqw`, width: `${pl.width * view.scale}cqw` };
};

const centre = (f) => ({ x: f.x + f.w / 2, y: f.y + f.h / 2 });

/**
 * The flat overlay that holds the room drawings, positioned over the tipped paper by projecting
 * floor points through the same view as the poster's transform.
 * @param {{ view: object, flipped: boolean, onNavigate: (href: string) => void, children?: import("react").ReactNode }} props
 */
export default function Floor({ view, flipped, onNavigate, children }) {
  const [hoverId, setHoverId] = useState(null);
  const [nearId, setNearId] = useState(null);
  const [tiles, setTiles] = useState([]);
  const figureEl = useRef(null);
  const layerEl = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const lastTiles = useRef(0);
  const active = hoverId ?? nearId;

  const onFrame = useCallback((s) => {
    const el = figureEl.current;
    if (el) {
      const v = viewRef.current;
      const p = floorToScreen(s.pos, v);
      el.style.left = `${p.left}cqw`;
      el.style.top = `${p.top}cqw`;
      el.style.width = `${(FIGURE_META.width / 5) * v.scale}cqw`;
      el.style.zIndex = String(100 + Math.round((depthKey(s.pos) + 100) * 4) + 2);
      const href = `#f-${s.facing}-${FRAME_NAMES[s.frame] || "idle"}`;
      const use = el.querySelector(".figure-svg use");
      if (use && use.getAttribute("href") !== href) use.setAttribute("href", href);
      el.classList.toggle("falling", s.falling);
    }
    const near = s.falling ? null : nearestStation(s.pos, STATIONS, 5)?.id ?? null;
    setNearId((prev) => (prev === near ? prev : near));
    if ((s.tiles.size > 0 || tiles.length > 0) && (s.now - lastTiles.current > 200 || s.tiles.size === 0)) {
      lastTiles.current = s.now;
      setTiles([...s.tiles].map(([key, seen]) => ({ key, age: s.now - seen })));
    }
  }, [tiles.length]);

  const { tap, stateRef } = useFigure({ active: flipped, stations: STATIONS, start: FIGURE_START, onFrame, wander: !still() });
  if (import.meta.env.DEV && typeof window !== "undefined") window.__figure = stateRef;

  const onTap = (e) => {
    const rect = layerEl.current.getBoundingClientRect();
    const cqw = rect.width / 100;
    tap(screenToFloor({ left: (e.clientX - rect.left) / cqw, top: (e.clientY - rect.top) / cqw }, view));
  };
  const poster = typeof document !== "undefined" ? document.querySelector(".poster") : null;
  const labelSize = `${1.45 * (view.scale / 0.62)}cqw`;

  return (
    <div ref={layerEl} className="floor-layer" data-on={flipped || undefined} aria-hidden={!flipped}>
      <div className="floor-hit" onPointerDown={onTap} />
      <div className="floor-item floor-walls" style={{ ...at({ x: 0, y: 0 }, view, Walls.meta), zIndex: 1, "--d": "0.5s" }}>
        <Walls />
      </div>
      {STATIONS.map((st, i) => {
        const z = 100 + Math.round((depthKey(centre(st.footprint)) + 100) * 4);
        const delay = LATE.has(st.id) ? 1.05 + i * 0.08 : 0.85;
        const lp = floorToScreen(st.labelAt, view);
        const lift = (st.labelAt.z / 5) * 0.8165 * view.scale;
        return (
          <div
            key={st.id}
            className="floor-station"
            onPointerEnter={() => setHoverId(st.id)}
            onPointerLeave={() => setHoverId(null)}
            onPointerDown={() => tap(standPoint(st))}
          >
            <div className="floor-item" style={{ ...at(st.pos, view, st.Component.meta), zIndex: z, "--d": `${delay}s` }}>
              <st.Component active={active === st.id} />
            </div>
            <StationLabel
              text={st.label}
              active={active === st.id}
              onEnter={() => setHoverId(st.id)}
              style={{ left: `${lp.left}cqw`, top: `${lp.top - lift}cqw`, fontSize: labelSize, zIndex: 900, "--d": `${delay + 0.3}s` }}
            />
            {flipped && active === st.id && (
              <StationCard station={st} onNavigate={onNavigate} style={{ left: `${lp.left}cqw`, top: `${lp.top - lift + 1.4}cqw`, zIndex: 1000 }} />
            )}
          </div>
        );
      })}
      <Figure ref={figureEl} />
      {children}
      {poster &&
        createPortal(
          tiles.map((t) => {
            const [cx, cy] = t.key.split(",").map(Number);
            const x = cx * TILE;
            const y = cy * TILE;
            const mod = (n) => ((n % 1.6) + 1.6) % 1.6;
            return (
              <div
                key={t.key}
                className="walk-tile"
                style={{
                  left: `${x}cqw`,
                  top: `${y}cqw`,
                  opacity: Math.max(0, Math.min(1, (TILE_FADE_MS - t.age) / 1500)),
                  backgroundPosition: `${-mod(x)}cqw ${-mod(y)}cqw`,
                }}
              />
            );
          }),
          poster,
        )}
    </div>
  );
}
