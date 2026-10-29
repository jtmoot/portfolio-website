import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { typeSchedule } from "../lib/typer.js";
import { play } from "../lib/audio.js";

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The intro paragraph typing itself, with a replay control.
 * @param {{ tokens: { text: string, mark?: boolean }[], startDelay?: number, replayRef?: { current: (() => void) | null } }} props
 */
export default function TypedIntro({ tokens, startDelay = 700, replayRef }) {
  const frames = useMemo(() => typeSchedule(tokens), [tokens]);
  const [html, setHtml] = useState(() => (still() ? frames.at(-1).html : ""));
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);

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
      timers.current.push(setTimeout(() => play("pencil"), delay));
      for (const f of frames) timers.current.push(setTimeout(() => setHtml(f.html), delay + f.at));
      timers.current.push(setTimeout(() => setTyping(false), delay + frames.at(-1).at + 200));
    },
    [frames],
  );

  useEffect(() => {
    run(startDelay);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [run, startDelay]);

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
