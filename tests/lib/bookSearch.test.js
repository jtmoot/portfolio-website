import { describe, it, expect, vi } from "vitest";
import { gzipSync } from "node:zlib";
import { encodeIndex, decodeIndex } from "../../src/lib/bookIndex.js";
import { createBookService, loadIndex } from "../../src/lib/bookService.js";
import { openBookSearch } from "../../src/lib/bookSearch.js";

const BOOKS = [
  { title: "Dune", author: "Frank Herbert", olKey: "/works/OL893415W", coverId: 1 },
  { title: "Stoner", author: "John Williams", olKey: "/works/OL82586W", coverId: 2 },
];
const RAW = encodeIndex(BOOKS);

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("loadIndex", () => {
  it("fetches the gzipped index and unzips it in the browser", async () => {
    const gz = gzipSync(Buffer.from(RAW));
    const fetcher = vi.fn(async () => new Response(gz));
    const ix = await loadIndex(fetcher, "/books/index.bin.gz");
    expect(fetcher).toHaveBeenCalledWith("/books/index.bin.gz");
    expect(ix.book(1).title).toBe("Stoner");
  });

  it("also takes it already unzipped, when a server sent it with Content-Encoding: gzip", async () => {
    const ix = await loadIndex(async () => new Response(RAW), "/books/index.bin.gz");
    expect(ix.size).toBe(2);
  });

  it("fails on a missing index", async () => {
    await expect(loadIndex(async () => new Response("nope", { status: 404 }), "/x")).rejects.toThrow(/404/);
  });
});

describe("createBookService (the worker)", () => {
  it("says when it's ready, then answers each search with books and its own time", async () => {
    const out = [];
    const handle = createBookService({ load: async () => decodeIndex(RAW) }, (m) => out.push(m));
    await flush();
    expect(out[0]).toMatchObject({ type: "ready", size: 2 });
    handle({ type: "search", id: 1, q: "dune", k: 5 });
    expect(out[1]).toMatchObject({ type: "results", id: 1, q: "dune" });
    expect(out[1].books.map((b) => b.title)).toEqual(["Dune"]);
    expect(out[1].ms).toBeGreaterThanOrEqual(0);
  });

  it("holds a search that arrives while the index loads, answering only the latest", async () => {
    let done;
    const out = [];
    const handle = createBookService({ load: () => new Promise((r) => (done = r)) }, (m) => out.push(m));
    handle({ type: "search", id: 1, q: "d", k: 5 });
    handle({ type: "search", id: 2, q: "sto", k: 5 });
    done(decodeIndex(RAW));
    await flush();
    expect(out.map((m) => m.type)).toEqual(["ready", "results"]);
    expect(out[1]).toMatchObject({ id: 2, q: "sto" });
  });

  it("answers null books after the index fails to load, so the form falls back to Open Library", async () => {
    const out = [];
    const handle = createBookService({ load: async () => Promise.reject(new Error("404")) }, (m) => out.push(m));
    handle({ type: "search", id: 1, q: "dune", k: 5 });
    await flush();
    handle({ type: "search", id: 2, q: "dune", k: 5 });
    expect(out.map((m) => m.type)).toEqual(["error", "results", "results"]);
    expect(out[1]).toMatchObject({ id: 1, books: null });
    expect(out[2]).toMatchObject({ id: 2, books: null });
  });
});

/** A worker made from the service, wired the way the browser wires one, with async messages. */
const fakeWorker = (load) => {
  const w = { onmessage: null, terminated: false };
  const handle = createBookService({ load }, (data) => setTimeout(() => w.onmessage?.({ data }), 0));
  w.postMessage = (data) => setTimeout(() => handle(data), 0);
  w.terminate = () => (w.terminated = true);
  return w;
};

describe("openBookSearch (the page's side)", () => {
  it("starts the worker on open and resolves each search with books and keystroke-to-answer time", async () => {
    const make = vi.fn(() => fakeWorker(async () => decodeIndex(RAW)));
    let t = 100;
    const books = openBookSearch({ makeWorker: make, now: () => (t += 0.4) });
    expect(make).toHaveBeenCalledTimes(1);
    const r = await books.search("stoner", 5);
    expect(r.books.map((b) => b.title)).toEqual(["Stoner"]);
    expect(r.ms).toBeCloseTo(0.4);
    expect(r.size).toBe(2);
    books.close();
  });

  it("resolves null when the index can't load, and closes the worker", async () => {
    const w = fakeWorker(async () => Promise.reject(new Error("404")));
    const books = openBookSearch({ makeWorker: () => w });
    expect(await books.search("dune", 5)).toBeNull();
    books.close();
    expect(w.terminated).toBe(true);
  });

  it("resolves null when workers aren't available at all", async () => {
    const books = openBookSearch({
      makeWorker: () => {
        throw new Error("no Worker");
      },
    });
    expect(await books.search("dune", 5)).toBeNull();
  });
});
