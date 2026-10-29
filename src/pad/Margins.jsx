import { useEffect, useState } from "react";
import Sticker from "./Sticker.jsx";
import OpenBook from "./OpenBook.jsx";
import { TRAVELERS, travelerTarget } from "../lib/travelers.js";
import { LAYOUT } from "../creative/stations/layout.js";

const SPOTS = Object.values(LAYOUT);

const STICKERS = {
  brain: { src: "/stickers/brain.png", cell: 2.4, crop: [0.03, 0.1, 0.95, 0.8], alt: "a brain, from an old anatomy plate" },
  book: { Art: OpenBook, cell: 2.2, alt: "an open book" },
  king: { src: "/stickers/king.png", cell: 2.2, alt: "a chess king" },
  novablast: { src: "/stickers/shoe-standin.jpg", cell: 2.4, crop: [0, 0.48, 1, 0.52], alt: "a running shoe" },
};

/** Stand-in posters until Joshua picks prints: one each for tech, philosophy, history, finance. */
/** Each poster is taped twice, like Garvit's: where the two strips sit, and their colours. */
const POSTERS = {
  "poster-history": { tape: ["top", "br peach"], cls: "dark", body: ["Those who cannot remember the past", "are condemned to repeat it.", "", "Santayana"] },
  "poster-tech": { tape: ["tl", "br peach"], cls: "light", body: ["Make it work,", "make it right,", "make it fast."] },
  "poster-philosophy": { tape: ["tl peach", "tr"], cls: "dark ratio-43", body: ["The unexamined life", "is not worth living.", "", "Socrates"] },
  "poster-finance": { tape: ["top peach", "bl"], cls: "tall", body: ["The big money is not in the buying and selling, but in the waiting."] },
};

const style = (t) => ({
  "--to-x": travelerTarget(t, SPOTS).x,
  "--to-y": travelerTarget(t, SPOTS).y,
  "--from-left": t.from.left,
  "--from-top": t.from.top,
  "--from-width": t.from.width,
  "--rot": `${t.from.rot}deg`,
});

/** Garvit's sticker tag: a scrap of dotted paper with an arrow and a handwritten word. */
function Tag({ text }) {
  return (
    <span className="obj-tag obj-label hand">
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2.5 9.5 L9 3 M4.5 3 H9 V7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </span>
  );
}

/** Length of the tap wobble (matches sticker-wobble in sheet.css). */
export const WOBBLE_MS = 600;

/**
 * The left-margin stickers and right-margin posters; each is a traveler in creative mode. Stickers
 * float on their own loops, grow on hover and wobble when tapped, like garvitsingla.in's doodles.
 */
export default function Margins() {
  const [tapped, setTapped] = useState(null);
  useEffect(() => {
    if (!tapped) return undefined;
    const t = setTimeout(() => setTapped(null), WOBBLE_MS);
    return () => clearTimeout(t);
  }, [tapped]);
  const stickers = TRAVELERS.filter((t) => t.kind === "sticker");
  const posters = TRAVELERS.filter((t) => t.kind === "poster");
  return (
    <>
      <div className="margin margin-left">
        {stickers.map((t, i) => (
          <figure
            key={t.id}
            className={`obj obj-sticker${tapped === t.id ? " tapped" : ""}`}
            data-traveler={t.id}
            data-kind="sticker"
            style={style(t)}
            data-c="ring"
            onPointerDown={() => setTapped(t.id)}
          >
            {t.tag ? (
              <a
                className="obj-link"
                href={t.tag.href}
                target={t.tag.href.startsWith("http") ? "_blank" : undefined}
                rel={t.tag.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <div className={`flat float f${i}`}>
                  <Sticker {...STICKERS[t.id]} />
                </div>
                <Tag text={t.tag.text} />
              </a>
            ) : (
              <div className={`flat float f${i}`}>
                <Sticker {...STICKERS[t.id]} />
              </div>
            )}
          </figure>
        ))}
      </div>
      <div className="margin margin-right">
        {posters.map((t, i) => (
          <figure key={t.id} className={`obj obj-poster drift d${i}`} data-traveler={t.id} data-kind="poster" style={style(t)} data-c="ring">
            <div className="flat">
              {POSTERS[t.id].tape.map((at) => (
                <span key={at} className={`tape ${at}`} aria-hidden="true" />
              ))}
              <div className={`poster-in ${POSTERS[t.id].cls}`}>
                {POSTERS[t.id].body.map((line, j) => (line ? <span key={j}>{line}</span> : <br key={j} />))}
              </div>
            </div>
          </figure>
        ))}
      </div>
    </>
  );
}
