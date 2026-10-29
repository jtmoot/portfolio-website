import { describe, it, expect } from "vitest";
import { START, MATE, after } from "../../src/lib/chessMate.js";

const at = (sq) => sq.split(",").map(Number);
const key = (r, f) => `${r},${f}`;
const on = (r, f) => r >= 0 && r < 8 && f >= 0 && f < 8;

/** Squares a piece on `from` attacks in `pos` (pawns: captures only). */
function attacks(pos, from) {
  const { type, side } = pos[from];
  const [r, f] = at(from);
  const out = [];
  const ray = (dr, df, far) => {
    for (let i = 1; i <= (far ? 7 : 1); i++) {
      const s = [r + dr * i, f + df * i];
      if (!on(...s)) return;
      out.push(key(...s));
      if (pos[key(...s)]) return;
    }
  };
  const ROOK = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const BISHOP = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  if (type === "rook") ROOK.forEach(([a, b]) => ray(a, b, true));
  if (type === "bishop") BISHOP.forEach(([a, b]) => ray(a, b, true));
  if (type === "queen") [...ROOK, ...BISHOP].forEach(([a, b]) => ray(a, b, true));
  if (type === "king") [...ROOK, ...BISHOP].forEach(([a, b]) => ray(a, b, false));
  if (type === "knight") for (const [a, b] of [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]) if (on(r + a, f + b)) out.push(key(r + a, f + b));
  if (type === "pawn") for (const b of [-1, 1]) if (on(r + (side === "w" ? 1 : -1), f + b)) out.push(key(r + (side === "w" ? 1 : -1), f + b));
  return out;
}
const attacked = (pos, sq, by) => Object.keys(pos).some((s) => pos[s].side === by && attacks(pos, s).includes(sq));

describe("the queen's mate", () => {
  it("moves the white queen to take the black bishop", () => {
    expect(START[MATE.from]).toEqual({ type: "queen", side: "w" });
    expect(START[MATE.to]).toEqual({ type: "bishop", side: "b" });
    expect(START[MATE.king]).toEqual({ type: "king", side: "b" });
  });

  it("is a real checkmate: check, no escape square, and nothing can take the queen", () => {
    const pos = after(START, MATE);
    expect(attacked(pos, MATE.king, "w")).toBe(true);
    const [r, f] = at(MATE.king);
    for (let dr = -1; dr <= 1; dr++) {
      for (let df = -1; df <= 1; df++) {
        const s = [r + dr, f + df];
        if ((!dr && !df) || !on(...s)) continue;
        const sq = key(...s);
        if (pos[sq]?.side === "b") continue;
        const moved = { ...pos, [sq]: pos[MATE.king] };
        delete moved[MATE.king];
        expect(attacked(moved, sq, "w"), sq).toBe(true);
      }
    }
    for (const s of Object.keys(pos)) {
      if (pos[s].side !== "b" || s === MATE.king) continue;
      expect(attacks(pos, s).includes(MATE.to), s).toBe(false);
    }
  });
});
