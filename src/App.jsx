import { useEffect, useState } from "react";
import Nav from "./pad/Nav.jsx";
import Hero from "./pad/Hero.jsx";
import Experience from "./pad/Experience.jsx";
import Work from "./pad/Work.jsx";
import Interests from "./pad/Interests.jsx";
import Contact from "./pad/Contact.jsx";
import { play, unlock } from "./lib/audio.js";
import StationHarness from "./creative/StationHarness.jsx";
import { getTheme, toggleTheme } from "./lib/theme.js";

export default function App() {
  const [theme, setThemeState] = useState(() => {
    const t = getTheme();
    document.documentElement.dataset.theme = t;
    return t;
  });
  const [mode, setMode] = useState("pad");

  useEffect(() => {
    const first = () => unlock();
    window.addEventListener("pointerdown", first, { once: true });
    window.addEventListener("keydown", first, { once: true });
    return () => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
    };
  }, []);

  if (new URLSearchParams(window.location.search).get("dev") === "stations") {
    return <StationHarness />;
  }

  return (
    <div className="stage" data-mode={mode}>
      <main className="sheet">
        <Nav
          theme={theme}
          onToggleTheme={() => {
            play("tick");
            setThemeState(toggleTheme());
          }}
          mode={mode}
          onToggleMode={() => {
            play("tick");
            setMode((m) => (m === "pad" ? "creative" : "pad"));
          }}
        />
        <section className="poster">
          <div className="margin margin-left" aria-hidden="true" />
          <Hero />
          <div className="margin margin-right" aria-hidden="true" />
        </section>
        <div className="body">
          <Experience />
          <Work />
          <Interests />
          <Contact />
        </div>
      </main>
    </div>
  );
}
