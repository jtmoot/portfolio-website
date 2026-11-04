import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STATIONS, paintBoxes } from "./stations/index.js";
import Walls from "./stations/Walls.jsx";
import StationLabel from "./StationLabel.jsx";
import StationCard from "./StationCard.jsx";
import { floorToScreen, screenToFloor } from "../lib/floorView.js";
import { artPlacement } from "../lib/iso.js";
import { nearestStation, paintOrder, TILE } from "../lib/floor.js";
import { frameName, HELLO_FADE_MS, OVER_POSES, saying, standPoint, TILE_FADE_MS } from "../lib/figure.js";
import { FIGURE_START } from "../lib/travelers.js";
import { useFigure } from "./useFigure.js";
import Figure, { FIGURE_META } from "./Figure.jsx";
import SpeedWheel from "./SpeedWheel.jsx";
import { useLinger } from "./useLinger.js";
import { useCamera } from "./useCamera.js";
import StationArrow from "./StationArrow.jsx";
import { loadSpeed, saveSpeed } from "../lib/speed.js";
import { greetingFor, loadGreeting } from "../lib/greeting.js";

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Stations with no margin traveler sketch themselves in a beat later. */
const LATE = new Set(["desk", "plants", "kitchen", "reading"]);

const at = (p, view, meta) => {
  const s = floorToScreen(p, view);
  const pl = artPlacement(meta);
  return { left: `${s.left + pl.left * view.scale}cqw`, top: `${s.top + pl.top * view.scale}cqw`, width: `${pl.width * view.scale}cqw` };
};

/** z-index for each id in a paint order (stations and "figure"), from back to front. */
const zMap = (order) => new Map(order.map((id, i) => [id, 100 + i * 10]));
const PAINT = paintBoxes(STATIONS);
const START_Z = zMap(paintOrder(PAINT, FIGURE_START));
/** Stations with a label and a card (the anatomy chart is just a picture on the wall). */
const LABELLED = STATIONS.filter((s) => s.label);
/** How far inside the screen edge an off-screen station's arrow sits, in cqw. */
const EDGE = 1.2;

/**
 * The flat overlay that holds the room drawings, positioned over the tipped paper by projecting
 * floor points through the same view as the poster's transform.
 * @param {{ view: object, flipped: boolean, onNavigate: (href: string) => void, children?: import("react").ReactNode, posterSelector?: string }} props
 */
export default function Floor({ view, flipped, onNavigate, children, posterSelector = ".poster" }) {
  const hover = useLinger();
  const hoverId = hover.id;
  // The layer turns on one frame after it is in the DOM with the paper tipping, so the browser has
  // its resting style (hidden, clipped) before the sketch-in transitions start. Born with data-on,
  // as it was on every first entry, the drawings popped in at once onto a still-flat sheet.
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!flipped) {
      setOn(false);
      return undefined;
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setOn(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [flipped]);
  const [speed, setSpeed] = useState(loadSpeed);
  const changeSpeed = (v) => {
    setSpeed(v);
    saveSpeed(v);
  };
  const [nearId, setNearId] = useState(null);
  const [tiles, setTiles] = useState([]);
  const figureEl = useRef(null);
  const overEl = useRef(null);
  const zNow = useRef(START_Z);
  const bubbleEl = useRef(null);
  const [hello, setHello] = useState(() => greetingFor(null));
  // "Hello, Pittsburgh!": the city from the site's /api/hello, else the time zone.
  useEffect(() => {
    if (!flipped) return undefined;
    let live = true;
    loadGreeting().then((text) => live && setHello(text));
    return () => {
      live = false;
    };
  }, [flipped]);
  // Back on the pad the frame loop stops, so nothing else would clear the hello bubble.
  useEffect(() => {
    if (!flipped && bubbleEl.current) bubbleEl.current.hidden = true;
  }, [flipped]);
  const layerEl = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const lastTiles = useRef(0);
  const lastNow = useRef(0);
  const arrows = useRef({});
  const items = useRef({});
  const order = useRef("");
  const active = hoverId ?? nearId;
  const camera = useCamera({ layerRef: layerEl, view, flipped, start: FIGURE_START, still: still() });

  /** Shows an arrow at the screen edge for each station the camera has left off screen. */
  const placeArrows = (v, pan, seen) => {
    for (const st of LABELLED) {
      const el = arrows.current[st.id];
      if (!el) continue;
      const lp = floorToScreen(st.labelAt, v);
      const at = { x: lp.left + pan.x, y: lp.top - (st.labelAt.z / 5) * 0.8165 * v.scale + pan.y };
      const off = at.x < seen.left || at.x > seen.right || at.y < seen.top || at.y > seen.bottom;
      el.hidden = !off;
      if (!off) continue;
      const cx = Math.min(seen.right - EDGE, Math.max(seen.left + EDGE, at.x));
      const cy = Math.min(seen.bottom - EDGE, Math.max(seen.top + EDGE, at.y));
      el.style.left = `${cx - pan.x}cqw`;
      el.style.top = `${cy - pan.y}cqw`;
      // Anchor the pill on the edge it sits against, so it never hangs off the screen.
      el.dataset.edge = at.x > seen.right ? "right" : at.x < seen.left ? "left" : at.y < seen.top ? "top" : "bottom";
      el.style.setProperty("--turn", `${Math.atan2(at.y - cy, at.x - cx)}rad`);
    }
  };

  const onFrame = useCallback(
    (s) => {
      const el = figureEl.current;
      if (el) {
        const v = viewRef.current;
        const p = floorToScreen(s.pos, v);
        el.style.left = `${p.left}cqw`;
        el.style.top = `${p.top}cqw`;
        el.style.width = `${(FIGURE_META.width / 5) * v.scale}cqw`;
        // Re-sort him against every station each frame: one fixed z cannot be right beside all of them.
        const ids = paintOrder(PAINT, s.pos);
        const key = ids.join();
        if (key !== order.current) {
          order.current = key;
          zNow.current = zMap(ids);
          for (const [id, z] of zNow.current) {
            const target = id === "figure" ? el : items.current[id];
            if (target) target.style.zIndex = String(z);
          }
        }
        // His reaching arm, on its own layer just above the station he reaches across.
        const over = overEl.current;
        if (over) {
          const reaching = Boolean(s.pose && OVER_POSES.has(s.pose));
          over.hidden = !reaching;
          if (reaching) {
            const st = nearestStation(s.pos, STATIONS, 12);
            over.style.left = el.style.left;
            over.style.top = el.style.top;
            over.style.width = el.style.width;
            over.style.zIndex = String((zNow.current.get(st?.id) ?? 0) + 5);
            const oh = `#f-${s.facing}-${s.pose}-over`;
            const ou = over.querySelector("use");
            if (ou && ou.getAttribute("href") !== oh) ou.setAttribute("href", oh);
          }
        }
        const href = `#f-${s.facing}-${frameName(s)}`;
        const say = bubbleEl.current;
        if (say) {
          const on = saying(s);
          say.hidden = !on;
          say.toggleAttribute("data-fading", on && s.helloLeft < HELLO_FADE_MS);
          if (on) {
            say.style.left = `${p.left}cqw`;
            say.style.top = `${p.top - (214 / 5) * 0.8165 * v.scale}cqw`;
          }
        }
        const use = el.querySelector(".figure-svg use");
        if (use && use.getAttribute("href") !== href) use.setAttribute("href", href);
        el.classList.toggle("falling", s.falling);
        const dt = lastNow.current ? Math.min(0.1, (s.now - lastNow.current) / 1000) : 1 / 60;
        lastNow.current = s.now;
        camera.follow({ x: p.left, y: p.top }, dt);
        const seen = camera.seen();
        if (seen) placeArrows(v, camera.pan.current, seen);
      }
      // Within reach of a station's footprint: the chair's seat is 5.5 from its back, so 6.
      const near = s.falling ? null : (nearestStation(s.pos, LABELLED, 6)?.id ?? null);
      setNearId((prev) => (prev === near ? prev : near));
      if ((s.tiles.size > 0 || tiles.length > 0) && (s.now - lastTiles.current > 200 || s.tiles.size === 0)) {
        lastTiles.current = s.now;
        setTiles([...s.tiles].map(([key, seen]) => ({ key, age: s.now - seen })));
      }
    },
    [tiles.length],
  );

  const { tap, stateRef } = useFigure({
    active: flipped,
    stations: STATIONS,
    start: FIGURE_START,
    onFrame,
    wander: !still(),
    hold: hoverId !== null,
    speed,
    greet: !still(),
    hello: true,
  });
  if (import.meta.env.DEV && typeof window !== "undefined") window.__figure = stateRef;

  const onTap = (e) => {
    const rect = layerEl.current.getBoundingClientRect();
    const cqw = rect.width / 100;
    tap(screenToFloor({ left: (e.clientX - rect.left) / cqw, top: (e.clientY - rect.top) / cqw }, view));
  };
  const poster = typeof document !== "undefined" ? document.querySelector(posterSelector) : null;
  const labelSize = `max(12px, ${1.45 * (view.scale / 0.62)}cqw)`;

  return (
    <div ref={layerEl} className="floor-layer" data-on={on || undefined} aria-hidden={!flipped}>
      <div className="floor-hit" onPointerDown={onTap} />
      <div className="floor-item floor-walls" style={{ ...at({ x: 0, y: 0 }, view, Walls.meta), zIndex: 1, "--d": "0.5s" }}>
        <Walls />
      </div>
      {STATIONS.map((st, i) => {
        const delay = LATE.has(st.id) ? 1.05 + i * 0.08 : 0.85;
        const lp = floorToScreen(st.labelAt, view);
        const lift = (st.labelAt.z / 5) * 0.8165 * view.scale;
        // A station drawn in parts is several items in the same box, each with its own depth.
        const layers = st.parts ?? [{ id: st.id, Component: st.Component }];
        return (
          <div
            key={st.id}
            className="floor-station"
            onPointerEnter={st.label ? () => hover.enter(st.id) : undefined}
            onPointerLeave={st.label ? hover.leave : undefined}
            onPointerDown={st.label ? () => tap(standPoint(st)) : undefined}
          >
            {layers.map((layer) => (
              <div
                key={layer.id}
                ref={(node) => (items.current[layer.id] = node)}
                className="floor-item"
                style={{ ...at(st.pos, view, layer.Component.meta), zIndex: START_Z.get(layer.id), "--d": `${delay}s` }}
              >
                <layer.Component active={active === st.id} />
              </div>
            ))}
            {st.Front && (
              <div
                ref={(node) => (items.current[`${st.id}-front`] = node)}
                className="floor-item"
                style={{ ...at(st.pos, view, st.Front.meta), zIndex: START_Z.get(`${st.id}-front`), "--d": `${delay}s` }}
              >
                <st.Front active={active === st.id} />
              </div>
            )}
            {st.label && (
              <StationLabel
                text={st.label}
                active={active === st.id}
                onEnter={() => hover.enter(st.id)}
                style={{ left: `${lp.left}cqw`, top: `${lp.top - lift}cqw`, fontSize: labelSize, zIndex: 900, "--d": `${delay + 0.3}s` }}
              />
            )}
            {flipped && active === st.id && (
              <StationCard station={st} onNavigate={onNavigate} style={{ left: `${lp.left}cqw`, top: `${lp.top - lift + 1.4}cqw`, zIndex: 1000 }} />
            )}
          </div>
        );
      })}
      <Figure ref={figureEl} />
      <Figure ref={overEl} over />
      <p ref={bubbleEl} className="speech hand" style={{ fontSize: labelSize }} hidden>
        {hello}
      </p>
      {LABELLED.map((st) => (
        <StationArrow key={st.id} ref={(el) => (arrows.current[st.id] = el)} label={st.label} fontSize={labelSize} onGo={() => tap(standPoint(st))} />
      ))}
      {flipped && typeof document !== "undefined" && createPortal(<SpeedWheel value={speed} onChange={changeSpeed} />, document.body)}
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
