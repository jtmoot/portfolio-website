/** Centimetres of Joshua's room per floor unit (one cqw of the sheet). */
export const CM_PER_UNIT = 5;

const COS30 = Math.cos(Math.PI / 6);

/**
 * True isometric projection: x runs down-right, y down-left, z straight up.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {{ S?: number, OX?: number, OY?: number }} [opts]
 * @returns {[number, number]}
 */
export function iso(x, y, z, { S = 1, OX = 0, OY = 0 } = {}) {
  return [OX + (x - y) * S * COS30, OY + (x + y) * S * 0.5 - z * S];
}

/**
 * Floor space (pad x right, pad y down, in cqw) to the station drawings' world (kit x, kit y, in cm).
 * @param {{ x: number, y: number }} p
 * @returns {[number, number]}
 */
export function floorToWorld({ x, y }) {
  return [y * CM_PER_UNIT, -x * CM_PER_UNIT];
}

/**
 * @param {[number, number]} world
 * @returns {{ x: number, y: number }}
 */
export function worldToFloor([kx, ky]) {
  return { x: -ky / CM_PER_UNIT, y: kx / CM_PER_UNIT };
}

/**
 * Where a station's art sits relative to its floor point, in cqw.
 * @param {{ width: number, height: number, anchor: [number, number] }} meta svg size and the svg point of the station's world origin
 * @returns {{ width: number, left: number, top: number }}
 */
export function artPlacement({ width, anchor }) {
  return {
    width: width / CM_PER_UNIT,
    left: -anchor[0] / CM_PER_UNIT,
    top: -anchor[1] / CM_PER_UNIT,
  };
}
