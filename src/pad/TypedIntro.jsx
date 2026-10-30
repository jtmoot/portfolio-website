import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { typeSchedule } from "../lib/typer.js";

/** Characters per second: quick enough that nobody waits to read it. */
const TYPE_CPS = 90;

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The intro paragraph typing itself, silently (the sound belongs to the name). The hero replays
 * it through the ref's run().
 * @param {{ tokens: { text: string, mark?: boolean }[], startDelay?: number }} props
 */
const TypedIntro = forwardRef(function TypedIntro({ tokens, startDelay = 700 }, ref) {
  const frames = useMemo(() => typeSchedule(tokens, TYPE_CPS), [tokens]);
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
      </span>
      {/* The finished paragraph, invisible underneath: it holds the height while the live copy types. */}
      <span className="typed-ghost" aria-hidden="true">
        <span dangerouslySetInnerHTML={{ __html: frames.at(-1).html }} />
      </span>
    </p>
  );
});

export default TypedIntro;
