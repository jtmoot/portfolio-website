import { EXPERIENCE } from "../content/data.js";

/** Experience rows; hovering a row shows its photo in the preview card. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-h">
      <h2 id="experience-h">experience</h2>
      <ol className="xp">
        {EXPERIENCE.map((x) => (
          <li key={x.id} className="xrow" data-c="ring" data-prev={x.preview || undefined} data-ph={x.ph || undefined} data-cap={x.company}>
            {x.logo ? <img className="logo" src={x.logo} alt="" /> : <span className="logo" aria-hidden="true">{x.initials}</span>}
            <span>
              <b>{x.company}</b> <span className="muted">{x.role}</span>
            </span>
            <span className="when">
              {x.dates}
              {x.now && <span className="now" aria-label="current" />}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
