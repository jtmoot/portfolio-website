import { describe, it, expect, vi } from "vitest";
import { handle } from "../../api/recommend.js";

const fakeDb = (count = 0) => ({ recentCount: vi.fn(async () => count), insert: vi.fn(async () => {}) });

const send = (body, { ip = "203.0.113.9", raw } = {}) =>
  new Request("https://x.test/api/recommend", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `${ip}, 10.0.0.1` },
    body: raw ?? JSON.stringify(body),
  });

const NOW = new Date("2026-11-02T18:00:00Z");
const deps = (db) => ({ db, salt: "pepper", now: () => NOW });

describe("api/recommend", () => {
  it("stores a valid recommendation with a salted hash of the IP, never the IP", async () => {
    const db = fakeDb();
    const res = await handle(send({ title: "Stoner", author: "John Williams", note: "Quiet." }), deps(db));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });
    expect(res.headers.get("cache-control")).toContain("no-store");
    const row = db.insert.mock.calls[0][0];
    expect(row).toMatchObject({ title: "Stoner", author: "John Williams", note: "Quiet.", olKey: null });
    expect(row.ipHash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(row)).not.toContain("203.0.113.9");
  });

  it("hashes the same visitor the same way and checks their last day", async () => {
    const db = fakeDb();
    await handle(send({ title: "a" }), deps(db));
    await handle(send({ title: "b" }), deps(db));
    const [h1, h2] = db.insert.mock.calls.map((c) => c[0].ipHash);
    expect(h1).toBe(h2);
    expect(db.recentCount).toHaveBeenCalledWith(h1, new Date(NOW.getTime() - 24 * 3600 * 1000));
  });

  it("turns away a sixth send in a day", async () => {
    const db = fakeDb(5);
    const res = await handle(send({ title: "x" }), deps(db));
    expect(res.status).toBe(429);
    expect((await res.json()).error).toBe("Too many sends from here today. Try again tomorrow.");
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("explains a bad send", async () => {
    const db = fakeDb();
    const empty = await handle(send({ title: " " }), deps(db));
    expect(empty.status).toBe(400);
    expect((await empty.json()).error).toBe("Add a title.");
    const junk = await handle(send(null, { raw: "{not json" }), deps(db));
    expect(junk.status).toBe(400);
    expect((await junk.json()).error).toBe("Send the form as JSON.");
    const huge = await handle(send({ title: "x", note: "y".repeat(9000) }), deps(db));
    expect(huge.status).toBe(413);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("answers a honeypot send as if it worked, and stores nothing", async () => {
    const db = fakeDb();
    const res = await handle(send({ title: "x", website: "spam" }), deps(db));
    expect(res.status).toBe(201);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("says the list is unreachable when the database fails or isn't configured", async () => {
    const db = { recentCount: vi.fn(async () => { throw new Error("ECONNREFUSED"); }), insert: vi.fn() };
    const down = await handle(send({ title: "x" }), deps(db));
    expect(down.status).toBe(503);
    expect((await down.json()).error).toBe("Couldn't reach the list. Try again later.");
    const unset = await handle(send({ title: "x" }), { db: null, salt: "", now: () => NOW });
    expect(unset.status).toBe(503);
  });
});
