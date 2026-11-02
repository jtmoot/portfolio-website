import { useEffect, useRef, useState } from "react";
import DotPortrait from "./DotPortrait.jsx";
import HandName, { nameDuration } from "./HandName.jsx";
import IntroTools from "./IntroTools.jsx";
import Intro from "./Intro.jsx";
import { unlock } from "../lib/audio.js";
import { trackHeroEnd } from "../lib/heroEnd.js";
import { openingTimes } from "../lib/opening.js";
import { INTRO, ROLE, SOCIALS } from "../content/data.js";
import { FIGURE_START } from "../lib/travelers.js";

const NAME = "Joshua Moorehead";
const T = openingTimes(nameDuration(NAME), INTRO.filter((t) => t.mark).length);
/** The opening's timeline, for the CSS animations in sheet.css. */
const TIMES = {
  "--t-role": `${T.role}ms`,
  "--t-intro": `${T.intro}ms`,
  "--t-marks": `${T.marks}ms`,
  "--t-mark-gap": `${T.markGap}ms`,
  "--t-socials": `${T.socials}ms`,
};

/**
 * The first screen's centre: the polaroid, the name, the intro and the ways to reach Joshua.
 * The opening runs in garvitsingla.in's order: the name types, the role fades in, the intro rises
 * whole, its highlights draw one after another, and the links come last. Browsers keep the page
 * silent until a gesture, so the first click or key press retypes the name with the sound and
 * redraws the highlights (the paragraph and links stay, so a first click on a link still lands).
 * The creative-mode toggle only unlocks sound: it plays its own page flip.
 */
export default function Hero() {
  const name = useRef(null);
  const hero = useRef(null);
  // Flipping between two identical animations restarts the highlights' draw on a replay.
  const [pass, setPass] = useState(0);
  const replay = () => {
    name.current?.run();
    setPass((p) => 1 - p);
  };

  useEffect(() => trackHeroEnd(hero.current), []);

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
      <div className="hero" ref={hero} data-pass={pass} style={TIMES}>
        <HandName ref={name} text={NAME} />
        <p className="role">
          {ROLE}
          <IntroTools onReplay={replay} />
        </p>
        <Intro tokens={INTRO} />
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
