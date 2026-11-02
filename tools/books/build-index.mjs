#!/usr/bin/env node
/**
 * Builds public/books/index.bin.gz, the book index the recommend form searches in the browser.
 *
 *   1. Popularity: stream Open Library's ratings and reading-log dumps (about 135 MB, gzipped) and
 *      count readers per work.
 *   2. The most-read works get their title, first author and cover from Open Library's search API,
 *      100 works per request and three requests at a time (well under the one a second Open Library
 *      asks heavy users to stay below, since each takes about 5 s), cached on disk so a rerun only
 *      asks for what's new. (The full works dump is 4 GB at about 0.5 MB/s; this asks for only the rows it needs.)
 *   3. Works without an author are dropped, repeats folded, a few hand-checked search words added
 *      (pipeline.mjs ALIASES), and the top --top packed with
 *      src/lib/bookIndex.js and gzipped.
 *
 * Usage: npm run books -- [--top 50000]   (dumps and the cache live in ~/.cache/ol-dumps, or $OL_CACHE)
 */
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, appendFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGunzip, gzipSync, constants } from "node:zlib";
import { encodeIndex } from "../../src/lib/bookIndex.js";
import { askInHalves, countLine, dedupe, keyQuery, toBook, topKeys, withAliases } from "./pipeline.mjs";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const TOP = Number(arg("top", 50000));
const CACHE = process.env.OL_CACHE || join(homedir(), ".cache", "ol-dumps");
const OUT = new URL("../../public/books/index.bin.gz", import.meta.url);
const BATCH = 100;
const PARALLEL = 3;
const UA = "joshuamoorehead.dev book index (josh.moorehead@outlook.com)";
const DUMPS = ["ratings", "reading-log"];

const log = (...a) => process.stderr.write(`${a.join(" ")}\n`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Downloads a dump once; a partial download is left as .part and retried next time. */
async function dump(name) {
  const file = join(CACHE, `${name}.txt.gz`);
  if (existsSync(file)) return file;
  log(`downloading the ${name} dump`);
  const res = await fetch(`https://openlibrary.org/data/ol_dump_${name}_latest.txt.gz`, { headers: { "user-agent": UA } });
  if (!res.ok || !res.body) throw new Error(`${name} dump: HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(`${file}.part`));
  renameSync(`${file}.part`, file);
  return file;
}

/** Readers per work, across both dumps. */
async function popularity() {
  const scores = new Map();
  for (const name of DUMPS) {
    const lines = createInterface({ input: createReadStream(await dump(name)).pipe(createGunzip()), crlfDelay: Infinity });
    let n = 0;
    for await (const line of lines) {
      countLine(scores, line);
      n++;
    }
    log(`${name}: ${n.toLocaleString()} lines`);
  }
  log(`${scores.size.toLocaleString()} works have readers`);
  return scores;
}

/** Search results by work key, from the cache file and then the API for whatever is missing. */
async function details(keys) {
  const file = join(CACHE, "works.jsonl");
  const known = new Map();
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      if (!line) continue;
      const row = JSON.parse(line);
      known.set(row.key, row.doc ?? null);
    }
  }
  const todo = keys.filter((k) => !known.has(k));
  log(`${known.size.toLocaleString()} works cached, ${todo.length.toLocaleString()} to ask for`);
  const batches = [];
  for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
  let done = 0;
  const ask = async (batch) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(keyQuery(batch), { headers: { "user-agent": UA, accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()).docs ?? [];
      } catch (err) {
        log(`a batch failed (${err.message}), retrying`);
        await sleep(2000 * attempt);
      }
    }
    throw new Error("Open Library's search kept failing");
  };
  // A batch that keeps failing is asked for in halves; a work that fails alone is skipped this run.
  const skipped = new Set();
  const skip = (key) => {
    skipped.add(key);
    log(`skipping ${key} this run`);
    if (skipped.size > 200) throw new Error("Open Library looks down; rerun later to carry on from the cache.");
  };
  // A few lanes, each taking the next batch when its last one is in.
  const lane = async () => {
    while (batches.length) {
      const batch = batches.shift();
      const found = new Map((await askInHalves(batch, ask, skip)).map((d) => [d.key, d]));
      const answered = batch.filter((k) => !skipped.has(k));
      // A key with no result (merged or deleted work) is cached as null, so it isn't asked for again.
      appendFileSync(file, answered.map((k) => `${JSON.stringify({ key: k, doc: found.get(k) ?? null })}\n`).join(""));
      for (const k of answered) known.set(k, found.get(k) ?? null);
      if (++done % 25 === 0) log(`asked for ${(done * BATCH).toLocaleString()} of ${todo.length.toLocaleString()}`);
      await sleep(250);
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, lane));
  return known;
}

async function main() {
  mkdirSync(CACHE, { recursive: true });
  const t0 = Date.now();
  const scores = await popularity();
  // Some works have no author or repeat another; ask for enough extra to still fill --top.
  const keys = topKeys(scores, Math.ceil(TOP * 1.2));
  const docs = await details(keys);
  const books = withAliases(dedupe(keys.map((k) => docs.get(k)).filter(Boolean).map(toBook).filter(Boolean)).slice(0, TOP));
  const raw = encodeIndex(books);
  const gz = gzipSync(Buffer.from(raw), { level: constants.Z_BEST_COMPRESSION });
  mkdirSync(new URL(".", OUT), { recursive: true });
  writeFileSync(OUT, gz);
  log(`${books.length.toLocaleString()} books, ${(raw.byteLength / 1e6).toFixed(2)} MB packed, ${(gz.length / 1e6).toFixed(2)} MB gzipped, in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  log(`most-read: ${books.slice(0, 5).map((b) => `${b.title} (${b.author})`).join("; ")}`);
}

main().catch((err) => {
  log(err.message);
  process.exit(1);
});
