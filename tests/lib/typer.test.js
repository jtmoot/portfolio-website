import { describe, it, expect } from "vitest";
import { typeSchedule } from "../../src/lib/typer.js";

const TOKENS = [
  { text: "i build " },
  { text: "ml systems", mark: true },
  { text: " & <data>." },
];

describe("typeSchedule", () => {
  it("has strictly increasing times", () => {
    const s = typeSchedule(TOKENS);
    for (let i = 1; i < s.length; i++) expect(s[i].at).toBeGreaterThan(s[i - 1].at);
  });

  it("types one character per step", () => {
    const total = TOKENS.reduce((n, t) => n + t.text.length, 0);
    expect(typeSchedule(TOKENS)).toHaveLength(total);
  });

  it("ends on the full text with marks and escaped html", () => {
    const s = typeSchedule(TOKENS);
    expect(s.at(-1).html).toBe("i build <mark>ml systems</mark> &amp; &lt;data&gt;.");
  });

  it("closes an open mark mid-word", () => {
    const s = typeSchedule(TOKENS);
    expect(s[9].html).toBe("i build <mark>ml</mark>");
  });

  it("runs at about 28 characters a second by default", () => {
    const s = typeSchedule(TOKENS);
    expect(s.at(-1).at / s.length).toBeGreaterThan(25);
    expect(s.at(-1).at / s.length).toBeLessThan(60);
  });
});
