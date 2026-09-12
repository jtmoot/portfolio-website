import { useRef } from "react";
import { useReveal } from "../hooks/useReveal.js";
import { TIMELINE } from "./data.js";

export default function Timeline() {
  const ref = useRef(null);
  useReveal(ref, { stagger: 0.1 });

  return (
    <section className="section timeline" id="timeline" ref={ref}>
      <div className="section__inner">
        <p className="eyebrow" data-reveal>
          Timeline
        </p>
        <h2 className="display" data-reveal>
          Where this is <em>heading</em>.
        </h2>
        <ol className="timeline__list">
          {TIMELINE.map((entry) => (
            <li className="timeline__item" key={entry.what} data-reveal>
              <span className="timeline__when">{entry.when}</span>
              <div>
                <p className="timeline__what">{entry.what}</p>
                <p className="timeline__where">{entry.where}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
