import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { SHELF, PODCASTS, goodreads } from "../../src/content/shelf.js";

const pub = (p) => resolve(process.cwd(), "public", p.replace(/^\//, ""));

describe("shelf content", () => {
  it("has Joshua's four lists in order", () => {
    expect(SHELF.map((s) => s.id)).toEqual(["now", "text", "next", "read"]);
    const count = Object.fromEntries(SHELF.map((s) => [s.id, s.books.length]));
    expect(count).toEqual({ now: 3, text: 3, next: 9, read: 18 });
  });

  it("gives every book a title, an author and a cover that exists (or none, for a drawn one)", () => {
    for (const b of SHELF.flatMap((s) => s.books)) {
      expect(b.title, b.id).toBeTruthy();
      expect(b.author, b.id).toBeTruthy();
      if (b.cover) expect(existsSync(pub(b.cover)), b.cover).toBe(true);
    }
  });

  it("gives the featured rows topics", () => {
    for (const id of ["now", "text"]) for (const b of SHELF.find((s) => s.id === id).books) expect(b.topics.length, b.id).toBeGreaterThan(0);
  });

  it("links each book to a Goodreads search", () => {
    expect(goodreads({ title: "Deep Work", author: "Cal Newport" })).toBe("https://www.goodreads.com/search?q=Deep%20Work%20Cal%20Newport");
  });

  it("lists the four podcasts with art that exists", () => {
    expect(PODCASTS.map((p) => p.id)).toEqual(["how-to-take-over-the-world", "founders", "maxinomics", "ai-daily-brief"]);
    for (const p of PODCASTS) {
      expect(existsSync(pub(p.art)), p.art).toBe(true);
      expect(p.href).toMatch(/^https:\/\/open\.spotify\.com\/show\/[A-Za-z0-9]{22}$/);
    }
  });
});
