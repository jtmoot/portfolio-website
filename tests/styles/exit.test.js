import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/creative.css", "utf8");
const rule = (selector) => {
  const i = css.indexOf(`${selector} {`);
  expect(i, selector).toBeGreaterThan(-1);
  return css.slice(i, css.indexOf("}", i));
};

describe("the way back", () => {
  it("tips the paper from the click, on the entrance's curve, with no dead time", () => {
    const poster = rule('.stage[data-mode="pad"] .poster,\n  .stage[data-mode="pad"] .phone-poster');
    expect(poster).toMatch(/transform 1\.5s cubic-bezier\(0\.6, 0, 0\.25, 1\)[,;]/);
    expect(poster).not.toMatch(/cubic-bezier\(0\.75/);
  });

  it("sinks the drawings while the paper moves and brings the page back as it lands", () => {
    const items = rule('.stage[data-mode="pad"] .floor-item');
    expect(items).toMatch(/clip-path 0\.45s/);
    const body = rule('.stage[data-mode="pad"] .body');
    expect(body).toMatch(/opacity 0\.4s ease 1\.2s/);
    const hero = rule('.stage[data-mode="pad"] .hero');
    expect(hero).toMatch(/0\.9s ease 0\.6s/);
  });
});
