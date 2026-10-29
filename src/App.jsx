import { useState } from "react";
import Nav from "./pad/Nav.jsx";
import StationHarness from "./creative/StationHarness.jsx";
import { getTheme, toggleTheme } from "./lib/theme.js";

export default function App() {
  const [theme, setThemeState] = useState(() => {
    const t = getTheme();
    document.documentElement.dataset.theme = t;
    return t;
  });
  const [mode, setMode] = useState("pad");

  if (new URLSearchParams(window.location.search).get("dev") === "stations") {
    return <StationHarness />;
  }

  return (
    <div className="stage" data-mode={mode}>
      <main className="sheet">
        <Nav
          theme={theme}
          onToggleTheme={() => setThemeState(toggleTheme())}
          mode={mode}
          onToggleMode={() => setMode((m) => (m === "pad" ? "creative" : "pad"))}
        />
        <section className="poster">
          <div className="margin margin-left" aria-hidden="true" />
          <div className="hero">
            <h1>hello, i&apos;m joshua moorehead</h1>
          </div>
          <div className="margin margin-right" aria-hidden="true" />
        </section>
        <div className="body" />
      </main>
    </div>
  );
}
