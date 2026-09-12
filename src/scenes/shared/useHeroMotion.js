import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scroll } from "../../lib/scroll.js";

/**
 * Idle float + cursor-reactive tilt for a hero group ref (Noah Vance torus
 * behaviour). `spin` adds a slow continuous yaw; `sway` instead oscillates the
 * yaw around a facing direction — use it for flat objects that shouldn't
 * turn edge-on.
 */
export function useHeroMotion(ref, { float = 0.12, tilt = 0.18, spin = 0.08, sway = 0 } = {}) {
  useFrame(({ clock }, delta) => {
    const group = ref.current;
    if (!group) return;
    const t = clock.elapsedTime;
    group.position.y = Math.sin(t * 0.9) * float;
    const targetX = -scroll.pointer.y * tilt;
    const targetZ = scroll.pointer.x * tilt * 0.5;
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 4, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, targetZ, 4, delta);
    if (spin) group.rotation.y += spin * delta;
    else group.rotation.y = Math.sin(t * 0.35) * sway + scroll.pointer.x * tilt;
  });
}
