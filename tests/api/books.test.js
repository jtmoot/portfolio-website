import { describe, it, expect, vi } from "vitest";
import { handle } from "../../api/books.js";
import { fromOpenLibrary } from "../../src/lib/recommend.js";

const OL = {
  docs: [
    { key: "/works/OL82586W", title: "Stoner", author_name: ["John Williams"], cover_i: 8231856 },
    { key: "/works/OL2W", title: "Stoner", author_name: ["John Williams"] },
    { key: "/works/OL3W", title: "Stoner (stray edition)" },
    { key: "/works/OL1W", title: "Stoner and Spider", author_name: ["Ann Lee"] },
  ],
};

const get = (q) => new Request(`https://x.test/api/books${q === undefined ? "" : `?q=${encodeURIComponent(q)}`}`);

describe("fromOpenLibrary", () => {
  it("keeps books with an author, once each, as the form's suggestions", () => {
    expect(fromOpenLibrary(OL.docs)).toEqual([
      { olKey: "/works/OL82586W", title: "Stoner", author: "John Williams", coverId: 8231856 },
      { olKey: "/works/OL1W", title: "Stoner and Spider", author: "Ann Lee", coverId: null },
    ]);
  });
});

describe("api/books", () => {
  it("asks Open Library once and answers with suggestions, cached at the edge for a day", async () => {
    const fetcher = vi.fn(async () => Response.json(OL));
    const res = await handle(get("stoner wil"), { fetcher });
    const url = new URL(fetcher.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe("https://openlibrary.org/search.json");
    expect(url.searchParams.get("q")).toBe("stoner wil");
    expect(url.searchParams.get("fields")).toBe("key,title,author_name,cover_i");
    expect(res.status).toBe(200);
    expect((await res.json()).books.map((b) => b.title)).toEqual(["Stoner", "Stoner and Spider"]);
    expect(res.headers.get("cache-control")).toBe("public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  });

  it("folds case and spacing in the query, so near-identical searches share a cache entry upstream", async () => {
    const fetcher = vi.fn(async () => Response.json(OL));
    await handle(get("  Stoner   WIL "), { fetcher });
    expect(new URL(fetcher.mock.calls[0][0]).searchParams.get("q")).toBe("stoner wil");
  });

  it("refuses queries that are too short or too long, without asking Open Library", async () => {
    const fetcher = vi.fn();
    for (const q of [undefined, "", " a ", "x".repeat(101)]) {
      const res = await handle(get(q), { fetcher });
      expect(res.status).toBe(400);
    }
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("answers 502 with no books, uncached, when Open Library fails or times out", async () => {
    for (const fetcher of [async () => new Response("down", { status: 503 }), async () => Promise.reject(new DOMException("timed out", "TimeoutError"))]) {
      const res = await handle(get("stoner"), { fetcher });
      expect(res.status).toBe(502);
      expect(await res.json()).toEqual({ books: [] });
      expect(res.headers.get("cache-control")).toContain("no-store");
    }
  });
});
