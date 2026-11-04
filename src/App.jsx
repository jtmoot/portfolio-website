import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from "react";
import Nav from "./pad/Nav.jsx";
import Hero from "./pad/Hero.jsx";
import Experience from "./pad/Experience.jsx";
import Work from "./pad/Work.jsx";
import Leadership from "./pad/Leadership.jsx";
import Contact from "./pad/Contact.jsx";
import HoverPreview from "./pad/HoverPreview.jsx";
import Cursor from "./pad/Cursor.jsx";
import Stage from "./creative/Stage.jsx";
import Shelf from "./pad/Shelf.jsx";
import { pageOf } from "./lib/route.js";
import { soundFor } from "./lib/clickSound.js";
import { startAmbient } from "./lib/ambient.js";
import Sides from "./pad/Sides.jsx";

const Floor = lazy(() => import("./creative/Floor.jsx"));
const StationHarness = lazy(() => import("./creative/StationHarness.jsx"));
const PhoneStage = lazy(() => import("./creative/PhoneStage.jsx"));
import { play, stopAll, unlock } from "./lib/audio.js";
import { getTheme, toggleTheme } from "./lib/theme.js";
import { createModeController, createModeStore } from "./lib/mode.js";

const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
const PAGE = typeof window !== "undefined" ? pageOf(window.location.pathname) : "pad";
const modeStore = createModeStore(params.get("mode") === "creative" ? "creative" : "pad");
const PHONE = "(max-width: 819px)";
/** The room's code: the floor overlay (which pulls in every drawing), plus the phone stage on phones. */
const loadRoom = () =>
  Promise.all([
    import("./creative/Floor.jsx"),
    typeof matchMedia === "function" && matchMedia(PHONE).matches ? import("./creative/PhoneStage.jsx") : null,
  ]);
const modeControl = createModeController(modeStore, loadRoom);

export default function App() {
  const [theme, setThemeState] = useState(() => {
    const t = getTheme();
    document.documentElement.dataset.theme = t;
    return t;
  });
  const mode = useSyncExternalStore(modeStore.subscribe, modeStore.get);
  const [roomLoaded, setRoomLoaded] = useState(mode === "creative");
  if (mode === "creative" && !roomLoaded) setRoomLoaded(true);

  // Escape leaves creative mode; once the page has settled, fetch the room quietly in the background.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && modeStore.get() === "creative") modeControl.toggle();
    };
    window.addEventListener("keydown", onKey);
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
    const t = PAGE === "pad" ? setTimeout(() => idle(() => loadRoom().catch(() => {})), 4000) : 0;
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, []);

  // A soft click for every button, link and sticker; creative mode's toggle turns a page instead.
  useEffect(() => {
    const onClick = (e) => {
      const name = soundFor(e.target);
      if (name) play(name);
    };
    document.addEventListener("click", onClick, true);
    // Leaving the page (another tab, back, a link) silences the typing too.
    const away = () => stopAll();
    const hidden = () => document.hidden && stopAll();
    window.addEventListener("pagehide", away);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", away);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, []);

  // Quiet music while the room is open (the pad only: /shelf has no creative mode).
  useEffect(() => (PAGE === "pad" ? startAmbient(modeStore) : undefined), []);

  useEffect(() => {
    const first = () => unlock();
    window.addEventListener("pointerdown", first, { once: true });
    window.addEventListener("keydown", first, { once: true });
    return () => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
    };
  }, []);

  if (params.get("dev") === "stations") {
    return (
      <Suspense fallback={null}>
        <StationHarness />
      </Suspense>
    );
  }

  const onToggleTheme = () => {
    setThemeState(toggleTheme());
  };
  if (PAGE === "shelf") {
    return (
      <>
        <Shelf theme={theme} onToggleTheme={onToggleTheme} />
        <HoverPreview />
        <Cursor />
      </>
    );
  }
  const onNavigate = (href) => {
    if (href.startsWith("/")) {
      window.location.assign(href);
      return;
    }
    modeStore.set("pad");
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" }), 1600);
  };
  const onToggleMode = () => {
    stopAll();
    modeControl.toggle();
  };

  return (
    <>
      <Stage store={modeStore}>
        {({ view, flipped, phone }) => (
          <>
          <main className="sheet">
            <Nav theme={theme} onToggleTheme={onToggleTheme} mode={mode} onToggleMode={onToggleMode} />
            <section className="poster" inert={flipped || undefined}>
              <Hero />
            </section>
            {roomLoaded && !phone && (
              <Suspense fallback={null}>
                <Floor view={view} flipped={flipped} onNavigate={onNavigate} />
              </Suspense>
            )}
            <div className="body" inert={flipped || undefined}>
              <Sides />
              <Experience />
              <Work />
              <Leadership />
              <Contact />
            </div>
          </main>
          {roomLoaded && phone && (
            <Suspense fallback={null}>
              <PhoneStage view={view} flipped={flipped} onNavigate={onNavigate} />
            </Suspense>
          )}
          </>
        )}
      </Stage>
      <HoverPreview />
      <Cursor />
    </>
  );
}
