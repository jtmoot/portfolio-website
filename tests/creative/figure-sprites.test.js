import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ART = resolve(process.cwd(), "src/creative/stations/art");

const sheet = readFileSync(resolve(ART, "figure.svg"), "utf8");
const meta = JSON.parse(readFileSync(resolve(ART, "meta.json"), "utf8"));

describe("figure sprite sheet", () => {
  it("has all 20 symbols: four facings by idle plus four walk frames", () => {
    for (const f of ["dl", "dr", "ul", "ur"]) {
      for (const fr of ["idle", "w1", "w2", "w3", "w4"]) expect(sheet).toContain(`id="f-${f}-${fr}"`);
    }
  });

  it("every symbol shares one viewBox, so the feet stay put between frames", () => {
    const boxes = new Set([...sheet.matchAll(/<symbol[^>]*viewBox="([^"]+)"/g)].map((m) => m[1]));
    expect(boxes.size).toBe(1);
  });

  it("records the feet anchor in meta", () => {
    expect(meta.figure.anchor).toHaveLength(2);
  });
});
