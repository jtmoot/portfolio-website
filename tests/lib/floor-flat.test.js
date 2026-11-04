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

describe("a box open on its +x side", () => {
  const back = { id: "reading", footprint: { x: 5, y: 32, w: 18, h: 8.5 } };
  const front = { id: "reading-front", footprint: { x: 5, y: 40.5, w: 18, h: 21.5, open: "+x" } };

  it("draws him over the chair while he walks up to its open front, and behind its front layer once he is in the seat", () => {
    const walkingUp = paintOrder([back, front], { x: 27, y: 44.2 });
    expect(walkingUp.at(-1)).toBe("figure");
    const seated = paintOrder([back, front], { x: 14.7, y: 46 });
    expect(seated).toEqual(["reading", "figure", "reading-front"]);
  });

  it("lets the pieces that cover most of him settle a disagreement, so a table's corner cannot hide him behind the chair", () => {
    const chess = { id: "chess", footprint: { x: 29, y: 60, w: 27, h: 14 } };
    // A wide piece far behind him, which he is plainly in front of, must not tip the balance either.
    const desk = { id: "desk", footprint: { x: 58, y: 0, w: 32, h: 16 } };
    // On the way from the chess table to the chair: the chair's front covers him by 8 units, the
    // table's corner by a sliver, whichever of the two is nearer.
    for (const p of [{ x: 34.58, y: 48.36 }, { x: 34.64, y: 48.44 }, { x: 36, y: 49 }]) {
      const order = paintOrder([desk, back, front, chess], p);
      expect(order.indexOf("figure"), JSON.stringify(p)).toBeGreaterThan(order.indexOf("reading-front"));
      expect(order.indexOf("figure"), JSON.stringify(p)).toBeGreaterThan(order.indexOf("desk"));
    }
  });
});
