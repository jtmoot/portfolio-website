/**
 * The chess table's one move: from the drawn position, white's queen takes on g7 and it is mate
 * (the bishop on h6 guards g7; the king is boxed in by its own rook and pawns). Squares are
 * "rank,file" strings matching data-sq in chess.svg; rank 0 is white's back rank.
 */

const P = (type, side) => ({ type, side });

/** The position drawn in tools/stations/chess.mjs. */
export const START = {
  "0,6": P("king", "w"), "0,5": P("rook", "w"), "3,3": P("queen", "w"), "2,5": P("knight", "w"), "5,7": P("bishop", "w"),
  "1,0": P("pawn", "w"), "1,1": P("pawn", "w"), "1,5": P("pawn", "w"), "1,6": P("pawn", "w"), "1,7": P("pawn", "w"), "3,4": P("pawn", "w"),
  "7,6": P("king", "b"), "7,2": P("rook", "b"), "6,3": P("queen", "b"), "5,2": P("knight", "b"), "6,6": P("bishop", "b"),
  "6,0": P("pawn", "b"), "6,1": P("pawn", "b"), "6,5": P("pawn", "b"), "6,7": P("pawn", "b"), "4,3": P("pawn", "b"), "7,7": P("rook", "b"),
};

/** Qd4xg7#: the queen's square, where it lands (taking the bishop), and the king that falls. */
export const MATE = { from: "3,3", to: "6,6", king: "7,6" };

/**
 * The position after a move.
 * @param {Record<string, { type: string, side: string }>} pos
 * @param {{ from: string, to: string }} move
 */
export function after(pos, { from, to }) {
  const next = { ...pos, [to]: pos[from] };
  delete next[from];
  return next;
}
