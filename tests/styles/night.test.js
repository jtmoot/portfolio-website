import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = ["src/styles/iso.css", "src/styles/creative.css"].map((f) => readFileSync(resolve(process.cwd(), f), "utf8")).join("\n");

describe("night theme", () => {
  it("every material that sets its own top tone has a night override", () => {
    const materials = new Set([...css.matchAll(/(?:^|\n|\})\s*(?:\.iso )?\.(f?m-[a-z0-9-]+)\{[^}]*--anatomy-top/g)].map((m) => m[1]));
    // Figure materials (fm-*) render inside <use> shadow trees that night selectors cannot reach;
    // the figure keeps its colours, and its hair is lifted through host variables instead.
    materials.forEach((m) => m.startsWith("fm-") && materials.delete(m));
    const has = (sel) => css.includes(`${sel}{`) || css.includes(`${sel} {`) || css.includes(`${sel},`);
    const missing = [...materials].filter((m) => !has(`html[data-theme="night"] .iso .${m}`) && !has(`html[data-theme="night"] .${m}`));
    expect(missing).toEqual([]);
  });

  it("station labels carry a paper-coloured halo so they read over drawings", () => {
    expect(css).toMatch(/\.station-label\s*\{[^}]*text-shadow/);
  });

  it("lifts the figure's hair at night through host variables", () => {
    expect(css).toMatch(/html\[data-theme="night"\] \.figure\{[^}]*--hair:/);
  });
});
