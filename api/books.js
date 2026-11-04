import { fromOpenLibrary } from "../src/lib/recommend.js";

/**
 * GET /api/books?q=: the recommend form's long tail. Books in the browser's own index are found
 * there in under a millisecond; for anything rarer the form asks here, and this asks Open Library.
 * Answers are cached at the edge for a day, so a repeated search never reaches Open Library.
 */

const SEARCH = "https://openlibrary.org/search.json";
const TIMEOUT_MS = 4000;
const CACHED = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

const reply = (status, body, cache) => Response.json(body, { status, headers: { "cache-control": cache } });

/**
 * The endpoint's logic, with its fetch passed in so it can be tested offline.
 * @param {Request} request
 * @param {{ fetcher?: typeof fetch }} [deps]
 * @returns {Promise<Response>}
 */
export async function handle(request, { fetcher = globalThis.fetch } = {}) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  if (q.length < 2 || q.length > 100) return reply(400, { error: "Search for 2 to 100 characters." }, "public, max-age=3600");
  const params = new URLSearchParams({ q, fields: "key,title,author_name,cover_i", limit: "16" });
  try {
    const res = await fetcher(`${SEARCH}?${params}`, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`Open Library: HTTP ${res.status}`);
    const { docs = [] } = await res.json();
    return reply(200, { books: fromOpenLibrary(docs) }, CACHED);
  } catch {
    return reply(502, { books: [] }, "private, no-store");
  }
}

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export function GET(request) {
  return handle(request);
}
