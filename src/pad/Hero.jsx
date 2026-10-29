import DotPortrait from "./DotPortrait.jsx";
import TypedIntro from "./TypedIntro.jsx";
import { INTRO, ROLE, SOCIALS } from "../content/data.js";
import { FIGURE_START } from "../lib/travelers.js";

/** The first screen's centre: the polaroid, the name, the typed intro and the ways to reach Joshua. */
export default function Hero() {
  return (
    <>
      <figure className="polaroid" data-traveler="polaroid" style={{ "--to-x": FIGURE_START.x, "--to-y": FIGURE_START.y }}>
        <span className="tape" aria-hidden="true" />
        <DotPortrait src="/headshot-grin.jpg" alt="Joshua Moorehead, drawn in dots" />
      </figure>
      <div className="hero">
        <h1>
          hello, i&apos;m joshua moorehead
          <svg className="scribble" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 8 C 60 2, 140 12, 298 6 M20 13 C 100 9, 200 15, 280 11" />
          </svg>
        </h1>
        <p className="role">{ROLE}</p>
        <TypedIntro tokens={INTRO} />
        <p className="socials">
          <span className="hand">reach me</span>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              className="pill"
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noreferrer" : undefined}
              data-c="ring"
              data-prev={s.prev}
              data-ph={s.ph}
              data-cap={s.cap}
            >
              {s.label}
            </a>
          ))}
        </p>
      </div>
    </>
  );
}
