import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";

// Vitest runs from the repo root.
const css = readFileSync("src/styles/tokens.css", "utf8");
const files = [...css.matchAll(/url\("(\/fonts\/[^"]+)"\)/g)].map((m) => m[1]);

describe("the site's type", () => {
  it("sets headings in Castoro, over Geist, with no trial pairings left", () => {
    expect(css).toMatch(/--font-head: "Castoro", Georgia, serif;/);
    expect(css).toMatch(/--font-sans: "Geist",/);
    expect(css).not.toContain("data-font");
    expect(readFileSync("src/main.jsx", "utf8")).not.toContain("chooseFont");
    expect(existsSync("src/lib/font.js")).toBe(false);
  });

  it("ships exactly the font files it names, each with a licence line", () => {
    const shipped = readdirSync("public/fonts").filter((f) => f.endsWith(".woff2"));
    expect(shipped.sort()).toEqual(files.map((f) => f.split("/").pop()).sort());
    expect(shipped.sort()).toEqual(["Castoro-400.woff2", "Geist-Variable.woff2", "GeistMono-Variable.woff2", "GloriaHallelujah-Regular.woff2"]);
    const licences = readFileSync("public/fonts/LICENSES.md", "utf8");
    for (const f of shipped) expect(licences).toContain("`" + f + "`");
    for (const gone of ["Newsreader", "IBM Plex", "Brygada", "Bona Nova", "Besley", "Gloock", "Bodoni"]) expect(licences).not.toContain(gone);
  });
});
