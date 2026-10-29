import { CHESS } from "../content/data.js";
import { SHELF } from "../content/shelf.js";

const NOW = SHELF.find((s) => s.id === "now").books;

/** Off the keyboard: reading, chess, running, cooking. Static content, nothing fetched. */
export default function Interests() {
  return (
    <div className="interests">
      <section id="reading" aria-labelledby="reading-h">
        <h2 id="reading-h">reading</h2>
        <ul className="plain">
          {NOW.map((b) => (
            <li key={b.id}>
              {b.title.toLowerCase()} <span className="muted">{b.author.toLowerCase()}</span>
            </li>
          ))}
        </ul>
        <p>
          <a href="/shelf" data-c="ring">
            the whole shelf
          </a>
        </p>
      </section>
      <section id="chess" aria-labelledby="chess-h">
        <h2 id="chess-h">chess</h2>
        <p>
          mostly rapid, as{" "}
          <a href={CHESS.href} target="_blank" rel="noreferrer" data-c="ring" data-ph="chess.com profile screenshot goes here" data-cap={`chess.com, ${CHESS.handle}`}>
            {CHESS.handle}
          </a>
          .
        </p>
      </section>
      <section id="running" aria-labelledby="running-h">
        <h2 id="running-h">training</h2>
        <p>functional work: barbell, kettlebells, circuits, agility and sprints, usually in a weighted vest. runs in asics novablast.</p>
      </section>
      <section id="cooking" aria-labelledby="cooking-h">
        <h2 id="cooking-h">cooking</h2>
        <p>the dutch oven does most of it. braised short ribs are the house special: seared on the stove, finished low in the oven.</p>
      </section>
    </div>
  );
}
