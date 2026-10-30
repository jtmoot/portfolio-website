import { useEffect, useRef } from "react";
import DotPortrait from "./DotPortrait.jsx";
import HandName from "./HandName.jsx";
import TypedIntro from "./TypedIntro.jsx";
import { unlock } from "../lib/audio.js";
import { INTRO, ROLE, SOCIALS } from "../content/data.js";
import { FIGURE_START } from "../lib/travelers.js";

/**
 * The first screen's centre: the polaroid, the name, the typed intro and the ways to reach Joshua.
 * The name writes itself on load; browsers keep the page silent until a gesture, so (like
 * garvitsingla.in) the first click or key press rewrites it with the pencil, and the paragraph too.
 */
export default function Hero() {
  const name = useRef(null);
  const intro = useRef(null);
  const replay = () => {
    name.current?.run();
    intro.current?.run(150);
  };

  useEffect(() => {
    name.current?.run();
    const first = (e) => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
      unlock();
      // The replay and mute icons do their own thing.
      if (e.target instanceof Element && e.target.closest(".intro-tools")) return;
      replay();
    };
    window.addEventListener("pointerdown", first);
    window.addEventListener("keydown", first);
    return () => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
    };
  }, []);

  return (
    <>
      <figure className="polaroid" data-traveler="polaroid" style={{ "--to-x": FIGURE_START.x, "--to-y": FIGURE_START.y }}>
        <DotPortrait src="/headshot-grin.jpg" alt="Joshua Moorehead, drawn in dots" />
      </figure>
      <div className="hero">
        <HandName ref={name} text="Hello, I'm Joshua Moorehead">
          <svg className="scribble" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 8 C 60 2, 140 12, 298 6 M20 13 C 100 9, 200 15, 280 11" />
          </svg>
        </HandName>
        <p className="role">{ROLE}</p>
        <TypedIntro ref={intro} tokens={INTRO} onReplay={replay} />
        <p className="socials">
          <span className="hand">Reach me</span>
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
