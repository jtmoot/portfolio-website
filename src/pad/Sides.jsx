import { useEffect, useState } from "react";
import Cover from "./Cover.jsx";
import { CHESS, PROJECTS, RUNS } from "../content/data.js";
import { SHELF } from "../content/shelf.js";

const SECTIONS = [
  ["Experience", "#experience"],
  ["Projects", "#work"],
  ["Leadership", "#leadership"],
  ["Contact", "#contact"],
];

/** Where each pinned project sits in the margins: side, height down the body (%), tilt, drift period (s). */
const PINS = [
  { side: "left", top: 4, rot: -4, dur: 9 },
  { side: "right", top: 16, rot: 3, dur: 11 },
  { side: "left", top: 36, rot: 2.5, dur: 10 },
  { side: "right", top: 54, rot: -3, dur: 12 },
  { side: "left", top: 70, rot: -2, dur: 9.5 },
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

function Rail() {
  const current = useCurrentSection();
  const reading = SHELF[0].books[0];
  return (
    <>
      <nav className="side-index" aria-label="On this page">
        {SECTIONS.map(([label, href]) => (
          <a key={href} href={href} aria-current={href === current ? "true" : undefined} data-c="ring">
            {label}
          </a>
        ))}
      </nav>
      <aside className="side-now" aria-labelledby="side-now-h">
        <h2 id="side-now-h">Now</h2>
        <dl>
          <dt>Reading</dt>
          <dd className="side-reading">
            <Cover book={reading} />
            <a href="/shelf" data-c="ring">
              {reading.title}
            </a>
          </dd>
          <dt>Building</dt>
          <dd>
            <a href="#project-lora" data-c="ring">
              LoRA serving in Needle
            </a>
          </dd>
          <dt>Training</dt>
          <dd>
            <a href={RUNS.href} target="_blank" rel="noreferrer" data-c="ring">
              Barbells and sprints
            </a>
          </dd>
          <dt>Chess</dt>
          <dd>
            <a href={CHESS.href} target="_blank" rel="noreferrer" data-c="ring">
              {CHESS.handle}
            </a>
          </dd>
        </dl>
      </aside>
    </>
  );
}

function Float() {
  const pinned = PROJECTS.filter((p) => p.poster);
  return pinned.map((p, i) => {
    const at = PINS[i % PINS.length];
    return (
      <a
        key={p.id}
        className="side-pin"
        href={`#project-${p.id}`}
        data-side={at.side}
        data-prev={p.poster}
        data-cap={p.title}
        aria-label={`${p.title}, jump to the project`}
        data-c="ring"
        style={{ "--top": `${at.top}%`, "--rot": `${at.rot}deg`, "--dur": `${at.dur}s`, "--delay": `${-i * 1.7}s` }}
      >
        <img src={p.poster} alt="" loading="lazy" />
        <span>{p.title}</span>
      </a>
    );
  });
}

/**
 * What fills the side margins on wide screens, while Joshua compares the two ideas (?sides=):
 * "rail" is a section index and a Now card that stay in view; "float" pins each project's
 * poster in the margins, drifting slowly. Without a variant, nothing.
 * @param {{ variant: "rail" | "float" | null }} props
 */
export default function Sides({ variant }) {
  if (!variant) return null;
  return (
    <div className="sides" data-variant={variant}>
      {variant === "rail" ? <Rail /> : <Float />}
    </div>
  );
}
