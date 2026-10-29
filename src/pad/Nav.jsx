import { useEffect, useState } from "react";

const LINKS = [
  ["experience", "#experience"],
  ["work", "#work"],
  ["reading", "#reading"],
  ["contact", "#contact"],
];

function pittsburghTime() {
  try {
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })
      .format(new Date())
      .toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Top navigation: section links on the left; the local clock, theme and creative-mode toggles on the right.
 * @param {{ theme: "day" | "night", onToggleTheme: () => void, mode: "pad" | "creative", onToggleMode: () => void }} props
 */
export default function Nav({ theme, onToggleTheme, mode, onToggleMode }) {
  const [clock, setClock] = useState(pittsburghTime);

  useEffect(() => {
    const id = setInterval(() => setClock(pittsburghTime()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="nav" aria-label="Sections">
      <div className="nav-links">
        {LINKS.map(([label, href]) => (
          <a key={href} href={href} data-c="ring">
            {label}
          </a>
        ))}
      </div>
      <div className="nav-right">
        {clock && <span className="nav-clock">{clock} pittsburgh</span>}
        <button type="button" onClick={onToggleTheme} aria-pressed={theme === "night"} data-c="ring">
          {theme === "night" ? "night" : "day"}
        </button>
        <button type="button" onClick={onToggleMode} aria-pressed={mode === "creative"} data-c="ring">
          {mode === "creative" ? "back to the pad" : "creative mode"}
          <span className="toggle-pill" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
