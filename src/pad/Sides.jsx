import { useEffect, useState } from "react";
import { SHELF } from "../content/shelf.js";
import { currentSection } from "../lib/sideIndex.js";

const SECTIONS = [
  ["Experience", "#experience"],
  ["Projects", "#work"],
  ["Leadership", "#leadership"],
  ["Contact", "#contact"],
];

/** The section the reader is in, for the index's mark (see currentSection for the rule). */
function useCurrentSection() {
  const [current, setCurrent] = useState(SECTIONS[0][1]);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const els = SECTIONS.map(([, href]) => document.querySelector(href));
      if (els.some((el) => !el)) return;
      const tops = els.map((el) => el.getBoundingClientRect().top + window.scrollY);
      const i = currentSection(tops, { scrollY: window.scrollY, viewH: window.innerHeight, pageH: document.documentElement.scrollHeight });
      setCurrent(SECTIONS[i][1]);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
