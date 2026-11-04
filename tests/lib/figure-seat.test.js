import { describe, it, expect } from "vitest";
import { BODY, bodyFootprints, initialFigure, stepFigure } from "../../src/lib/figure.js";

// A chair: a back, two arms, and the seat between them, which he may only enter to sit.
const CHAIR = {
  id: "reading",
  footprint: { x: 6.6, y: 36.8, w: 3.2, h: 18.4 },
  seat: { x: 9.8, y: 40, w: 12.4, h: 12 },
  blocks: [
    { x: 9.8, y: 36.8, w: 12.4, h: 3.2 },
    { x: 9.8, y: 52, w: 12.4, h: 3.2 },
  ],
  standAt: { x: 14.7, y: 46 },
};
const DESK = { id: "desk", footprint: { x: 60, y: 0, w: 20, h: 10 }, standAt: { x: 70, y: 14 } };
const inSeat = (p) => p.x > CHAIR.seat.x && p.x < CHAIR.seat.x + CHAIR.seat.w && p.y > CHAIR.seat.y && p.y < CHAIR.seat.y + CHAIR.seat.h;

const tour = (stations) => ({ stations, footprints: bodyFootprints(stations) });
const walk = (state, ctx, input, seconds, seen) => {
  let s = state;
  for (let t = 0; t < seconds; t += 1 / 60) {
    s = stepFigure(s, { dir: null, tapTarget: null, ...input }, ctx, 1 / 60);
    seen?.(s);
  }
  return s;
};

describe("the reading chair's seat", () => {
  it("blocks the seat for everyone, marked as a seat", () => {
    const seat = bodyFootprints([CHAIR]).find((f) => f.seat === "reading");
    expect(seat).toMatchObject({ x: 9.8 - BODY, y: 40 - BODY });
  });

  it("can't be walked across: steering straight through the chair stops at it", () => {
    const ctx = tour([CHAIR]);
    let s = initialFigure({ x: 30, y: 46 }, { greet: false });
    let entered = false;
    s = walk(s, ctx, { dir: { dx: -1, dy: 0 } }, 3, (st) => (entered ||= inSeat(st.pos)));
    expect(entered).toBe(false);
  });

  it("still lets him walk in and sit when the chair is where he's going", () => {
    const ctx = tour([DESK, CHAIR]);
    let s = { ...initialFigure({ x: 40, y: 46 }, { greet: false }), idleIndex: 1 };
    let sat = false;
    s = walk(s, ctx, {}, 8, (st) => (sat ||= Math.hypot(st.pos.x - 14.7, st.pos.y - 46) < 1));
    expect(sat).toBe(true);
  });

  it("lets him get up and leave once he's sitting", () => {
    const ctx = tour([DESK, CHAIR]);
    let s = { ...initialFigure({ x: 14.7, y: 46 }, { greet: false }), idleIndex: 0 };
    s = walk(s, ctx, {}, 8);
    expect(inSeat(s.pos)).toBe(false);
    expect(Math.hypot(s.pos.x - 70, s.pos.y - 14)).toBeLessThan(3);
  });
});
