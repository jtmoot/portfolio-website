import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { loop } from "../lib/audio.js";

/** One letter every 65 ms after a 150 ms beat, with the pencil only while it writes (garvitsingla.in's timing). */
export const STEP_MS = 65;
const LEAD_MS = 150;

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The name, written out in the hand font. run() rewrites it with the pencil sound; the rest of
 * the line stays laid out (invisibly) so nothing reflows while it writes.
 * @param {{ text: string, children?: import("react").ReactNode }} props children: drawn under the name (the scribble)
 */
const HandName = forwardRef(function HandName({ text, children }, ref) {
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
    timers.current.push(setTimeout(() => (stopSound.current = loop("pencil")), LEAD_MS));
    for (let i = 1; i <= text.length; i++) timers.current.push(setTimeout(() => setN(i), LEAD_MS + i * STEP_MS));
    timers.current.push(
      setTimeout(() => {
        stopSound.current();
        stopSound.current = () => {};
        setWriting(false);
      }, LEAD_MS + text.length * STEP_MS + 40),
    );
  }, [text]);

  useImperativeHandle(ref, () => ({ run }), [run]);
  useEffect(() => clear, []);

  return (
    <h1 className="hand-name" data-writing={writing || undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <span className="name-typed">{text.slice(0, n)}</span>
        <span className="name-ghost">{text.slice(n)}</span>
      </span>
      {children}
    </h1>
  );
});

export default HandName;
