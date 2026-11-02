import { decodeIndex, searchIndex } from "./bookIndex.js";

/**
 * Fetches the packed index and opens it. It is stored gzipped (one static file, compressed once at
 * build); a server that sends it with Content-Encoding: gzip has already unzipped it, so the first
 * two bytes decide.
 * @param {typeof fetch} fetcher
 * @param {string} url
 */
export async function loadIndex(fetcher, url) {
  const res = await fetcher(url);
  if (!res.ok) throw new Error(`book index: HTTP ${res.status}`);
  let buf = await res.arrayBuffer();
  const head = new Uint8Array(buf, 0, Math.min(2, buf.byteLength));
  if (head[0] === 0x1f && head[1] === 0x8b) {
    buf = await new Response(new Response(buf).body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  }
  return decodeIndex(buf);
}

const clock = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

/**
 * The worker's side of the book search. It loads the index at once and posts { type: "ready" };
 * each { type: "search", id, q, k } gets { type: "results", id, q, books, ms }, where ms is the
 * search alone. A search that arrives while loading waits, and only the latest is answered. If the
 * index can't load, it posts { type: "error" } and answers every search with books: null.
 * @param {{ load: () => Promise<ReturnType<typeof decodeIndex>> }} deps
 * @param {(message: object) => void} reply
 * @returns {(message: { type: string, id: number, q: string, k?: number }) => void}
 */
export function createBookService({ load }, reply) {
  let index = null;
  let failed = false;
  let waiting = null;

  const answer = ({ id, q, k = 8 }) => {
    if (!index) {
      reply({ type: "results", id, q, books: null, ms: 0 });
      return;
    }
    const t0 = clock();
    const books = searchIndex(index, q, k);
    reply({ type: "results", id, q, books, ms: clock() - t0 });
  };

  const t0 = clock();
  load().then(
    (ix) => {
      index = ix;
      reply({ type: "ready", size: ix.size, ms: clock() - t0 });
      if (waiting) answer(waiting);
      waiting = null;
    },
    (err) => {
      failed = true;
      reply({ type: "error", message: err instanceof Error ? err.message : String(err) });
      if (waiting) answer(waiting);
      waiting = null;
    },
  );

  return (msg) => {
    if (msg?.type !== "search") return;
    if (index || failed) answer(msg);
    else waiting = msg;
  };
}
