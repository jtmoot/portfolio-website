import { normalize } from "../../src/lib/bookIndex.js";

const WORK = /^\/works\/OL\d+W$/;
const MAX_TITLE = 200;

/**
 * Adds one line of the ratings or reading-log dump to the per-work counts: each line is one person
 * rating a work or putting it on a shelf, so the count is how many readers the work has.
 * @param {Map<string, number>} scores
 * @param {string} line "<work key>\t<edition key>\t<rating or shelf>\t<date>"
 */
export function countLine(scores, line) {
  const tab = line.indexOf("\t");
  const key = tab < 0 ? line : line.slice(0, tab);
  if (!WORK.test(key)) return;
  scores.set(key, (scores.get(key) ?? 0) + 1);
}

/**
 * The n most-read works, ties broken by key so the same dumps always build the same index.
 * @param {Map<string, number>} scores
 * @param {number} n
 * @returns {string[]}
 */
export function topKeys(scores, n) {
  return [...scores]
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .slice(0, n)
    .map(([k]) => k);
}

/**
 * One Open Library search request for a batch of works' titles, authors and covers.
 * @param {string[]} keys
 * @returns {string}
 */
export function keyQuery(keys) {
  const params = new URLSearchParams({ q: `key:(${keys.join(" OR ")})`, fields: "key,title,author_name,cover_i", limit: String(keys.length) });
  return `https://openlibrary.org/search.json?${params}`;
}

/**
 * A search result as an index entry, or null when it has no title or author to show.
 * @param {{ key: string, title?: string, author_name?: string[], cover_i?: number }} doc
 * @returns {{ olKey: string, title: string, author: string, coverId: number | null } | null}
 */
export function toBook(doc) {
  const title = doc.title?.trim();
  const author = doc.author_name?.[0]?.trim();
  if (!title || !author || title.length > MAX_TITLE) return null;
  return { olKey: doc.key, title, author, coverId: doc.cover_i ?? null };
}

/**
 * Works that read the same (title and author, ignoring case and punctuation) listed once, keeping
 * the first, which is the most-read.
 * @template {{ title: string, author: string }} B
 * @param {B[]} books
 * @returns {B[]}
 */
export function dedupe(books) {
  const seen = new Set();
  return books.filter((b) => {
    const k = `${normalize(b.title)}|${normalize(b.author)}`;
    return !seen.has(k) && seen.add(k);
  });
}

/**
 * Asks for a batch, and when that fails, for each half in turn, down to single works. A work that
 * fails alone is handed to `skip` (and left out of the cache, so a rerun tries it again).
 * @param {string[]} keys
 * @param {(keys: string[]) => Promise<object[]>} ask rejects when the request keeps failing
 * @param {(key: string) => void} skip
 * @returns {Promise<object[]>}
 */
export async function askInHalves(keys, ask, skip) {
  try {
    return await ask(keys);
  } catch (err) {
    if (keys.length === 1) {
      skip(keys[0], err);
      return [];
    }
    const mid = Math.ceil(keys.length / 2);
    return [...(await askInHalves(keys.slice(0, mid), ask, skip)), ...(await askInHalves(keys.slice(mid), ask, skip))];
  }
}

/**
 * Extra words a few books are searched by but that their Open Library titles don't contain, by
 * work key. Checked by hand against the built index.
 */
export const ALIASES = {
  "/works/OL1168083W": "1984", // Open Library has it as Nineteen Eighty-Four
};

/**
 * Books with their ALIASES attached as `also`.
 * @template {{ olKey: string }} B
 * @param {B[]} books
 * @returns {(B & { also?: string })[]}
 */
export function withAliases(books) {
  return books.map((b) => (ALIASES[b.olKey] ? { ...b, also: ALIASES[b.olKey] } : b));
}
