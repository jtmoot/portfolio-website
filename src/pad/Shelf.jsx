import Nav from "./Nav.jsx";
import Contact from "./Contact.jsx";
import { SHELF, goodreads } from "../content/shelf.js";

const ARROW = (
  <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/** A cover image, or a typeset cover for a book without one. */
function Cover({ book }) {
  if (book.cover) return <img className="cover" src={book.cover} alt="" loading="lazy" />;
  return (
    <span className="cover cover-drawn" aria-hidden="true">
      <b>{book.title}</b>
      <i>{book.author}</i>
    </span>
  );
}

/** One featured book, Garvit style: cover, handwritten title, author, topic chips, a Goodreads link. */
function Row({ book }) {
  const href = goodreads(book);
  return (
    <article className="book-row" data-book={book.id}>
      <a className="cover-link" href={href} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
        <Cover book={book} />
      </a>
      <div>
        <h3 className="hand book-title">{book.title}</h3>
        <p className="book-by">by {book.author}</p>
        <ul className="chips">
          {book.topics.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
        <p className="book-links">
          <a href={href} target="_blank" rel="noreferrer" data-c="ring">
            goodreads{ARROW}
          </a>
        </p>
      </div>
    </article>
  );
}

/** A book in a cover grid, linking to Goodreads. */
function Tile({ book }) {
  return (
    <li className="book-tile" data-book={book.id}>
      <a href={goodreads(book)} target="_blank" rel="noreferrer" data-c="ring">
        <Cover book={book} />
        <span className="tile-title">{book.title}</span>
        <span className="tile-by">
          {book.author}
          {book.note && <span className="tile-note"> · {book.note}</span>}
        </span>
      </a>
    </li>
  );
}

/**
 * /shelf: Joshua's library, after garvitsingla.in/shelf. Reading now and the textbooks are
 * featured rows in window cards; up next and already read are cover grids.
 * @param {{ theme?: "day" | "night", onToggleTheme?: () => void }} props
 */
export default function Shelf({ theme = "day", onToggleTheme = () => {} }) {
  return (
    <main className="sheet shelf-page">
      <Nav theme={theme} onToggleTheme={onToggleTheme} base="/" />
      <div className="shelf">
        <a className="back" href="/" data-c="ring">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          back to the pad
        </a>
        <p className="eyebrow">personal library · on my desk</p>
        <h1 className="hand">the shelf</h1>
        {SHELF.map((s) =>
          s.books.some((b) => b.topics.length) ? (
            <section key={s.id} id={`shelf-${s.id}`} className="shelf-card" aria-labelledby={`shelf-${s.id}-h`}>
              <div className="shelf-bar">
                <i />
                <i />
                <i />
                <h2 id={`shelf-${s.id}-h`}>
                  /{s.id === "now" ? "shelf" : "textbooks"} · {s.title}
                </h2>
              </div>
              {s.books.map((b) => (
                <Row key={b.id} book={b} />
              ))}
            </section>
          ) : (
            <section key={s.id} id={`shelf-${s.id}`} className="shelf-grid" aria-labelledby={`shelf-${s.id}-h`}>
              <h2 id={`shelf-${s.id}-h`} className="hand">
                {s.title} <span className="count">{s.books.length}</span>
              </h2>
              <ul className="tiles">
                {s.books.map((b) => (
                  <Tile key={b.id} book={b} />
                ))}
              </ul>
            </section>
          ),
        )}
        <Contact />
      </div>
    </main>
  );
}
