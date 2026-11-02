/** Longest each field may be, in characters. Shared by the form and the API. */
export const LIMITS = { title: 200, author: 120, note: 500, name: 60 };

const LABELS = { title: "the title", author: "the author", note: "the note", name: "your name" };

const text = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

/**
 * Checks a book recommendation before it is sent and again before it is stored. Unknown or
 * malformed optional fields are dropped rather than refused. A filled `website` (a field hidden
 * from people) marks the send as spam: it should look accepted but never be stored.
 * @param {unknown} input
 * @returns {{ ok: true, value: { title: string, author: string | null, olKey: string | null, coverId: number | null, note: string | null, name: string | null }, spam: boolean } | { ok: false, error: string }}
 */
export function validate(input) {
  const body = input && typeof input === "object" ? input : {};
  const value = {
    title: text(body.title),
    author: text(body.author),
    olKey: typeof body.olKey === "string" && /^\/works\/OL\d+W$/.test(body.olKey) ? body.olKey : null,
    coverId: Number.isInteger(body.coverId) && body.coverId > 0 ? body.coverId : null,
    note: text(body.note),
    name: text(body.name),
  };
  if (!value.title) return { ok: false, error: "Add a title." };
  for (const [field, max] of Object.entries(LIMITS)) {
    if (value[field] && value[field].length > max) return { ok: false, error: `Keep ${LABELS[field]} under ${max} characters.` };
  }
  return { ok: true, value, spam: Boolean(text(body.website)) };
}

/**
 * Open Library search results as the form's suggestions: books with an author, each listed once
 * (Open Library lists stray editions and repeats too).
 * @param {{ key: string, title: string, author_name?: string[], cover_i?: number }[]} docs
 * @param {number} [n]
 * @returns {{ olKey: string, title: string, author: string, coverId: number | null }[]}
 */
export function fromOpenLibrary(docs, n = 8) {
  const seen = new Set();
  return docs
    .filter((d) => d.title && d.author_name?.length)
    .map((d) => ({ olKey: d.key, title: d.title, author: d.author_name[0], coverId: d.cover_i ?? null }))
    .filter((o) => {
      const k = `${o.title}|${o.author}`.toLowerCase();
      return !seen.has(k) && seen.add(k);
    })
    .slice(0, n);
}
