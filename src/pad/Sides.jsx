import { useEffect, useState } from "react";
import { SHELF } from "../content/shelf.js";

const SECTIONS = [
  ["Experience", "#experience"],
  ["Projects", "#work"],
  ["Leadership", "#leadership"],
  ["Contact", "#contact"],
];

/** The section under the top of the viewport, for the index's mark. */
function useCurrentSection() {
  const [current, setCurrent] = useState(SECTIONS[0][1]);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setCurrent(`#${seen[0].target.id}`);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const [, href] of SECTIONS) {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return current;
}

/** Three spines on a shelf, one leaning: the way into /shelf. */
function BookMark() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M3 24.5h22" />
      <rect x="4.6" y="7" width="4.6" height="17.5" rx="0.6" />
      <path d="M4.6 10h4.6M4.6 21.5h4.6" />
      <rect x="9.2" y="4.5" width="5" height="20" rx="0.6" />
      <path d="M9.2 8h5M9.2 21h5" />
      <g className="lean">
        <rect x="16.2" y="8" width="4.6" height="16.5" rx="0.6" />
        <path d="M16.2 11h4.6M16.2 21.5h4.6" />
      </g>
    </svg>
  );
}

/**
 * What fills the side margins on wide screens: a section index on the left that marks where you
 * are, and a small book on the right that opens the shelf.
 */
export default function Sides() {
  const current = useCurrentSection();
  const reading = SHELF[0].books[0];
  return (
    <div className="sides">
      <nav className="side-index" aria-label="On this page">
        {SECTIONS.map(([label, href]) => (
          <a key={href} href={href} aria-current={href === current ? "true" : undefined} data-c="ring">
            {label}
          </a>
        ))}
      </nav>
      <a className="side-book" href="/shelf" aria-label={`The bookshelf, now reading ${reading.title}`} data-c="ring">
        <BookMark />
        <span>The shelf</span>
      </a>
    </div>
  );
}
