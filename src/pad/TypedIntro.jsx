import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { typeSchedule } from "../lib/typer.js";
import { isMuted, loop, setMuted, unlock } from "../lib/audio.js";

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The intro paragraph typing itself, with a replay control. Browsers keep the page silent until a
 * gesture, so (like garvitsingla.in) the first click or key press retypes it from the top with
 * the pencil sound. Two small icon buttons follow it: replay, and a remembered mute.
 * @param {{ tokens: { text: string, mark?: boolean }[], startDelay?: number, replayRef?: { current: (() => void) | null } }} props
 */
export default function TypedIntro({ tokens, startDelay = 700, replayRef }) {
  const frames = useMemo(() => typeSchedule(tokens), [tokens]);
  const [html, setHtml] = useState(() => (still() ? frames.at(-1).html : ""));
  const [typing, setTyping] = useState(false);
  const [muted, setMutedState] = useState(isMuted);
  const timers = useRef([]);
  const stopSound = useRef(() => {});

  const run = useCallback(
    (delay) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      stopSound.current();
      stopSound.current = () => {};
      if (still()) {
        setHtml(frames.at(-1).html);
        return;
      }
      setHtml("");
      setTyping(true);
      timers.current.push(setTimeout(() => (stopSound.current = loop("pencil")), delay));
      for (const f of frames) timers.current.push(setTimeout(() => setHtml(f.html), delay + f.at));
      timers.current.push(
        setTimeout(() => {
          stopSound.current();
          stopSound.current = () => {};
          setTyping(false);
        }, delay + frames.at(-1).at + 200),
      );
    },
    [frames],
  );

  useEffect(() => {
    run(startDelay);
    const t = timers;
    return () => {
      t.current.forEach(clearTimeout);
      stopSound.current();
    };
  }, [run, startDelay]);

  useEffect(() => {
    if (still()) return undefined;
    const first = () => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
      unlock();
      run(150);
    };
    window.addEventListener("pointerdown", first);
    window.addEventListener("keydown", first);
    return () => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
    };
  }, [run]);

  useEffect(() => {
    if (replayRef) replayRef.current = () => run(150);
  }, [replayRef, run]);

  return (
    <p className="typed">
      <span className="sr-only">{tokens.map((t) => t.text).join("")}</span>
      <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
      <span className={`caret${typing ? "" : " idle"}`} aria-hidden="true" />
      <span className="intro-tools">
        <button type="button" className="icon-btn" aria-label="Replay the intro with sound" title="replay" data-c="ring" onClick={() => run(150)}>
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
          title={muted ? "sound off" : "sound on"}
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
    </p>
  );
}
