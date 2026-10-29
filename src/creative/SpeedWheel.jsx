import { useEffect, useRef } from "react";
import { MAX_SPEED, MIN_SPEED, angleOf, nudge, speedOf } from "../lib/speed.js";

const TICKS = [0.5, 0.75, 1, 1.5, 2];
const fmt = (v) => `${Number(v.toFixed(2))}x`;

/**
 * A small drawn dial that sets the figure's walking speed: drag it round, scroll it, or use the
 * arrow keys, Home and End. Its keys never reach the figure.
 * @param {{ value: number, onChange: (speed: number) => void }} props
 */
export default function SpeedWheel({ value, onChange }) {
  const knob = useRef(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const changeRef = useRef(onChange);
  changeRef.current = onChange;

  // React's onWheel is passive, so the page would scroll too: listen natively instead.
  useEffect(() => {
    const el = knob.current;
    const wheel = (e) => {
      e.preventDefault();
      changeRef.current(nudge(valueRef.current, -Math.sign(e.deltaY)));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);

  const onKeyDown = (e) => {
    const up = e.key === "ArrowUp" || e.key === "ArrowRight";
    const down = e.key === "ArrowDown" || e.key === "ArrowLeft";
    if (!up && !down && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    e.stopPropagation();
    if (e.key === "Home") onChange(MIN_SPEED);
    else if (e.key === "End") onChange(MAX_SPEED);
    else onChange(nudge(value, up ? 1 : -1));
  };

  const turnTo = (e) => {
    const r = knob.current.getBoundingClientRect();
    const deg = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    onChange(Math.round(speedOf(deg) * 20) / 20);
  };
  const onPointerDown = (e) => {
    e.stopPropagation();
    knob.current.setPointerCapture?.(e.pointerId);
    turnTo(e);
  };
  const onPointerMove = (e) => {
    if (knob.current.hasPointerCapture?.(e.pointerId)) turnTo(e);
  };

  const a = angleOf(value);
  return (
    <div className="speed-wheel">
      <div
        ref={knob}
        className="speed-knob"
        role="slider"
        tabIndex={0}
        aria-label="walking speed"
        aria-valuemin={MIN_SPEED}
        aria-valuemax={MAX_SPEED}
        aria-valuenow={value}
        aria-valuetext={fmt(value)}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <svg viewBox="-32 -32 64 64" aria-hidden="true">
          {TICKS.map((t) => {
            const r = (angleOf(t) * Math.PI) / 180;
            const major = t === 1;
            return (
              <line
                key={t}
                x1={Math.sin(r) * 25}
                y1={-Math.cos(r) * 25}
                x2={Math.sin(r) * (major ? 30 : 28.5)}
                y2={-Math.cos(r) * (major ? 30 : 28.5)}
                className={major ? "sw-tick major" : "sw-tick"}
              />
            );
          })}
          <circle r="21" className="sw-rim" />
          <g style={{ transform: `rotate(${a}deg)` }} className="sw-turn">
            <circle r="17" className="sw-face" />
            {Array.from({ length: 24 }, (_, i) => (
              <line key={i} x1="0" y1="-17" x2="0" y2="-19.5" className="sw-knurl" transform={`rotate(${i * 15})`} />
            ))}
            <line x1="0" y1="-4" x2="0" y2="-14" className="sw-needle" />
            <circle r="2" className="sw-hub" />
          </g>
        </svg>
      </div>
      <span className="speed-label hand">
        speed <span className="speed-value">{fmt(value)}</span>
      </span>
    </div>
  );
}
