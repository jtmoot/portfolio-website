import Sticker from "./Sticker.jsx";
import Library from "../creative/stations/Library.jsx";
import { TRAVELERS, travelerTarget } from "../lib/travelers.js";
import { LAYOUT } from "../creative/stations/layout.js";

const SPOTS = Object.values(LAYOUT);

const STICKERS = {
  brain: { src: "/stickers/brain.png", cell: 2.4, crop: [0.03, 0.1, 0.95, 0.8], alt: "a brain, from an old anatomy plate" },
  bookshelf: { Art: Library, cell: 2.2, alt: "Joshua's bookshelf" },
  king: { src: "/stickers/king.png", cell: 2.2, alt: "a chess king" },
  novablast: { src: "/stickers/shoe-standin.jpg", cell: 2.4, crop: [0, 0.48, 1, 0.52], alt: "a running shoe" },
};

/** Stand-in posters until Joshua picks prints: one each for tech, philosophy, history, finance. */
const POSTERS = {
  "poster-history": { cls: "dark", body: ["those who cannot remember the past", "are condemned to repeat it.", "", "santayana"] },
  "poster-tech": { cls: "light", body: ["make it work,", "make it right,", "make it fast."] },
  "poster-philosophy": { cls: "dark ratio-43", body: ["the unexamined life", "is not worth living.", "", "socrates"] },
  "poster-finance": { cls: "tall", body: ["the big money is not in the buying and selling, but in the waiting."] },
};

const style = (t) => ({
  "--to-x": travelerTarget(t, SPOTS).x,
  "--to-y": travelerTarget(t, SPOTS).y,
  "--from-left": t.from.left,
  "--from-top": t.from.top,
  "--from-width": t.from.width,
  "--rot": `${t.from.rot}deg`,
});

/** The left-margin stickers and right-margin posters; each is a traveler in creative mode. */
export default function Margins() {
  const stickers = TRAVELERS.filter((t) => t.kind === "sticker");
  const posters = TRAVELERS.filter((t) => t.kind === "poster");
  return (
    <>
      <div className="margin margin-left">
        {stickers.map((t, i) => (
          <figure key={t.id} className={`obj obj-sticker drift d${i}`} data-traveler={t.id} data-kind="sticker" style={style(t)} data-c="ring">
            <div className="flat">
              <Sticker {...STICKERS[t.id]} />
            </div>
            {t.label && <figcaption className="obj-label hand">{t.label}</figcaption>}
          </figure>
        ))}
      </div>
      <div className="margin margin-right">
        {posters.map((t, i) => (
          <figure key={t.id} className={`obj obj-poster drift d${i}`} data-traveler={t.id} data-kind="poster" style={style(t)} data-c="ring">
            <div className="flat">
              <span className="tape" aria-hidden="true" />
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
