import { useEffect, useId, useRef, useState } from "react";
import { LIMITS, validate } from "../lib/recommend.js";
import { openBookSearch } from "../lib/bookSearch.js";

/** Shown at most; fewer than this from the index and Open Library is asked too. */
const SHOWN = 5;
/** The pause before asking Open Library (through /api/books) for the long tail. */
const REMOTE_MS = 250;
const EMPTY = { title: "", author: "", note: "", name: "", website: "" };
const UNREACHABLE = "Couldn't reach the list. Try again later.";

/**
 * Open Library's matches for what has been typed, through the site's edge-cached /api/books, or
 * none if that fails.
 * @param {string} q
 * @param {typeof fetch} fetcher
 * @param {AbortSignal} signal
 */
async function remote(q, fetcher, signal) {
  try {
    const res = await fetcher(`/api/books?q=${encodeURIComponent(q)}`, { signal });
    if (!res.ok) return [];
    const { books = [] } = await res.json();
    return books;
  } catch {
    return [];
  }
}

/** The index's books first, then Open Library's that aren't already listed. */
function merge(local, more) {
  const key = (b) => `${b.title}|${b.author}`.toLowerCase();
  const seen = new Set(local.flatMap((b) => [b.olKey, key(b)]));
  return [...local, ...more.filter((b) => !seen.has(b.olKey) && !seen.has(key(b)))].slice(0, SHOWN);
}

/** "0.42 ms", "3.1 ms", "12 ms". */
const formatMs = (ms) => `${ms < 1 ? ms.toFixed(2) : ms < 10 ? ms.toFixed(1) : Math.round(ms)} ms`;

/**
 * The end of /shelf: recommend a book. Focusing the title field starts a worker with an index of the
 * 50,000 most-read books, which answers every keystroke in well under a millisecond (the time is
 * shown beside the label); for anything rarer, Open Library is asked through /api/books after a
 * short pause. Picking a book fills the author and keeps its Open Library key. It posts to
 * /api/recommend, which stores it for Joshua; nothing opens email.
 * @param {{ fetcher?: typeof fetch, openBooks?: typeof openBookSearch }} props
 */
export default function Recommend({ fetcher = globalThis.fetch, openBooks = openBookSearch }) {
  const [form, setForm] = useState(EMPTY);
  const [pick, setPick] = useState(null);
  const [options, setOptions] = useState([]);
  const [active, setActive] = useState(-1);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [speed, setSpeed] = useState(null);
  const picked = useRef(false);
  const books = useRef(null);
  const list = useId();

  const startBooks = () => {
    books.current ??= openBooks();
  };
  useEffect(() => () => books.current?.close(), []);

  useEffect(() => {
    // A pick sets the title itself; that change should not search again.
    if (picked.current) {
      picked.current = false;
      return undefined;
    }
    const q = form.title.trim();
    if (q.length < 2) {
      setOptions([]);
      return undefined;
    }
    const abort = new AbortController();
    let t = 0;
    (async () => {
      const found = (await books.current?.search(q, 8)) ?? null;
      if (abort.signal.aborted) return;
      const local = found ? found.books.slice(0, SHOWN) : [];
      setSpeed(found ? { ms: found.ms, size: found.size } : null);
      setOptions(local);
      setActive(-1);
      if (local.length >= SHOWN) return;
      t = setTimeout(async () => {
        const more = await remote(q, fetcher, abort.signal);
        if (!abort.signal.aborted && more.length) setOptions(merge(local, more));
      }, REMOTE_MS);
    })();
    return () => {
      clearTimeout(t);
      abort.abort();
    };
  }, [form.title, fetcher]);

  const field = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (key === "title") setPick(null);
    },
  });

  const choose = (o) => {
    picked.current = true;
    setForm((f) => ({ ...f, title: o.title, author: o.author || f.author }));
    setPick({ olKey: o.olKey, coverId: o.coverId });
    setOptions([]);
    setActive(-1);
  };

  const onKeyDown = (e) => {
    if (!options.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + options.length) % options.length);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Escape") {
      setOptions([]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, olKey: pick?.olKey ?? null, coverId: pick?.coverId ?? null };
    const checked = validate(payload);
    if (!checked.ok) {
      setStatus(checked.error);
      return;
    }
    setSending(true);
    setStatus("Sending…");
    try {
      const res = await fetcher("/api/recommend", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        setForm(EMPTY);
        setPick(null);
        setOptions([]);
        setStatus("Thanks. It's on the list.");
      } else {
        const body = await res.json().catch(() => ({}));
        setStatus(body.error || UNREACHABLE);
      }
    } catch {
      setStatus(UNREACHABLE);
    } finally {
      setSending(false);
    }
  };

  const optionId = (i) => `${list}-${i}`;

  return (
    <section className="recommend" aria-labelledby="rec-h">
      <h2 id="rec-h">Recommend a book</h2>
      <p className="rec-lede">Something you think I'd like? It goes straight onto my list.</p>
      <form className="rec-form" onSubmit={onSubmit} noValidate>
        <div className="rec-field rec-book">
          <label htmlFor="rec-title">Book</label>
          <span className="rec-speed" aria-hidden="true" title={speed ? `Searched ${speed.size.toLocaleString("en-US")} books in your browser` : undefined}>
            {speed ? formatMs(speed.ms) : ""}
          </span>
          <input
            id="rec-title"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={options.length > 0}
            aria-controls={list}
            aria-activedescendant={active >= 0 ? optionId(active) : undefined}
            autoComplete="off"
            maxLength={LIMITS.title}
            placeholder="Start typing a title"
            onKeyDown={onKeyDown}
            onFocus={startBooks}
            onBlur={() => setOptions([])}
            {...field("title")}
          />
          {options.length > 0 && (
            <ul className="rec-options" role="listbox" id={list}>
              {options.map((o, i) => (
                <li
                  key={o.olKey}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(o);
                  }}
                >
                  {o.coverId ? <img src={`https://covers.openlibrary.org/b/id/${o.coverId}-S.jpg`} alt="" loading="lazy" /> : <span className="rec-nocover" />}
                  <span className="rec-opt-title">{o.title}</span>
                  {o.author && <span className="rec-opt-author">{o.author}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rec-field">
          <label htmlFor="rec-author">Author</label>
          <input id="rec-author" autoComplete="off" maxLength={LIMITS.author} {...field("author")} />
        </div>
        <div className="rec-field rec-wide">
          <label htmlFor="rec-note">Why this one</label>
          <textarea id="rec-note" rows={3} maxLength={LIMITS.note} placeholder="Optional" {...field("note")} />
        </div>
        <div className="rec-field">
          <label htmlFor="rec-name">Your name</label>
          <input id="rec-name" autoComplete="name" maxLength={LIMITS.name} placeholder="Optional" {...field("name")} />
        </div>
        <div className="rec-trap" aria-hidden="true">
          <input name="website" tabIndex={-1} autoComplete="off" {...field("website")} />
        </div>
        <div className="rec-send">
          <button type="submit" disabled={sending} data-c="ring">
            Send
          </button>
          <p className="rec-status" role="status">
            {status}
          </p>
        </div>
      </form>
    </section>
  );
}
