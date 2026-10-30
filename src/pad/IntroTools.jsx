import { useState } from "react";
import { isMuted, setMuted } from "../lib/audio.js";

/**
 * Two small icon buttons on the role line, as on garvitsingla.in: retype the name, and a
 * remembered mute.
 * @param {{ onReplay: () => void }} props
 */
export default function IntroTools({ onReplay }) {
  const [muted, setMutedState] = useState(isMuted);
  return (
    <span className="intro-tools">
      <button type="button" className="icon-btn" aria-label="Replay the name with sound" title="Replay" data-c="ring" onClick={onReplay}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      <button
        type="button"
        className="icon-btn"
        aria-label="Mute sound"
        aria-pressed={muted}
        title={muted ? "Sound off" : "Sound on"}
        data-c="ring"
        onClick={() => {
          setMuted(!muted);
          setMutedState(!muted);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z" />
          {muted ? (
            <path d="M22 9l-6 6M16 9l6 6" />
          ) : (
            <>
              <path d="M16 9a5 5 0 0 1 0 6" />
              <path d="M19.4 18.4a9 9 0 0 0 0-12.8" />
            </>
          )}
        </svg>
      </button>
    </span>
  );
}
