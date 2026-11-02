import { describe, it, expect } from "vitest";
import { countLine, topKeys, keyQuery, toBook, dedupe, withAliases, ALIASES } from "../../tools/books/pipeline.mjs";

describe("countLine", () => {
  it("counts one rating or reading-log shelf per line, by work", () => {
    const scores = new Map();
    countLine(scores, "/works/OL1W\t/books/OL9M\t5\t2018-06-20");
    countLine(scores, "/works/OL1W\t\\N\tAlready Read\t2026-08-28");
    countLine(scores, "/works/OL2W\t\\N\tWant to Read\t2026-08-28");
    expect(Object.fromEntries(scores)).toEqual({ "/works/OL1W": 2, "/works/OL2W": 1 });
  });

  it("skips blank lines and anything that isn't a work", () => {
    const scores = new Map();
    countLine(scores, "");
    countLine(scores, "/books/OL9M\t\\N\t5\t2018");
    countLine(scores, "garbage");
    expect(scores.size).toBe(0);
  });
});

describe("topKeys", () => {
  it("orders works by count, most-read first, ties by key so the build is repeatable", () => {
    const scores = new Map([
      ["/works/OL3W", 5],
      ["/works/OL1W", 9],
      ["/works/OL2W", 5],
      ["/works/OL4W", 1],
    ]);
    expect(topKeys(scores, 3)).toEqual(["/works/OL1W", "/works/OL2W", "/works/OL3W"]);
  });
});

describe("keyQuery", () => {
  it("asks Open Library's search for a batch of works in one request", () => {
    const url = new URL(keyQuery(["/works/OL1W", "/works/OL2W"]));
    expect(url.origin + url.pathname).toBe("https://openlibrary.org/search.json");
    expect(url.searchParams.get("q")).toBe("key:(/works/OL1W OR /works/OL2W)");
    expect(url.searchParams.get("fields")).toBe("key,title,author_name,cover_i");
    expect(url.searchParams.get("limit")).toBe("2");
  });
});

describe("toBook", () => {
  it("keeps a work with a title and an author, with its first author and cover", () => {
    expect(toBook({ key: "/works/OL1W", title: " Dune ", author_name: ["Frank Herbert", "Someone"], cover_i: 42 })).toEqual({ olKey: "/works/OL1W", title: "Dune", author: "Frank Herbert", coverId: 42 });
    expect(toBook({ key: "/works/OL1W", title: "Dune", author_name: ["Frank Herbert"] }).coverId).toBeNull();
  });

  it("drops works with no author or title, and absurdly long titles", () => {
    expect(toBook({ key: "/works/OL1W", title: "Dune" })).toBeNull();
    expect(toBook({ key: "/works/OL1W", author_name: ["X"] })).toBeNull();
    expect(toBook({ key: "/works/OL1W", title: "x".repeat(201), author_name: ["X"] })).toBeNull();
  });
});

describe("dedupe", () => {
  it("keeps the most-read of works that share a title and author", () => {
    const books = [
      { olKey: "/works/OL1W", title: "Dune", author: "Frank Herbert", coverId: 1 },
      { olKey: "/works/OL2W", title: "Stoner", author: "John Williams", coverId: null },
      { olKey: "/works/OL3W", title: "DUNE.", author: "Frank  Herbert", coverId: 3 },
    ];
    expect(dedupe(books).map((b) => b.olKey)).toEqual(["/works/OL1W", "/works/OL2W"]);
  });
});

describe("askInHalves", () => {
  it("splits a batch that keeps failing until the bad key is alone, then skips just that key", async () => {
    const { askInHalves } = await import("../../tools/books/pipeline.mjs");
    const ask = async (keys) => {
      if (keys.includes("/works/OL3W")) throw new Error("HTTP 500");
      return keys.map((key) => ({ key }));
    };
    const skipped = [];
    const docs = await askInHalves(["/works/OL1W", "/works/OL2W", "/works/OL3W", "/works/OL4W"], ask, (k) => skipped.push(k));
    expect(docs.map((d) => d.key)).toEqual(["/works/OL1W", "/works/OL2W", "/works/OL4W"]);
    expect(skipped).toEqual(["/works/OL3W"]);
  });

  it("asks once when the batch is fine", async () => {
    const { askInHalves } = await import("../../tools/books/pipeline.mjs");
    let calls = 0;
    const docs = await askInHalves(["/works/OL1W", "/works/OL2W"], async (keys) => (calls++, keys.map((key) => ({ key }))), () => {});
    expect(docs).toHaveLength(2);
    expect(calls).toBe(1);
  });
});

describe("withAliases", () => {
  it("lets people type 1984 for Orwell's Nineteen Eighty-Four, and leaves other books alone", () => {
    const [orwell, other] = withAliases([
      { olKey: "/works/OL1168083W", title: "Nineteen Eighty-Four", author: "George Orwell", coverId: 1 },
      { olKey: "/works/OL2W", title: "1984 (adaptation)", author: "Michael Dean", coverId: null },
    ]);
    expect(orwell.also).toBe("1984");
    expect(other.also).toBeUndefined();
    expect(ALIASES["/works/OL1168083W"]).toBe("1984");
  });
});
