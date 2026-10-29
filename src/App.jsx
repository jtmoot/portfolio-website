import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from "react";
import Nav from "./pad/Nav.jsx";
import Hero from "./pad/Hero.jsx";
import Margins from "./pad/Margins.jsx";
import Experience from "./pad/Experience.jsx";
import Work from "./pad/Work.jsx";
import Interests from "./pad/Interests.jsx";
import Contact from "./pad/Contact.jsx";
import HoverPreview from "./pad/HoverPreview.jsx";
import Cursor from "./pad/Cursor.jsx";
import Stage from "./creative/Stage.jsx";

const Floor = lazy(() => import("./creative/Floor.jsx"));
const StationHarness = lazy(() => import("./creative/StationHarness.jsx"));
import { play, unlock } from "./lib/audio.js";
import { getTheme, toggleTheme } from "./lib/theme.js";
import { createModeStore } from "./lib/mode.js";

const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
const modeStore = createModeStore(params.get("mode") === "creative" ? "creative" : "pad");

export default function App() {
  const [theme, setThemeState] = useState(() => {
    const t = getTheme();
    document.documentElement.dataset.theme = t;
    return t;
  });
  const mode = useSyncExternalStore(modeStore.subscribe, modeStore.get);
  const [roomLoaded, setRoomLoaded] = useState(mode === "creative");
  if (mode === "creative" && !roomLoaded) setRoomLoaded(true);

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
    play("tick");
    setThemeState(toggleTheme());
  };
  const onNavigate = (href) => {
    modeStore.set("pad");
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" }), 1600);
  };
  const onToggleMode = () => {
    play("tick");
    modeStore.toggle();
  };

  return (
    <>
      <Stage store={modeStore}>
        {({ view, flipped }) => (
          <main className="sheet">
            <Nav theme={theme} onToggleTheme={onToggleTheme} mode={mode} onToggleMode={onToggleMode} />
            <section className="poster">
              <Margins />
              <Hero />
            </section>
            {roomLoaded && (
              <Suspense fallback={null}>
                <Floor view={view} flipped={flipped} onNavigate={onNavigate} />
              </Suspense>
            )}
            <div className="body">
              <Experience />
              <Work />
              <Interests />
              <Contact />
            </div>
          </main>
        )}
      </Stage>
      <HoverPreview />
      <Cursor />
    </>
  );
}
