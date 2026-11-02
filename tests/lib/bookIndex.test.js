import { describe, it, expect } from "vitest";
import { normalize, tokens, encodeIndex, decodeIndex, searchIndex } from "../../src/lib/bookIndex.js";

/** Most-read first: a book's place in this list is its rank. */
const BOOKS = [
  { title: "Harry Potter and the Philosopher's Stone", author: "J. K. Rowling", olKey: "/works/OL82563W", coverId: 10521270 },
  { title: "Dune", author: "Frank Herbert", olKey: "/works/OL893415W", coverId: 11481354 },
  { title: "The Hobbit", author: "J.R.R. Tolkien", olKey: "/works/OL262758W", coverId: 6979861 },
  { title: "Cien años de soledad", author: "Gabriel García Márquez", olKey: "/works/OL274505W", coverId: 0 },
  { title: "Dune Messiah", author: "Frank Herbert", olKey: "/works/OL893502W", coverId: 2 },
  { title: "Ender's Game", author: "Orson Scott Card", olKey: "/works/OL49488W", coverId: 3 },
  { title: "Café Society", author: "Ann Example", olKey: "/works/OL1W", coverId: 0 },
  { title: "Stoner", author: "John Williams", olKey: "/works/OL82586W", coverId: 8231856 },
  { title: "The Dunes of Mars", author: "Some Writer", olKey: "/works/OL2W", coverId: 0 },
  { title: "Hobbits & Hills", author: "Dune Walker", olKey: "/works/OL3W", coverId: 0 },
];

const index = () => decodeIndex(encodeIndex(BOOKS));
const titles = (q, k) => searchIndex(index(), q, k).map((b) => b.title);

describe("normalize and tokens", () => {
  it("folds case, accents and punctuation, and keeps apostrophes inside words", () => {
    expect(normalize("Café, Société!")).toBe("cafe societe");
    expect(tokens("Ender's Game")).toEqual(["enders", "game"]);
    expect(tokens("J.R.R. Tolkien")).toEqual(["j", "r", "r", "tolkien"]);
    expect(tokens("  García   Márquez ")).toEqual(["garcia", "marquez"]);
    expect(tokens("Hobbits & Hills")).toEqual(["hobbits", "hills"]);
  });
});

describe("encodeIndex and decodeIndex", () => {
  it("packs the books into one ArrayBuffer and reads them back exactly", () => {
    const buf = encodeIndex(BOOKS);
    expect(buf).toBeInstanceOf(ArrayBuffer);
    const ix = decodeIndex(buf);
    expect(ix.size).toBe(BOOKS.length);
    expect(ix.book(7)).toEqual({ title: "Stoner", author: "John Williams", olKey: "/works/OL82586W", coverId: 8231856 });
    expect(ix.book(3)).toEqual({ title: "Cien años de soledad", author: "Gabriel García Márquez", olKey: "/works/OL274505W", coverId: null });
  });

  it("refuses a buffer that isn't an index", () => {
    expect(() => decodeIndex(new ArrayBuffer(64))).toThrow(/not a book index/);
  });
});

describe("searchIndex", () => {
  it("ranks the most-read match first: dune finds Herbert's Dune before Dune Messiah", () => {
    expect(titles("dune")[0]).toBe("Dune");
    expect(titles("dune")).toContain("Dune Messiah");
  });

  it("matches every word of the query as a prefix, across title and author", () => {
    expect(titles("dune mes")).toEqual(["Dune Messiah"]);
    expect(titles("herbert")).toEqual(["Dune", "Dune Messiah"]);
    expect(titles("hob tol")).toEqual(["The Hobbit"]);
    expect(titles("stoner williams")).toEqual(["Stoner"]);
  });

  it("finds accented titles from plain typing, and the other way round", () => {
    expect(titles("cafe")).toEqual(["Café Society"]);
    expect(titles("años")).toEqual(["Cien años de soledad"]);
    expect(titles("marquez")).toEqual(["Cien años de soledad"]);
    expect(titles("enders")).toEqual(["Ender's Game"]);
  });

  it("ranks by readers alone: a book titled with an author's name doesn't jump that author's books", async () => {
    const books = [
      { title: "The Hobbit", author: "J.R.R. Tolkien", olKey: "/works/OL1W" },
      { title: "Tolkien", author: "Humphrey Carpenter", olKey: "/works/OL2W" },
    ];
    expect(searchIndex(decodeIndex(encodeIndex(books)), "tolkien").map((b) => b.title)).toEqual(["The Hobbit", "Tolkien"]);
  });

  it("finds a book by extra words that are searched but never shown", () => {
    const books = [{ title: "Nineteen Eighty-Four", author: "George Orwell", olKey: "/works/OL1W", also: "1984" }];
    const ix = decodeIndex(encodeIndex(books));
    expect(searchIndex(ix, "1984")).toEqual([{ title: "Nineteen Eighty-Four", author: "George Orwell", olKey: "/works/OL1W", coverId: null }]);
  });

  it("returns at most k books, and nothing for an empty or unmatched query", () => {
    expect(titles("h", 2)).toHaveLength(2);
    expect(titles("")).toEqual([]);
    expect(titles("   ")).toEqual([]);
    expect(titles("zzzz")).toEqual([]);
  });

  it("counts a book once even when several of its words match the prefix", () => {
    expect(titles("h").filter((t) => t === "Hobbits & Hills")).toHaveLength(1);
  });
});
