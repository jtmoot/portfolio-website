import { useEffect, useRef } from "react";
import DotPortrait from "./DotPortrait.jsx";
import HandName from "./HandName.jsx";
import IntroTools from "./IntroTools.jsx";
import TypedIntro from "./TypedIntro.jsx";
import { unlock } from "../lib/audio.js";
import { INTRO, ROLE, SOCIALS } from "../content/data.js";
import { FIGURE_START } from "../lib/travelers.js";

/**
 * The first screen's centre: the polaroid, the name, the typed intro and the ways to reach Joshua.
 * The name types itself on load; browsers keep the page silent until a gesture, so the first click
 * or key press retypes it with the sound, and the paragraph too. The creative-mode toggle only
 * unlocks sound: it plays its own page flip.
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
      // The replay and mute icons do their own thing, and the toggle turns the page instead.
      if (e.target instanceof Element && e.target.closest('.intro-tools, [data-sound="flip"]')) return;
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
        <HandName ref={name} text="Joshua Moorehead" />
        <p className="role">
          {ROLE}
          <IntroTools onReplay={replay} />
        </p>
        <TypedIntro ref={intro} tokens={INTRO} />
        <p className="socials">
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
