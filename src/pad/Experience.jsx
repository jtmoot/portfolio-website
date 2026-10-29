import { useState } from "react";
import { EXPERIENCE } from "../content/data.js";

/**
 * Experience, Garvit style: one taped card of rows (logo, place and kind, role, dates and where);
 * tapping a row unfolds its write-up and chips. Hovering a row still shows its photo in the preview card.
 */
export default function Experience() {
  const [open, setOpen] = useState(null);
  return (
    <section id="experience" aria-labelledby="experience-h">
      <h2 id="experience-h">Experience</h2>
      <div className="xp-card">
        <span className="tape card-tape" aria-hidden="true" />
        <ol className="xp">
          {EXPERIENCE.map((x) => {
            const isOpen = open === x.id;
            const panel = `xp-${x.id}`;
            return (
              <li key={x.id} className="xrow" data-prev={x.preview || undefined} data-ph={x.ph || undefined} data-cap={x.company}>
                <button
                  type="button"
                  className="xrow-head"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => setOpen(isOpen ? null : x.id)}
                  data-c="ring"
                >
                  {x.logo ? (
                    <img className="logo" src={x.logo} alt="" />
                  ) : (
                    <span className="logo" style={x.color ? { "--brand": x.color } : undefined} aria-hidden="true">
                      {x.initials}
                    </span>
                  )}
                  <span className="xp-what">
                    <span className="xp-name">
                      <b>{x.company}</b>
                      <span className="xp-kind">{x.kind}</span>
                    </span>
                    <span className="xp-role">{x.role}</span>
                  </span>
                  <span className="xp-meta">
                    <span className="when">
                      {x.dates}
                      {x.now && <span className="now" aria-label="current" />}
                    </span>
                    <span className="where">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {x.place}
                    </span>
                  </span>
                  <svg className="chev" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div id={panel} className="xp-more" data-open={isOpen || undefined} inert={!isOpen || undefined} role="region" aria-label={`${x.company}, details`}>
                  <div>
                    <p>{x.blurb}</p>
                    <ul className="chips">
                      {x.stack.map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
