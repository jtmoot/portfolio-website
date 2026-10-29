import { useState } from "react";
import { STATIONS } from "./stations/index.js";
import Walls from "./stations/Walls.jsx";
import StationLabel from "./StationLabel.jsx";
import StationCard from "./StationCard.jsx";
import { floorToScreen } from "../lib/floorView.js";
import { artPlacement } from "../lib/iso.js";
import { depthKey } from "../lib/floor.js";

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
 * @param {{ view: object, flipped: boolean, activeId?: string | null, onNavigate: (href: string) => void, children?: import("react").ReactNode }} props
 */
export default function Floor({ view, flipped, activeId = null, onNavigate, children }) {
  const [hoverId, setHoverId] = useState(null);
  const active = activeId ?? hoverId;
  const labelSize = `${1.45 * (view.scale / 0.62)}cqw`;

  return (
    <div className="floor-layer" data-on={flipped || undefined} aria-hidden={!flipped}>
      <div className="floor-item floor-walls" style={{ ...at({ x: 0, y: 0 }, view, Walls.meta), zIndex: 1, "--d": "0.5s" }}>
        <Walls />
      </div>
      {STATIONS.map((st, i) => {
        const z = 100 + Math.round((depthKey(centre(st.footprint)) + 100) * 4);
        const delay = LATE.has(st.id) ? 1.05 + i * 0.08 : 0.85;
        const lp = floorToScreen(st.labelAt, view);
        const lift = (st.labelAt.z / 5) * 0.8165 * view.scale;
        const top = floorToScreen(centre(st.footprint), view);
        return (
          <div key={st.id} className="floor-station" onPointerEnter={() => setHoverId(st.id)} onPointerLeave={() => setHoverId(null)}>
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
              <StationCard station={st} onNavigate={onNavigate} style={{ left: `${top.left}cqw`, top: `${top.top - 14 * view.scale}cqw`, zIndex: 1000 }} />
            )}
          </div>
        );
      })}
      {children}
    </div>
  );
}
