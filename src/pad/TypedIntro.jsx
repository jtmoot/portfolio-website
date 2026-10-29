import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { typeSchedule } from "../lib/typer.js";
import { loop, unlock } from "../lib/audio.js";

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The intro paragraph typing itself, with a replay control. Browsers keep the page silent until a
 * gesture, so (like garvitsingla.in) the first click or key press retypes it from the top with
 * the pencil sound.
 * @param {{ tokens: { text: string, mark?: boolean }[], startDelay?: number, replayRef?: { current: (() => void) | null } }} props
 */
export default function TypedIntro({ tokens, startDelay = 700, replayRef }) {
  const frames = useMemo(() => typeSchedule(tokens), [tokens]);
  const [html, setHtml] = useState(() => (still() ? frames.at(-1).html : ""));
  const [typing, setTyping] = useState(false);
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
    </p>
  );
}
