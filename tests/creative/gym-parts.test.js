import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { STATIONS, paintBoxes } from "../../src/creative/stations/index.js";

const gym = STATIONS.find((s) => s.id === "gym");
const meta = JSON.parse(readFileSync("src/creative/stations/art/meta.json", "utf8"));

describe("the gym in parts", () => {
  it("is a floor, a rack and a box, each a drawing of its own in the gym's box", () => {
    expect(gym.parts.map((p) => p.id)).toEqual(["gym-floor", "gym-rack", "gym-box"]);
    expect(meta.gym.parts).toEqual(["floor", "rack", "box"]);
    const whole = readFileSync("src/creative/stations/art/gym.svg", "utf8");
    const view = whole.match(/viewBox="([^"]+)"/)[1];
    for (const name of meta.gym.parts) {
      const file = `src/creative/stations/art/gym-${name}.svg`;
      expect(existsSync(file), file).toBe(true);
      expect(readFileSync(file, "utf8")).toContain(`viewBox="${view}"`);
    }
    for (const p of gym.parts) expect(p.Component.meta.anchor).toEqual(meta.gym.anchor);
  });

  it("sorts the rack and the box against him and keeps the floor under him", () => {
    const boxes = paintBoxes(STATIONS);
    const ids = boxes.map((b) => b.id);
    expect(ids).toEqual(expect.arrayContaining(["gym-floor", "gym-rack", "gym-box"]));
    expect(ids).not.toContain("gym");
    expect(boxes.find((b) => b.id === "gym-floor").flat).toBe(true);
    expect(boxes.find((b) => b.id === "gym-rack").flat).toBeUndefined();
  });

  it("keeps every part's box within the gym's footprint, give or take the bar's plates", () => {
    const f = gym.footprint;
    for (const p of gym.parts) {
      expect(p.paint.x, p.id).toBeGreaterThanOrEqual(f.x - 1);
      expect(p.paint.y, p.id).toBeGreaterThanOrEqual(f.y - 1);
      expect(p.paint.x + p.paint.w, p.id).toBeLessThanOrEqual(f.x + f.w + 1);
      expect(p.paint.y + p.paint.h, p.id).toBeLessThanOrEqual(f.y + f.h + 1);
    }
  });
});
