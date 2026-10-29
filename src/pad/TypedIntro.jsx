import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { typeSchedule } from "../lib/typer.js";
import { isMuted, setMuted } from "../lib/audio.js";

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The intro paragraph typing itself, silently (the pencil belongs to the name). The hero replays
 * it through the ref's run(); two small icon buttons follow it: replay (onReplay), and a
 * remembered mute.
 * @param {{ tokens: { text: string, mark?: boolean }[], startDelay?: number, onReplay?: () => void }} props
 */
const TypedIntro = forwardRef(function TypedIntro({ tokens, startDelay = 700, onReplay = () => {} }, ref) {
  const frames = useMemo(() => typeSchedule(tokens), [tokens]);
  const [html, setHtml] = useState(() => (still() ? frames.at(-1).html : ""));
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);
  const [muted, setMutedState] = useState(isMuted);

  const run = useCallback(
    (delay) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      if (still()) {
        setHtml(frames.at(-1).html);
        return;
      }
      setHtml("");
      setTyping(true);
      for (const f of frames) timers.current.push(setTimeout(() => setHtml(f.html), delay + f.at));
      timers.current.push(setTimeout(() => setTyping(false), delay + frames.at(-1).at + 200));
    },
    [frames],
  );

  useImperativeHandle(ref, () => ({ run }), [run]);

  useEffect(() => {
    run(startDelay);
    const t = timers;
    return () => t.current.forEach(clearTimeout);
  }, [run, startDelay]);

  return (
    <p className="typed">
      <span className="sr-only">{tokens.map((t) => t.text).join("")}</span>
      <span className="typed-live">
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
        <span className={`caret${typing ? "" : " idle"}`} aria-hidden="true" />
        <span className="intro-tools">
          <button type="button" className="icon-btn" aria-label="Replay the intro with sound" title="Replay" data-c="ring" onClick={onReplay}>
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
      </span>
      {/* The finished paragraph, invisible underneath: it holds the height while the live copy types. */}
      <span className="typed-ghost" aria-hidden="true">
        <span dangerouslySetInnerHTML={{ __html: frames.at(-1).html }} />
        <span className="typed-ghost-tools" />
      </span>
    </p>
  );
});

export default TypedIntro;
