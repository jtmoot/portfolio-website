import { useLayoutEffect, useRef } from "react";
import { PODCASTS } from "../content/shelf.js";

/** One line and a link for each station, shown when the figure (or the pointer) is near it. */
export const CARD_TEXT = {
  desk: { line: "Where the work happens.", cta: "See experience" },
  library: { line: "The short library, mostly history.", cta: "See the reading list" },
  plants: { line: "Two monsteras, a corn plant and a hosta. All thriving.", cta: null },
  kitchen: { line: "Short ribs, low and slow.", cta: null },
  gym: { line: "Barbell, kettlebells, sprints, a weighted vest.", cta: "See my runs" },
  chess: { line: "Rapid, as breakfast_enjoyer.", cta: "Open chess.com" },
  corkboard: { line: "Pinned up: the podcasts on in the background.", cta: null },
  anatomy: { line: "The brain, in sagittal section.", cta: null },
};

/**
 * @param {{ station: { id: string, link: string | null }, style: object, onNavigate: (href: string) => void }} props
 */
export default function StationCard({ station, style, onNavigate }) {
  const text = CARD_TEXT[station.id];
  const el = useRef(null);

  // Keep the card on screen: the camera can leave a station near the edge. Re-checked a few times
  // a second while open, since the camera may still be easing.
  useLayoutEffect(() => {
    const fit = () => {
      const card = el.current;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const cur = Number.parseFloat(card.style.getPropertyValue("--nudge")) || 0;
      const left = r.left - cur;
      const right = r.right - cur;
      let n = 0;
      if (right > window.innerWidth - 8) n = window.innerWidth - 8 - right;
      if (left + n < 8) n = 8 - left;
      card.style.setProperty("--nudge", `${Math.round(n)}px`);
    };
    fit();
    const t = setInterval(fit, 250);
    return () => clearInterval(t);
  }, []);
  const external = station.link?.startsWith("http");
  return (
    <div ref={el} className="station-card" style={style}>
      <p>{text.line}</p>
      {station.id === "corkboard" && (
        <ul className="pods">
          {PODCASTS.map((p) => (
            <li key={p.id}>
              <a href={p.href} target="_blank" rel="noreferrer" data-c="ring">
                <img src={p.art} alt="" width="28" height="28" />
                <span>
                  {p.name}
                  <i>{p.host}</i>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {station.link && text.cta && (
        <a
          href={station.link}
          data-c="ring"
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          onClick={(e) => {
            if (external) return;
            e.preventDefault();
            onNavigate(station.link);
          }}
        >
          {text.cta}
        </a>
      )}
    </div>
  );
}
