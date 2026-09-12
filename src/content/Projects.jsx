import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "./data.js";
import { scroll, STATION_COUNT } from "../lib/scroll.js";
import { isDesktop } from "../lib/scene.js";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Pinned on desktop: one viewport, four stations crossfade as you scroll
 * through 400% of extra height. On mobile the stations simply stack.
 * The scene timeline (`scroll.beat`) is derived in useBeats; this only
 * tracks which station card is active.
 */
export default function Projects() {
  const ref = useRef(null);
  const pinRef = useRef(null);
  const [active, setActive] = useState(0);
  const [pinned] = useState(() => isDesktop());

  useGSAP(
    () => {
      const onUpdate = (self) => {
        scroll.projects = self.progress;
        const index = Math.min(STATION_COUNT - 1, Math.floor(self.progress * STATION_COUNT));
        setActive((prev) => (prev === index ? prev : index));
      };

      if (pinned) {
        ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: `+=${STATION_COUNT * 100}%`,
          pin: true,
          scrub: true,
          onUpdate,
        });
      } else {
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 50%",
          end: "bottom 50%",
          onUpdate,
        });
      }
    },
    { scope: ref, dependencies: [pinned] },
  );

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pinned]);

  const stationProgress = scroll.projects * STATION_COUNT - active;

  return (
    <section className="section projects" id="projects" ref={ref}>
      <div className="projects__pin" ref={pinRef}>
        <div className="projects__head">
          <p className="eyebrow">Selected work</p>
          <p className="projects__counter">
            <b>{PROJECTS[active].index}</b> / 0{PROJECTS.length}
          </p>
        </div>

        <div className="stations">
          {PROJECTS.map((project, i) => (
            <article
              className={`station${i === active ? " is-active" : ""}`}
              key={project.id}
              aria-hidden={pinned && i !== active}
            >
              <div>
                <p className="eyebrow">{project.tagline}</p>
                <h3 className="display">{project.title}</h3>
              </div>
              <div className="station__meta">
                <p className="lede">{project.body}</p>
                <ul className="station__stack">
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="station__links">
                  {project.links.map((link) => (
                    <a
                      className="link-arrow"
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="rail" aria-hidden>
          {PROJECTS.map((project, i) => (
            <span
              key={project.id}
              style={{ "--fill": i < active ? 1 : i === active ? Math.max(0, Math.min(1, stationProgress)) : 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
