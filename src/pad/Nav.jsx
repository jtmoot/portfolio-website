import { useEffect, useState } from "react";

const LINKS = [
  ["experience", "#experience"],
  ["work", "#work"],
  ["shelf", "/shelf"],
  ["contact", "#contact"],
];

/** Scroll distance (px) after which the nav shrinks into a floating pill, like garvitsingla.in. */
export const COMPACT_AT = 40;

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
 * It sits in a zero-height sticky dock; once the page scrolls it compacts into a frosted pill.
 * On /shelf it links back into the pad (`base` "/") and has no creative-mode toggle.
 * @param {{ theme: "day" | "night", onToggleTheme: () => void, mode?: "pad" | "creative", onToggleMode?: () => void, base?: string }} props
 */
export default function Nav({ theme, onToggleTheme, mode = "pad", onToggleMode, base = "" }) {
  const [clock, setClock] = useState(pittsburghTime);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > COMPACT_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(pittsburghTime()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="nav-dock">
      <nav className="nav" aria-label="Sections" data-compact={compact || undefined}>
        <div className="nav-links">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href.startsWith("#") ? `${base}${href}` : href} data-c="ring">
              {label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          {clock && <span className="nav-clock">{clock} pittsburgh</span>}
          <button type="button" onClick={onToggleTheme} aria-pressed={theme === "night"} data-c="ring">
            {theme === "night" ? "night" : "day"}
          </button>
          {onToggleMode && (
            <button
              type="button"
              onClick={onToggleMode}
              onPointerEnter={() => import("../creative/Floor.jsx")}
              onFocus={() => import("../creative/Floor.jsx")}
              aria-pressed={mode === "creative"}
              data-c="ring"
            >
              {mode === "creative" ? "back to the pad" : "creative mode"}
              <span className="toggle-pill" aria-hidden="true" />
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
