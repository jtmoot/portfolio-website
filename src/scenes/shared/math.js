import * as THREE from "three";

export const smoothstep = (edge0, edge1, x) => {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Piecewise-linear interpolation through `keys` (sorted by `t`) with
 * smoothstep easing between neighbours. Each key: { t, pos: [x,y,z], look: [x,y,z] }.
 */
export function sampleKeyframes(keys, t, outPos, outLook) {
  if (t <= keys[0].t) {
    outPos.fromArray(keys[0].pos);
    outLook.fromArray(keys[0].look);
    return;
  }
  const last = keys[keys.length - 1];
  if (t >= last.t) {
    outPos.fromArray(last.pos);
    outLook.fromArray(last.look);
    return;
  }
  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t >= a.t && t <= b.t) {
      const k = smoothstep(a.t, b.t, t);
      outPos.set(
        THREE.MathUtils.lerp(a.pos[0], b.pos[0], k),
        THREE.MathUtils.lerp(a.pos[1], b.pos[1], k),
        THREE.MathUtils.lerp(a.pos[2], b.pos[2], k),
      );
      outLook.set(
        THREE.MathUtils.lerp(a.look[0], b.look[0], k),
        THREE.MathUtils.lerp(a.look[1], b.look[1], k),
        THREE.MathUtils.lerp(a.look[2], b.look[2], k),
      );
      return;
    }
  }
}
