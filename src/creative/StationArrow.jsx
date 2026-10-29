import { forwardRef } from "react";

/**
 * A handwritten arrow pinned to the screen edge, pointing at a station the camera has left off
 * screen. Floor moves it each frame (left, top and --turn); clicking it walks him there.
 * @param {{ label: string, fontSize: string, onGo: () => void }} props
 */
const StationArrow = forwardRef(function StationArrow({ label, fontSize, onGo }, ref) {
  return (
    <button ref={ref} type="button" className="station-arrow hand" style={{ fontSize }} onClick={onGo} hidden>
      <svg viewBox="0 0 24 12" aria-hidden="true">
        <path d="M1.5 6.4 C7 5.4 13 6.8 21 6 M16.5 2 L21.5 6 L16.8 10.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </button>
  );
});

export default StationArrow;
