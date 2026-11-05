import { useLayoutEffect, useRef } from "react";
import { PODCASTS } from "../content/shelf.js";

/** One line and a link for each station, shown when the figure (or the pointer) is near it. Joshua's own words. The brain chart has none. */
export const CARD_TEXT = {
  desk: { line: "Building, one day at a time.", cta: "See experience" },
  library: { line: "A short bookcase, mostly contained within my Kindle now.", cta: "See the reading list" },
  plants: { line: "All thriving: monsteras, a dracaena, a hosta and a money tree.", cta: null },
  kitchen: { line: "Short ribs, braised in my Dutch oven.", cta: null },
  gym: { line: "Functional fitness.", cta: "See my runs" },
  chess: { line: "A Caro-Kann type of guy", cta: "Open chess.com" },
  reading: { line: "Coffee usually. Tea sometimes. Bone broth occasionally.", cta: "See the shelf" },
  corkboard: { line: "Highly recommended!", cta: null },
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
  if (!text) return null;
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
