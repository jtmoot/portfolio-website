import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { enterCreative, unlockScroll } from "../lib/mode.js";
import { fitView, padTransform } from "../lib/floorView.js";
import { play } from "../lib/audio.js";

/**
 * How long after the paper starts to move the page-flip clip starts. The clip's loud land is at
 * 0.85 s; the paper lands at about 1.2 s of its 1.5 s tip, either way, so the two meet.
 */
export const FLIP_SOUND_DELAY_MS = 350;

const viewport = () => ({ w: window.innerWidth, h: window.innerHeight });
const PHONE = "(max-width: 819px)";

/**
 * The page stage. Reads the mode store, scrolls to the top and locks scrolling before the
 * paper tips, and exposes the fitted view to its children so the floor overlay can project.
 * @param {{ store: ReturnType<import("../lib/mode.js").createModeStore>, children: (state: { view: object, flipped: boolean, phone: boolean }) => import("react").ReactNode }} props
 */
export default function Stage({ store, children }) {
  const mode = useSyncExternalStore(store.subscribe, store.get);
  const [view, setView] = useState(() => fitView(viewport()));
  const [flipped, setFlipped] = useState(mode === "creative");
  const [phone, setPhone] = useState(() => matchMedia(PHONE).matches);

  useEffect(() => {
    const mq = matchMedia(PHONE);
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const onResize = () => setView(fitView(viewport()));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (mode !== "creative") {
      unlockScroll();
      setFlipped(false);
      return undefined;
    }
    const wait = enterCreative();
    const t = setTimeout(() => setFlipped(true), wait);
    return () => clearTimeout(t);
  }, [mode]);

  useEffect(() => () => unlockScroll(), []);

  // The page turns as the paper starts to move, either way; not on mount.
  const turned = useRef(false);
  useEffect(() => {
    if (!turned.current) {
      turned.current = true;
      return;
    }
    play("flip", { delay: FLIP_SOUND_DELAY_MS });
  }, [flipped]);

  return (
    <div className="stage" data-mode={flipped ? "creative" : "pad"} data-phone={phone || undefined} style={{ "--pad-transform": padTransform(view) }}>
      {children({ view, flipped, phone })}
    </div>
  );
}
