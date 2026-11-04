import { useEffect, useState, useSyncExternalStore } from "react";
import { enterCreative, unlockScroll } from "../lib/mode.js";
import { fitView, padTransform } from "../lib/floorView.js";

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

  return (
    <div className="stage" data-mode={flipped ? "creative" : "pad"} data-phone={phone || undefined} style={{ "--pad-transform": padTransform(view) }}>
      {children({ view, flipped, phone })}
    </div>
  );
}
