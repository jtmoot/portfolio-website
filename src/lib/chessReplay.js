/**
 * The chess table's ambient replay: a short line played from the drawn position, then taken back
 * move by move, on a loop. Squares are "rank,file" strings matching data-sq in chess.svg.
 */

const P = (type, side) => ({ type, side });

/** The position drawn in tools/stations/chess.mjs. */
export const START = {
  "0,6": P("king", "w"), "0,5": P("rook", "w"), "3,3": P("queen", "w"), "2,5": P("knight", "w"), "3,2": P("bishop", "w"),
  "1,0": P("pawn", "w"), "1,1": P("pawn", "w"), "1,5": P("pawn", "w"), "1,6": P("pawn", "w"), "1,7": P("pawn", "w"), "3,4": P("pawn", "w"),
  "7,6": P("king", "b"), "7,2": P("rook", "b"), "6,3": P("queen", "b"), "5,2": P("knight", "b"), "6,6": P("bishop", "b"),
  "6,0": P("pawn", "b"), "6,1": P("pawn", "b"), "6,5": P("pawn", "b"), "6,7": P("pawn", "b"), "4,3": P("pawn", "b"), "7,7": P("rook", "b"),
};

/** The line: white's knight jumps in, the queen takes the d-pawn, black regroups. */
export const LINE = [
  ["2,5", "4,4"],
  ["6,6", "5,5"],
  ["3,3", "4,3"],
  ["5,2", "3,3"],
  ["3,2", "2,1"],
  ["7,2", "7,3"],
];

/**
 * The line forward, then each move undone in reverse.
 * @param {[string, string][]} line
 * @returns {{ from: string, to: string, captured: string | null, undo: boolean }[]}
 */
export function stepsOf(line) {
  const forward = [];
  let pos = { ...START };
  for (const [from, to] of line) {
    forward.push({ from, to, captured: pos[to] ? to : null, undo: false });
    pos = { ...pos, [to]: pos[from] };
    delete pos[from];
  }
  const back = [...forward].reverse().map((s) => ({ from: s.to, to: s.from, captured: s.captured, undo: true }));
  return [...forward, ...back];
}

/** The position after the first n steps of the loop. */
export function positionAt(n, line = LINE) {
  let pos = { ...START };
  const captures = [];
  for (const s of stepsOf(line).slice(0, n)) {
    const piece = pos[s.from];
    if (!s.undo) {
      if (s.captured) captures.push(pos[s.to]);
      pos = { ...pos, [s.to]: piece };
      delete pos[s.from];
    } else {
      pos = { ...pos, [s.to]: piece };
      delete pos[s.from];
      if (s.captured) pos[s.from] = captures.pop();
    }
  }
  return pos;
}
