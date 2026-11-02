import { useEffect, useId, useRef, useState } from "react";
import { LIMITS, validate } from "../lib/recommend.js";

const SEARCH = "https://openlibrary.org/search.json";
const DEBOUNCE_MS = 300;
const EMPTY = { title: "", author: "", note: "", name: "", website: "" };
const UNREACHABLE = "Couldn't reach the list. Try again later.";

/**
 * Up to five Open Library matches for what has been typed, each with an author and listed once,
 * or none if the search fails.
 * @param {string} q
 * @param {typeof fetch} fetcher
 * @param {AbortSignal} signal
 */
async function suggest(q, fetcher, signal) {
  const params = new URLSearchParams({ q, fields: "key,title,author_name,cover_i", limit: "12" });
  try {
    const res = await fetcher(`${SEARCH}?${params}`, { signal });
    if (!res.ok) return [];
    const { docs = [] } = await res.json();
    // Open Library lists stray editions too: keep books with an author, once each.
    const seen = new Set();
    return docs
      .filter((d) => d.author_name?.length)
      .map((d) => ({ olKey: d.key, title: d.title, author: d.author_name[0], coverId: d.cover_i ?? null }))
      .filter((o) => {
        const k = `${o.title}|${o.author}`.toLowerCase();
        return !seen.has(k) && seen.add(k);
      })
      .slice(0, 5);
  } catch {
    return [];
  }
}

/**
 * The end of /shelf: recommend a book. The title field suggests books from Open Library as you type;
 * picking one fills the author and keeps its Open Library key. It posts to /api/recommend, which
 * stores it for Joshua; nothing opens email.
 * @param {{ fetcher?: typeof fetch }} props
 */
export default function Recommend({ fetcher = globalThis.fetch }) {
  const [form, setForm] = useState(EMPTY);
  const [pick, setPick] = useState(null);
  const [options, setOptions] = useState([]);
  const [active, setActive] = useState(-1);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const picked = useRef(false);
  const list = useId();

  useEffect(() => {
    // A pick sets the title itself; that change should not search again.
    if (picked.current) {
      picked.current = false;
      return undefined;
    }
    const q = form.title.trim();
    if (q.length < 3) {
      setOptions([]);
      return undefined;
    }
    const abort = new AbortController();
    const t = setTimeout(async () => {
      const found = await suggest(q, fetcher, abort.signal);
      if (!abort.signal.aborted) {
        setOptions(found);
        setActive(-1);
      }
    }, DEBOUNCE_MS);
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
