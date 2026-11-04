const clock = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

/** The browser's worker: it loads /books/index.bin.gz and searches it off the main thread. */
const browserWorker = () => new Worker(new URL("./books.worker.js", import.meta.url), { type: "module" });

/**
 * The page's side of the book search: starts the worker (and so the index download) when opened,
 * and resolves each search with the books and the time from the call to the answer, or with null
 * when there is no index to search (no Worker, or the index failed to load).
 * @param {{ makeWorker?: () => Worker, now?: () => number }} [deps]
 * @returns {{ search: (q: string, k?: number) => Promise<{ books: object[], ms: number, size: number } | null>, close: () => void }}
 */
export function openBookSearch({ makeWorker = browserWorker, now = clock } = {}) {
  let worker = null;
  let size = 0;
  let dead = false;
  let next = 0;
  const pending = new Map();

  const settleAll = () => {
    for (const [, p] of pending) p.resolve(null);
    pending.clear();
  };

  try {
    worker = makeWorker();
    worker.onmessage = ({ data }) => {
      if (data.type === "ready") size = data.size;
      else if (data.type === "error") dead = true;
      else if (data.type === "results") {
        const p = pending.get(data.id);
        if (!p) return;
        pending.delete(data.id);
        p.resolve(data.books ? { books: data.books, ms: now() - p.t0, size } : null);
      }
    };
    worker.onerror = () => {
      dead = true;
      settleAll();
    };
  } catch {
    dead = true;
  }

  return {
    search(q, k = 8) {
      if (dead || !worker) return Promise.resolve(null);
      const id = ++next;
      return new Promise((resolve) => {
        pending.set(id, { resolve, t0: now() });
        worker.postMessage({ type: "search", id, q, k });
      });
    },
    close() {
      settleAll();
      worker?.terminate();
      worker = null;
    },
  };
}
