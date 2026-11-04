import { describe, it, expect } from "vitest";
import { paintOrder, stackOrder } from "../../src/lib/floor.js";

// The gym's three parts: its tiles (flat), the rack, the plyo box.
const mat = { id: "mat", footprint: { x: 70, y: 58, w: 54, h: 25 }, flat: true };
const rack = { id: "rack", footprint: { x: 69.6, y: 59.8, w: 44.8, h: 17.6 } };
const box = { id: "box", footprint: { x: 110.4, y: 72.6, w: 12, h: 10 } };

describe("a flat box", () => {
  it("is drawn before every other box", () => {
    expect(stackOrder([rack, box, mat])[0].id).toBe("mat");
    expect(stackOrder([mat, box, rack])[0].id).toBe("mat");
  });

  it("stays under him wherever he stands, while the rack and the box sort on their own", () => {
    const behindBox = paintOrder([mat, rack, box], { x: 126, y: 70 });
    expect(behindBox.indexOf("mat")).toBeLessThan(behindBox.indexOf("figure"));
    expect(behindBox.indexOf("figure")).toBeLessThan(behindBox.indexOf("box"));
    const inFront = paintOrder([mat, rack, box], { x: 84, y: 86.6 });
    expect(inFront[0]).toBe("mat");
    expect(inFront.at(-1)).toBe("figure");
    const onTheMat = paintOrder([mat, rack, box], { x: 72, y: 80 });
    expect(onTheMat.indexOf("mat")).toBeLessThan(onTheMat.indexOf("figure"));
  });
});
