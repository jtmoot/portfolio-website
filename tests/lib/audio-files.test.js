import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";

// Vitest runs from the repo root.
describe("the sound files", () => {
  it("are all in public/audio, music included, and each is credited", () => {
    const src = readFileSync("src/lib/audio.js", "utf8");
    const files = [...src.matchAll(/"(\/audio\/[a-z-]+\.mp3)"/g)].map((m) => m[1]);
    expect(files).toContain("/audio/ambient.mp3");
    const credits = readFileSync("public/audio/SOURCES.md", "utf8");
    for (const f of files) {
      expect(existsSync(`public${f}`)).toBe(true);
      expect(credits).toContain("`" + f.split("/").pop() + "`");
    }
  });
});
