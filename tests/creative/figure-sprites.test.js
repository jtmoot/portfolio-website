import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ACTIONS } from "../../src/lib/figure.js";

const ART = resolve(process.cwd(), "src/creative/stations/art");

const sheet = readFileSync(resolve(ART, "figure.svg"), "utf8");
const meta = JSON.parse(readFileSync(resolve(ART, "meta.json"), "utf8"));

describe("figure sprite sheet", () => {
  it("has, for every facing, idle plus a six-frame walk and a six-frame jog", () => {
    for (const f of ["dl", "dr", "ul", "ur"]) {
      for (const fr of ["idle", "w1", "w2", "w3", "w4", "w5", "w6", "j1", "j2", "j3", "j4", "j5", "j6"]) expect(sheet).toContain(`id="f-${f}-${fr}"`);
    }
  });

  it("draws the watering can, and water only while it pours", () => {
    const sym = (id) => sheet.match(new RegExp(`<symbol id="${id}"[\\s\\S]*?</symbol>`))[0];
    expect(sym("f-ul-water1")).toContain("fm-can");
    expect(sym("f-ul-water1")).not.toContain("fm-drop");
    expect(sym("f-ul-water2")).toContain("fm-drop");
  });

  it("gives the chess reach its own arm layer, to draw over the table he stands behind", () => {
    const over = sheet.match(/<symbol id="f-dr-chess2-over"[\s\S]*?<\/symbol>/)[0];
    expect(over).toContain("fm-zip");
    expect(over).toContain("fm-skin");
    expect(over).not.toContain("fm-jog");
    expect(over).not.toContain("<use");
  });

  it("seasons the pot: a tipped shaker in the hand toward the room, flakes only while shaking", () => {
    const sym = (id) => sheet.match(new RegExp(`<symbol id="${id}"[\\s\\S]*?</symbol>`))[0];
    expect(sym("f-ur-cook1")).toContain("fm-silver");
    expect(sym("f-ur-cook1")).not.toContain("fm-flake");
    expect(sym("f-ur-cook2")).toContain("fm-flake");
    expect(sym("f-ur-cook3")).toContain("fm-flake");
  });

  it("bounces the body in the jog frames, and not in the walk", () => {
    const use = (id) => sheet.match(new RegExp(`<symbol id="${id}"[\\s\\S]*?<use ([^>]*)/>`))[1];
    expect(use("f-dr-j1")).toMatch(/y="-\d/);
    expect(use("f-dr-w1")).not.toMatch(/y="/);
  });

  it("every symbol shares one viewBox, so the feet stay put between frames", () => {
    const boxes = new Set([...sheet.matchAll(/<symbol[^>]*viewBox="([^"]+)"/g)].map((m) => m[1]));
    expect(boxes.size).toBe(1);
  });

  it("records the feet anchor in meta", () => {
    expect(meta.figure.anchor).toHaveLength(2);
  });

  it("dresses him from the photos: a quarter-zip and joggers, never a hoodie, and a watch", () => {
    expect(sheet).not.toContain("fm-hoodie");
    expect(sheet).toContain("fm-zip");
    expect(sheet).toContain("fm-jog");
    expect(sheet).toContain("fm-watch");
  });

  it("gives him swept hair: one mass with a sunlit top, strands from a loose middle part, pieces falling forward", () => {
    const body = sheet.match(/<symbol id="f-dr-body"[\s\S]*?<\/symbol>/)[0];
    expect(body).toContain('class="fm-hair-edge"');
    expect(body).toContain('class="fm-hair-sun"');
    expect(body).toContain('data-part="hair-part"');
    expect((body.match(/class="fm-hair-lock"/g) || []).length).toBe(2);
    const back = sheet.match(/<symbol id="f-ul-body"[\s\S]*?<\/symbol>/)[0];
    expect(back).not.toContain("fm-hair-lock");
    const idle = sheet.match(/<symbol id="f-dr-idle"[\s\S]*?<\/symbol>/)[0];
    expect(idle).toContain('href="#f-dr-body"');
  });

  it("has every pose the figure can ask for: each station action in its facing, and the wave", () => {
    for (const a of Object.values(ACTIONS)) for (const [name] of a.frames) expect(sheet, `${a.facing}-${name}`).toContain(`id="f-${a.facing}-${name}"`);
    expect(sheet).toContain('id="f-dr-wave1"');
    expect(sheet).toContain('id="f-dr-wave2"');
  });
});
