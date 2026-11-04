import { useEffect, useRef, useState } from "react";
import DotPortrait from "./DotPortrait.jsx";
import HandName, { nameDuration } from "./HandName.jsx";
import IntroTools from "./IntroTools.jsx";
import Intro from "./Intro.jsx";
import { unlock } from "../lib/audio.js";
import { trackHeroEnd } from "../lib/heroEnd.js";
import { ARRIVE_MS, READY_CAP_MS, openingTimes } from "../lib/opening.js";
import { INTRO, ROLE, SOCIALS } from "../content/data.js";
import { FIGURE_START } from "../lib/travelers.js";

const NAME = "Joshua Moorehead";
const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const T = openingTimes(nameDuration(NAME), INTRO.flat().filter((t) => t.mark).length);
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
 * The opening: once the portrait is drawn, the polaroid swoops up from where it stands in the room
 * (as it does on leaving creative mode) and grows into its place; as it lands (data-go) the name types, the role fades in, the intro
 * rises whole, its highlights sweep in one after another, and the links come last. Browsers keep the page
 * silent until a gesture, so the first click or key press after the opening retypes the name with
 * the sound and redraws the highlights (the paragraph and links stay, so a first click on a link
 * still lands); one during the opening only turns the sound on.
 * The creative-mode toggle only unlocks sound: it plays its own page flip.
 */
export default function Hero() {
  const name = useRef(null);
  const hero = useRef(null);
  // Flipping between two identical animations restarts the highlights' draw on a replay.
  const [pass, setPass] = useState(0);
  // The polaroid comes in once its portrait is drawn, not while the photo is still loading.
  const [ready, setReady] = useState(false);
  const [go, setGo] = useState(false);
  const started = useRef(null);
  const replay = () => {
    name.current?.run();
    setPass((p) => 1 - p);
  };

  useEffect(() => trackHeroEnd(hero.current), []);

  const landed = useRef(false);
  const timers = useRef([]);
  const begin = () => {
    started.current = Date.now();
    setGo(true);
    name.current?.run();
  };
  // The portrait is drawn (or the photo took too long): bring the card in, and start the name as
  // it lands. Under reduced motion it is simply there.
  const arrive = () => {
    if (landed.current) return;
    landed.current = true;
    setReady(true);
    if (still()) begin();
    else timers.current.push(setTimeout(begin, ARRIVE_MS));
  };

  // A photo that takes too long doesn't hold the whole opening up.
  useEffect(() => {
    timers.current.push(setTimeout(arrive, READY_CAP_MS));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const first = (e) => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
      unlock();
      // Before or while the opening runs, a replay would knock it out of order: sound only.
      if (started.current === null || Date.now() - started.current < T.socials) return;
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
      <figure
        className="polaroid"
        data-traveler="polaroid"
        data-ready={ready || undefined}
        style={{ "--to-x": FIGURE_START.x, "--to-y": FIGURE_START.y }}
      >
        <DotPortrait src="/headshot-grin.jpg" alt="Joshua Moorehead, drawn in dots" onReady={arrive} />
      </figure>
      <div className="hero" ref={hero} data-go={go || undefined} data-pass={pass} style={TIMES}>
        <HandName ref={name} text={NAME} />
        <p className="role">
          {ROLE}
          <IntroTools onReplay={replay} />
        </p>
        <Intro paragraphs={INTRO} />
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
              data-icon={s.icon}
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
