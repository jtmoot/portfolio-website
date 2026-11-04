/**
 * A packed, prefix-searchable index of the most-read books, built by tools/books/build-index.mjs and
 * searched in a worker by src/lib/bookWorker.js. One ArrayBuffer, read through typed-array views
 * with no parsing:
 *
 *   header   10 x u32   magic "BOK1", version, books, tokens, postings, text bytes, token bytes, flags
 *   olKey    u32[books]       the number in /works/OL<n>W
 *   cover    u32[books]       Open Library cover id, 0 for none
 *   bookOff  u32[books + 1]   where each "title\u0001author" starts in the text (UTF-16 units)
 *   tokOff   u32[tokens + 1]  where each token starts in the token text; tokens sorted
 *   postOff  u32[tokens + 1]  where each token's postings start
 *   postings u16 or u32[postings]  book numbers per token, ascending (books are in most-read order)
 *   text, token text          UTF-8
 *
 * A book's number is its rank, so a token's postings are already in popularity order.
 */

const MAGIC = 0x314b4f42; // "BOK1", little-endian
const VERSION = 1;
const HEADER = 10;
const SEP = "\u0001";
const WIDE = 1; // flags: postings are u32 rather than u16

/**
 * Lowercase, without accents or punctuation; apostrophes join their word ("Ender's" is "enders").
 * @param {string} s
 * @returns {string} words separated by single spaces
 */
export function normalize(s) {
  return String(s)
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** @param {string} s @returns {string[]} the normalized words of s */
export const tokens = (s) => {
  const n = normalize(s);
  return n ? n.split(" ") : [];
};

const clean = (s) => String(s ?? "").replace(/[\u0000-\u001f]+/g, " ").trim();
const keyNumber = (olKey) => {
  const m = /^\/works\/OL(\d+)W$/.exec(olKey);
  if (!m) throw new Error(`not a work key: ${olKey}`);
  return Number(m[1]);
};
const pad4 = (n) => (n + 3) & ~3;

/**
 * Packs books, most-read first, into an index. `also` holds extra words a book is found by but
 * that are never shown ("1984" for Nineteen Eighty-Four).
 * @param {{ title: string, author: string, olKey: string, coverId?: number | null, also?: string }[]} books
 * @returns {ArrayBuffer}
 */
export function encodeIndex(books) {
  const n = books.length;
  const postingsOf = new Map();
  let text = "";
  const bookOff = new Uint32Array(n + 1);
  books.forEach((b, i) => {
    const title = clean(b.title);
    const author = clean(b.author);
    bookOff[i] = text.length;
    text += title + SEP + author;
    for (const t of new Set(tokens(`${title} ${author} ${clean(b.also)}`))) {
      if (!postingsOf.has(t)) postingsOf.set(t, []);
      postingsOf.get(t).push(i);
    }
  });
  bookOff[n] = text.length;

  const sorted = [...postingsOf.keys()].sort();
  const tokOff = new Uint32Array(sorted.length + 1);
  const postOff = new Uint32Array(sorted.length + 1);
  let tokText = "";
  let total = 0;
  sorted.forEach((t, i) => {
    tokOff[i] = tokText.length;
    postOff[i] = total;
    tokText += t;
    total += postingsOf.get(t).length;
  });
  tokOff[sorted.length] = tokText.length;
  postOff[sorted.length] = total;

  const wide = n > 0xffff;
  const enc = new TextEncoder();
  const textBytes = enc.encode(text);
  const tokBytes = enc.encode(tokText);

  const sizes = [HEADER * 4, n * 4, n * 4, (n + 1) * 4, (sorted.length + 1) * 4, (sorted.length + 1) * 4, pad4(total * (wide ? 4 : 2)), textBytes.length, tokBytes.length];
  const buf = new ArrayBuffer(sizes.reduce((a, b) => a + b, 0));
  let at = 0;
  const take = (bytes) => {
    const start = at;
    at += bytes;
    return start;
  };
  new Uint32Array(buf, take(sizes[0]), HEADER).set([MAGIC, VERSION, n, sorted.length, total, textBytes.length, tokBytes.length, wide ? WIDE : 0]);
  new Uint32Array(buf, take(sizes[1]), n).set(books.map((b) => keyNumber(b.olKey)));
  new Uint32Array(buf, take(sizes[2]), n).set(books.map((b) => b.coverId || 0));
  new Uint32Array(buf, take(sizes[3]), n + 1).set(bookOff);
  new Uint32Array(buf, take(sizes[4]), sorted.length + 1).set(tokOff);
  new Uint32Array(buf, take(sizes[5]), sorted.length + 1).set(postOff);
  const post = wide ? new Uint32Array(buf, take(sizes[6]), total) : new Uint16Array(buf, take(sizes[6]), total);
  let p = 0;
  for (const t of sorted) for (const id of postingsOf.get(t)) post[p++] = id;
  new Uint8Array(buf, take(sizes[7]), textBytes.length).set(textBytes);
  new Uint8Array(buf, take(sizes[8]), tokBytes.length).set(tokBytes);
  return buf;
}

/**
 * Opens an index for searching: typed-array views over the buffer, and the two texts decoded once.
 * @param {ArrayBuffer} buf
 */
export function decodeIndex(buf) {
  const head = buf.byteLength >= HEADER * 4 ? new Uint32Array(buf, 0, HEADER) : null;
  if (!head || head[0] !== MAGIC || head[1] !== VERSION) throw new Error("This is not a book index (or an old version).");
  const [, , n, nTok, total, textLen, tokLen, flags] = head;
  let at = HEADER * 4;
  const u32 = (len) => {
    const v = new Uint32Array(buf, at, len);
    at += len * 4;
    return v;
  };
  const olKey = u32(n);
  const cover = u32(n);
  const bookOff = u32(n + 1);
  const tokOff = u32(nTok + 1);
  const postOff = u32(nTok + 1);
  const wide = (flags & WIDE) !== 0;
  const postings = wide ? new Uint32Array(buf, at, total) : new Uint16Array(buf, at, total);
  at += pad4(total * (wide ? 4 : 2));
  const dec = new TextDecoder();
  const text = dec.decode(new Uint8Array(buf, at, textLen));
  at += textLen;
  const tokText = dec.decode(new Uint8Array(buf, at, tokLen));

  return {
    size: n,
    tokenCount: nTok,
    olKey,
    cover,
    bookOff,
    tokOff,
    postOff,
    postings,
    text,
    tokText,
    /** Scratch for searchIndex: how many query words each book has matched so far. */
    hits: new Uint8Array(n),
    /** @param {number} i a book's rank */
    book(i) {
      const [title, author] = text.slice(bookOff[i], bookOff[i + 1]).split(SEP);
      return { title, author, olKey: `/works/OL${olKey[i]}W`, coverId: cover[i] || null };
    },
    /** @param {number} i */
    token(i) {
      return tokText.slice(tokOff[i], tokOff[i + 1]);
    },
  };
}

/** The first token at or after `s`, by binary search. */
function lowerBound(ix, s) {
  let lo = 0;
  let hi = ix.tokenCount;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (ix.token(mid) < s) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * The most-read books in which every word of `q` begins a word of the title or author (or one of
 * its extra words), most-read first.
 * @param {ReturnType<typeof decodeIndex>} ix
 * @param {string} q
 * @param {number} [k]
 * @returns {{ title: string, author: string, olKey: string, coverId: number | null }[]}
 */
export function searchIndex(ix, q, k = 8) {
  const words = [...new Set(tokens(q))];
  if (!words.length || words.length > 255) return [];
  const { hits, postings, postOff } = ix;
  hits.fill(0);
  // Each word's prefix is a run of sorted tokens; a book counts once per word, however many of
  // its tokens are in the run.
  for (let w = 0; w < words.length; w++) {
    const lo = lowerBound(ix, words[w]);
    const hi = lowerBound(ix, `${words[w]}\uffff`);
    if (lo === hi) return [];
    for (let p = postOff[lo], end = postOff[hi]; p < end; p++) {
      const id = postings[p];
      if (hits[id] === w) hits[id] = w + 1;
    }
  }
  // Books are numbered by rank, so the first k that match every word are the k most-read.
  const found = [];
  for (let id = 0; id < ix.size && found.length < k; id++) if (hits[id] === words.length) found.push(ix.book(id));
  return found;
}
