import { describe, it, expect } from "vitest";
import { overlaps, paintOrder, stackOrder } from "../../src/lib/floor.js";

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
    expect(inFront.indexOf("rack")).toBeLessThan(inFront.indexOf("figure"));
    const onTheMat = paintOrder([mat, rack, box], { x: 72, y: 80 });
    expect(onTheMat.indexOf("mat")).toBeLessThan(onTheMat.indexOf("figure"));
  });

  it("is decided by the boxes that can touch him on screen, so a far one cannot pull him over the rack he walks behind", () => {
    // Behind the rack on the way from the kitchen to the gym; the reading chair is far away.
    const chair = { id: "reading", footprint: { x: 5, y: 32, w: 18, h: 8.5 } };
    const chairFront = { id: "reading-front", footprint: { x: 5, y: 40.5, w: 18, h: 21.5 } };
    const chess = { id: "chess", footprint: { x: 29, y: 60, w: 27, h: 14 } };
    const kitchen = { id: "kitchen", footprint: { x: 137, y: 30, w: 13, h: 36 } };
    const all = [mat, rack, box, chess, chair, chairFront, kitchen];
    for (const x of [100, 85, 72]) {
      const order = paintOrder(all, { x, y: 52 });
      expect(order.indexOf("figure"), `x ${x}`).toBeLessThan(order.indexOf("rack"));
      expect(order.indexOf("mat"), `x ${x}`).toBeLessThan(order.indexOf("figure"));
    }
    // Just past the end of the bar, still behind it: the rack cannot touch him, so it says nothing;
    // the chess table, which can, keeps him behind it.
    const p = { x: 69.5, y: 48 };
    expect(overlaps(p, rack.footprint)).toBe(false);
    const past = paintOrder(all, p);
    expect(past.indexOf("figure")).toBeLessThan(past.indexOf("chess"));
  });
});

describe("the reading chair, facing the camera", () => {
  const back = { id: "reading", footprint: { x: 15.5, y: 31, w: 8, h: 24.2 } };
  const front = { id: "reading-front", footprint: { x: 5, y: 48, w: 18.5, h: 16 } };

  it("draws him whole in front of it as he walks up, between its layers in the seat, and behind it when he stands behind it", () => {
    for (const p of [{ x: 4, y: 66 }, { x: 3, y: 56 }, { x: 3, y: 46 }, { x: 2, y: 36 }]) {
      expect(paintOrder([back, front], p).at(-1), JSON.stringify(p)).toBe("figure");
    }
    for (const x of [3, 8, 12, 14.7]) {
      const order = paintOrder([back, front], { x, y: 46 });
      expect(order.indexOf("reading"), `x ${x}`).toBeLessThan(order.indexOf("figure"));
    }
    expect(paintOrder([back, front], { x: 14.7, y: 46 })).toEqual(["reading", "figure", "reading-front"]);
    for (const p of [{ x: 26.6, y: 46 }, { x: 27, y: 40 }, { x: 22, y: 26 }]) {
      expect(paintOrder([back, front], p)[0], JSON.stringify(p)).toBe("figure");
    }
  });

  it("lets the pieces that cover most of him settle a disagreement", () => {
    const chess = { id: "chess", footprint: { x: 29.5, y: 60, w: 27, h: 14 } };
    // A wide piece far behind him, which he is plainly in front of, must not tip the balance.
    const desk = { id: "desk", footprint: { x: 58, y: 0, w: 32, h: 16 } };
    for (const p of [{ x: 20, y: 68 }, { x: 10, y: 67 }]) {
      const order = paintOrder([desk, back, front, chess], p);
      expect(order.at(-1), JSON.stringify(p)).toBe("figure");
    }
  });
});
