// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { performance } from "node:perf_hooks";
import { decodeIndex, searchIndex } from "../../src/lib/bookIndex.js";

// The index npm run books built; vitest runs from the repo root.
const FILE = "public/books/index.bin.gz";

let ix;
beforeAll(() => {
  const gz = readFileSync(FILE);
  const raw = gunzipSync(gz);
  ix = decodeIndex(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength));
});

/** 1,000 queries the way people type them: the first letters of a title, of two words, of an author. */
function sampleQueries(n) {
  let seed = 12345;
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const out = [];
  while (out.length < n) {
    const b = ix.book(Math.floor(rand() * ix.size));
    const words = `${b.title} ${b.author}`.split(/\s+/).filter(Boolean);
    const kind = out.length % 4;
    if (kind === 0) out.push(words[0].slice(0, 1 + Math.floor(rand() * 4)));
    else if (kind === 1) out.push(`${words[0]} ${(words[1] ?? "").slice(0, 2)}`);
    else if (kind === 2) out.push(b.author.split(/\s+/).at(-1).slice(0, 3));
    else out.push(b.title.slice(0, 2 + Math.floor(rand() * 10)));
  }
  return out;
}

describe("the built book index", () => {
  it("holds tens of thousands of books in under 2.5 MB gzipped", () => {
    expect(ix.size).toBeGreaterThanOrEqual(40000);
    expect(readFileSync(FILE).length).toBeLessThan(2.5e6);
  });

  it("finds the books people actually recommend, best first", () => {
    const first = (q) => searchIndex(ix, q, 5)[0];
    expect(first("dune")).toMatchObject({ title: "Dune", author: "Frank Herbert" });
    expect(first("pride and prej").title).toMatch(/^Pride and Prejudice/);
    expect(first("harry potter").title).toMatch(/^Harry Potter/);
    expect(first("1984").author).toBe("George Orwell");
    expect(first("tolkien").author).toBe("J.R.R. Tolkien");
    expect(first("gatsby").title).toBe("The Great Gatsby");
  });

  it("answers 1,000 typed queries with a p99 under 5 ms", () => {
    const queries = sampleQueries(1000);
    for (const q of queries.slice(0, 50)) searchIndex(ix, q, 8); // warm the JIT
    const times = queries.map((q) => {
      const t0 = performance.now();
      searchIndex(ix, q, 8);
      return performance.now() - t0;
    });
    times.sort((a, b) => a - b);
    const p50 = times[499];
    const p99 = times[989];
    console.info(`book index: p50 ${p50.toFixed(3)} ms, p99 ${p99.toFixed(3)} ms, max ${times.at(-1).toFixed(3)} ms over ${ix.size} books`);
    expect(p99).toBeLessThan(5);
  });
});
