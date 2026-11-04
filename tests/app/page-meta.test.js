import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

// Vitest runs from the repo root.
const html = readFileSync("index.html", "utf8");

describe("the page's title and link previews", () => {
  it("names him and his title in the tab and in shared-link previews", () => {
    expect(html).toContain("<title>Joshua Moorehead, ML systems and AI engineer</title>");
    expect(html).toContain('<meta property="og:title" content="Joshua Moorehead, ML systems and AI engineer">');
  });

  it("describes him with the same title as the line under his name", () => {
    expect(html).toContain('<meta name="description" content="Joshua Moorehead: ML systems and AI engineer, MS in Electrical and Computer Engineering at Carnegie Mellon.">');
    expect(html).toContain('<meta property="og:description" content="ML systems and AI engineer, MS in Electrical and Computer Engineering at Carnegie Mellon.">');
  });
});
