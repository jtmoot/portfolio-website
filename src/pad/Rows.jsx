import { useState } from "react";

/**
 * One bullet: plain text, or text with some of its words linked ({ text, link: { words, href } }).
 * @param {{ point: string | { text: string, link: { words: string, href: string } } }} props
 */
function Point({ point }) {
  if (typeof point === "string") return <li>{point}</li>;
  const { text, link } = point;
  const at = text.indexOf(link.words);
  if (at < 0) return <li>{text}</li>;
  return (
    <li>
      {text.slice(0, at)}
      <a href={link.href} target="_blank" rel="noreferrer" data-c="ring">
        {link.words}
      </a>
      {text.slice(at + link.words.length)}
    </li>
  );
}

/**
 * One card of rows (logo, place and kind, role, dates and where); tapping a row unfolds its
 * bullets, chips, the place's own site and any links. The site sits in the unfolded part because
 * the row head is a button, and a link can't live inside one.
 * @param {{ items: object[] }} props
 */
export default function Rows({ items }) {
  const [open, setOpen] = useState(null);
  return (
  <div className="xp-card">
    <ol className="xp">
      {items.map((x) => {
        const isOpen = open === x.id;
        const panel = `xp-${x.id}`;
        return (
          <li key={x.id} className="xrow">
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
                <ul className="xp-points">
                  {x.points.map((p) => (
                    <Point key={typeof p === "string" ? p : p.text} point={p} />
                  ))}
                </ul>
                {x.stack?.length > 0 && (
                  <ul className="chips">
                    {x.stack.map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {x.site && (
                  <p className="xp-posts">
                    <a className="xp-site" href={x.site} target="_blank" rel="noreferrer" data-c="ring">
                      {new URL(x.site).hostname.replace(/^www\./, "")}
                    </a>
                  </p>
                )}
                {x.posts?.length > 0 && (
                  <p className="xp-posts">
                    {x.posts.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-c="ring">
                        {l.label}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  </div>
  );
}
