import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { loop } from "../lib/audio.js";
import { STEP_MS, typingRhythm } from "../lib/opening.js";

export { STEP_MS };

/** A 150 ms beat, then the letters on a person's uneven rhythm, with the typing sound only while it writes. */
const LEAD_MS = 150;

/** When the name is finished, in ms from run(). */
export const nameDuration = (text) => LEAD_MS + (typingRhythm(text).at(-1) ?? 0);

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The name, typing itself out behind a thin caret that stays and blinks once it's done. run()
 * retypes it with the sound; the rest of the line stays laid out (invisibly) so nothing reflows.
 * @param {{ text: string }} props
 */
const HandName = forwardRef(function HandName({ text }, ref) {
  const [n, setN] = useState(text.length);
  const [writing, setWriting] = useState(false);
  const timers = useRef([]);
  const stopSound = useRef(() => {});

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    stopSound.current();
    stopSound.current = () => {};
  };

  const run = useCallback(() => {
    clear();
    if (still()) {
      setN(text.length);
      setWriting(false);
      return;
    }
    setN(0);
    setWriting(true);
    timers.current.push(setTimeout(() => (stopSound.current = loop("typing")), LEAD_MS));
    typingRhythm(text).forEach((t, i) => timers.current.push(setTimeout(() => setN(i + 1), LEAD_MS + t)));
    timers.current.push(
      setTimeout(() => {
        stopSound.current();
        stopSound.current = () => {};
        setWriting(false);
      }, nameDuration(text) + 40),
    );
  }, [text]);

  useImperativeHandle(ref, () => ({ run }), [run]);
  useEffect(() => clear, []);

  return (
    <h1 className="hand-name" data-writing={writing || undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <span className="name-typed">{text.slice(0, n)}</span>
        <span className="name-caret" aria-hidden="true" />
        <span className="name-ghost">{text.slice(n)}</span>
      </span>
    </h1>
  );
});

export default HandName;
