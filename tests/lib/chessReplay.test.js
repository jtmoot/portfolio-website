import { describe, it, expect } from "vitest";
import { START, LINE, stepsOf, positionAt } from "../../src/lib/chessReplay.js";

const kind = (sq) => START[sq];
const legal = (type, [r0, f0], [r1, f1]) => {
  const dr = r1 - r0;
  const df = f1 - f0;
  if (type === "knight") return (Math.abs(dr) === 2 && Math.abs(df) === 1) || (Math.abs(dr) === 1 && Math.abs(df) === 2);
  if (type === "bishop") return Math.abs(dr) === Math.abs(df) && dr !== 0;
  if (type === "rook") return (dr === 0) !== (df === 0);
  if (type === "queen") return Math.abs(dr) === Math.abs(df) || dr === 0 || df === 0;
  return true;
};

describe("chess replay", () => {
  it("plays a line of legal moves for the pieces it moves, alternating sides", () => {
    let pos = { ...START };
    LINE.forEach(([from, to], i) => {
      const piece = pos[from];
      expect(piece, `move ${i} from ${from}`).toBeDefined();
      expect(piece.side).toBe(i % 2 ? "b" : "w");
      expect(legal(piece.type, from.split(",").map(Number), to.split(",").map(Number))).toBe(true);
      if (pos[to]) expect(pos[to].side).not.toBe(piece.side);
      pos = { ...pos, [to]: piece };
      delete pos[from];
    });
    expect(kind("0,6").type).toBe("king");
  });

  it("goes forward through the line, then takes it back to the start", () => {
    const steps = stepsOf(LINE);
    expect(steps).toHaveLength(LINE.length * 2);
    expect(positionAt(steps.length)).toEqual(START);
    expect(positionAt(LINE.length)["4,3"].side).toBe("w");
  });

  it("each step names the piece's square before and after, and any capture", () => {
    const [first] = stepsOf(LINE);
    expect(first).toEqual({ from: "2,5", to: "4,4", captured: null, undo: false });
    const capture = stepsOf(LINE).find((s) => s.captured);
    expect(capture.captured).toBe("4,3");
    const restore = stepsOf(LINE).find((s) => s.undo && s.captured);
    expect(restore.from).toBe("4,3");
  });
});
