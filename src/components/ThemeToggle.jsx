import { useRef, useCallback } from "react";
import { useTheme } from "../hooks/useTheme.jsx";

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const btnRef = useRef(null);

  const handleClick = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      toggleTheme();
      return;
    }

    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const maxDistance = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const newTheme = theme === "light" ? "dark" : "light";
    const newBg = newTheme === "dark" ? "#0f0f0f" : "#f5f3f0";

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 9999;
      pointer-events: none;
      background: ${newBg};
      clip-path: circle(0px at ${cx}px ${cy}px);
      transition: clip-path 0.5s ease-out;
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(${maxDistance}px at ${cx}px ${cy}px)`;
    });

    overlay.addEventListener("transitionend", () => {
      toggleTheme();
      overlay.remove();
    }, { once: true });
  }, [theme, toggleTheme]);

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      style={{
        position: "fixed",
        top: 20,
        right: 24,
        zIndex: 1000,
        width: 42,
        height: 42,
        borderRadius: 12,
        border: "none",
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-card)",
        color: "var(--text-primary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
      }}
    >
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        transform: theme === "light" ? "rotate(0deg)" : "rotate(-90deg)",
        opacity: theme === "light" ? 1 : 0,
        position: "absolute",
      }}>
        <SunIcon />
      </span>
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        transform: theme === "dark" ? "rotate(0deg)" : "rotate(90deg)",
        opacity: theme === "dark" ? 1 : 0,
        position: "absolute",
      }}>
        <MoonIcon />
      </span>
    </button>
  );
}
