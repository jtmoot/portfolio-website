import { describe, it, expect } from "vitest";
import { LIMITS, validate } from "../../src/lib/recommend.js";

describe("validate", () => {
  it("accepts a title alone and trims every field", () => {
    expect(validate({ title: "  Middlemarch " })).toEqual({
      ok: true,
      value: { title: "Middlemarch", author: null, olKey: null, coverId: null, note: null, name: null },
      spam: false,
    });
  });

  it("keeps an Open Library pick's key and cover, and the optional words", () => {
    const got = validate({ title: "Stoner", author: "John Williams", olKey: "/works/OL82586W", coverId: 8231856, note: "Quiet and perfect.", name: "Sam" });
    expect(got.value).toEqual({ title: "Stoner", author: "John Williams", olKey: "/works/OL82586W", coverId: 8231856, note: "Quiet and perfect.", name: "Sam" });
  });

  it("needs a title, and says so", () => {
    expect(validate({ title: "   " })).toEqual({ ok: false, error: "Add a title." });
    expect(validate({})).toEqual({ ok: false, error: "Add a title." });
    expect(validate(null)).toEqual({ ok: false, error: "Add a title." });
  });

  it("refuses fields past their limits, naming the field", () => {
    expect(validate({ title: "x".repeat(LIMITS.title + 1) }).error).toBe(`Keep the title under ${LIMITS.title} characters.`);
    expect(validate({ title: "x", author: "x".repeat(LIMITS.author + 1) }).error).toBe(`Keep the author under ${LIMITS.author} characters.`);
    expect(validate({ title: "x", note: "x".repeat(LIMITS.note + 1) }).error).toBe(`Keep the note under ${LIMITS.note} characters.`);
    expect(validate({ title: "x", name: "x".repeat(LIMITS.name + 1) }).error).toBe(`Keep your name under ${LIMITS.name} characters.`);
  });

  it("drops a key or cover that isn't Open Library's shape, and anything that isn't text", () => {
    const got = validate({ title: "x", olKey: "javascript:alert(1)", coverId: "12", author: { a: 1 } });
    expect(got.value).toMatchObject({ olKey: null, coverId: null, author: null });
  });

  it("flags a filled honeypot as spam without telling the sender", () => {
    expect(validate({ title: "x", website: "http://spam.test" })).toMatchObject({ ok: true, spam: true });
  });
});
