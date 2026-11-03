import { describe, it, expect, beforeEach } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { FONTS, chooseFont } from "../../src/lib/font.js";

describe("chooseFont", () => {
  beforeEach(() => sessionStorage.clear());

  it("defaults to the serif pairing", () => {
    expect(chooseFont("")).toBe("serif");
    expect(FONTS).toEqual(["serif", "sans", "plex", "brygada", "bona", "besley", "gloock", "castoro", "bodoni"]);
  });

  it("takes ?font= and remembers it for the visit, so /shelf keeps the same choice", () => {
    expect(chooseFont("?font=plex")).toBe("plex");
    expect(chooseFont("")).toBe("plex");
  });

  it("ignores unknown names", () => {
    expect(chooseFont("?font=comic")).toBe("serif");
  });
});

describe("the pairings' type", () => {
  // Vitest runs from the repo root.
  const css = readFileSync("src/styles/tokens.css", "utf8");

  it("gives every pairing but the default its own heading face", () => {
    for (const f of FONTS.slice(1)) expect(css).toMatch(new RegExp(`html\\[data-font="${f}"\\] \\{\\s*--font-head: "`));
  });

  it("ships every font file it names, with a licence line for each", () => {
    const files = [...css.matchAll(/url\("(\/fonts\/[^"]+)"\)/g)].map((m) => m[1]);
    const licences = readFileSync("public/fonts/LICENSES.md", "utf8");
    for (const f of files) {
      expect(existsSync(`public${f}`)).toBe(true);
      const stem = f.split("/").pop().replace(/-.*$/, "");
      expect(licences).toContain(stem.slice(0, 6));
    }
  });
});
