import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scroll } from "../../lib/scroll.js";
import { sampleKeyframes } from "./math.js";

/**
 * Drives the default camera along scroll-keyed keyframes with damping, plus a
 * subtle pointer parallax. `keys` are in `scroll.beat` units (0–5).
 */
export function useSceneCamera(keys, { parallax = 0.35, damping = 3.5 } = {}) {
  const target = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }), []);
  const current = useRef({ pos: new THREE.Vector3().fromArray(keys[0].pos), look: new THREE.Vector3().fromArray(keys[0].look) });

  useFrame(({ camera }, delta) => {
    sampleKeyframes(keys, scroll.beat, target.pos, target.look);
    target.pos.x += scroll.pointer.x * parallax;
    target.pos.y += scroll.pointer.y * parallax * 0.5;

    const { pos, look } = current.current;
    const k = 1 - Math.exp(-damping * delta);
    pos.lerp(target.pos, k);
    look.lerp(target.look, k);
    camera.position.copy(pos);
    camera.lookAt(look);
  });
}
