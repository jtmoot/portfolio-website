import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, RoundedBox, Sparkles } from "@react-three/drei";
import { scroll } from "../../lib/scroll.js";
import { sampleKeyframes } from "../shared/math.js";
import { useSceneCamera } from "../shared/useSceneCamera.js";
import { useHeroMotion } from "../shared/useHeroMotion.js";
import Backdrop from "./Backdrop.jsx";

const HDRI = "/assets/hdri/story_studio_05_1k.hdr";

const CAMERA = [
  { t: 0, pos: [0, 0.6, 7.5], look: [0, 0.4, 0] },
  { t: 1, pos: [2.5, 1.6, 9], look: [0, 0.6, 0] },
  { t: 2.125, pos: [5, 1, 5.5], look: [2.2, 0.3, 0] },
  { t: 2.375, pos: [-5, 2, 5.5], look: [2.2, 0.3, 0] },
  { t: 2.625, pos: [4, -1, 6.5], look: [2.2, 0.2, 0] },
  { t: 2.875, pos: [-4, 1.5, 7], look: [2.2, 0.4, 0] },
  { t: 3.5, pos: [0, 2, 13], look: [0, 0.5, 0] },
  { t: 4.5, pos: [0, 0.6, 7.5], look: [0, 0.4, 0] },
];

// Six bodies: five glass blocks + one chrome knot (index 5).
// Each formation lists a position per body; the look vector is unused.
const FORMATIONS = {
  hero: [[0, 0.2, 0], [1.3, 0.9, -0.6], [-1.2, -0.5, 0.4], [0.7, -1.1, 0.9], [-0.9, 1.1, -0.9], [1.9, -0.3, -1.4]],
  ring: [[2.4, 0, 0], [1.2, 0.3, 2.1], [-1.2, -0.3, 2.1], [-2.4, 0.2, 0], [-1.2, 0.4, -2.1], [1.2, -0.4, -2.1]],
  stack: [[0, -1.6, 0], [0, -0.8, 0], [0, 0, 0], [0, 0.8, 0], [0, 1.6, 0], [2.2, 0.4, 0.5]],
  line: [[-3.2, 0, 0], [-1.6, 0.3, 0], [0, 0, 0], [1.6, -0.3, 0], [3.2, 0, 0], [0, 1.8, -1]],
  tiers: [[-1.4, -1.2, 0.4], [1.4, -1.2, 0.4], [0, -0.2, 0], [-0.9, 0.8, -0.4], [0.9, 0.8, -0.4], [0, 2.0, -0.8]],
  orbit: [[2.0, 0.6, 0], [-2.0, -0.6, 0], [0, 1.9, 0.6], [0, -1.9, -0.6], [0, 0, 0], [1.4, 1.4, -1.4]],
  // Timeline beat: everything out to the edges so the reading column stays clear.
  spread: [[-11, 3, -6], [11, -2, -8], [-10, -4, -4], [10, 4, -6], [-9, 6, -10], [9, -6, -9]],
};

const BODY_KEYS = Array.from({ length: 6 }, (_, i) => [
  { t: 0, pos: FORMATIONS.hero[i], look: [0, 0, 0] },
  { t: 1, pos: FORMATIONS.ring[i], look: [0, 0, 0] },
  { t: 2.125, pos: FORMATIONS.stack[i], look: [0, 0, 0] },
  { t: 2.375, pos: FORMATIONS.line[i], look: [0, 0, 0] },
  { t: 2.625, pos: FORMATIONS.tiers[i], look: [0, 0, 0] },
  { t: 2.875, pos: FORMATIONS.orbit[i], look: [0, 0, 0] },
  { t: 3.5, pos: FORMATIONS.spread[i], look: [0, 0, 0] },
  { t: 4.5, pos: FORMATIONS.hero[i], look: [0, 0, 0] },
]);

const BLOCKS = [
  { size: [1.4, 1.4, 1.4], radius: 0.28 },
  { size: [1.0, 1.6, 1.0], radius: 0.22 },
  { size: [1.1, 0.8, 1.5], radius: 0.24 },
  { size: [0.8, 0.8, 0.8], radius: 0.2 },
  { size: [1.2, 1.0, 0.7], radius: 0.22 },
];

function GlassBlock({ index, size, radius }) {
  const ref = useRef(null);
  const scratch = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }), []);

  useFrame(({ clock }, delta) => {
    const mesh = ref.current;
    sampleKeyframes(BODY_KEYS[index], scroll.beat, scratch.pos, scratch.look);
    mesh.position.x = THREE.MathUtils.damp(mesh.position.x, scratch.pos.x, 3, delta);
    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, scratch.pos.y, 3, delta);
    mesh.position.z = THREE.MathUtils.damp(mesh.position.z, scratch.pos.z, 3, delta);
    const t = clock.elapsedTime * (0.12 + index * 0.03);
    mesh.rotation.set(t * 0.7, t, t * 0.4);
  });

  return (
    <RoundedBox ref={ref} args={size} radius={radius} smoothness={4}>
      <MeshTransmissionMaterial
        backside
        samples={4}
        resolution={256}
        thickness={0.6}
        roughness={0.08}
        ior={1.45}
        chromaticAberration={0.05}
        anisotropicBlur={0.1}
        distortion={0.15}
        distortionScale={0.3}
        temporalDistortion={0.05}
        color="#dfe7ff"
      />
    </RoundedBox>
  );
}

function ChromeKnot() {
  const ref = useRef(null);
  const scratch = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }), []);

  useFrame(({ clock }, delta) => {
    const mesh = ref.current;
    sampleKeyframes(BODY_KEYS[5], scroll.beat, scratch.pos, scratch.look);
    mesh.position.x = THREE.MathUtils.damp(mesh.position.x, scratch.pos.x, 3, delta);
    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, scratch.pos.y, 3, delta);
    mesh.position.z = THREE.MathUtils.damp(mesh.position.z, scratch.pos.z, 3, delta);
    mesh.rotation.y = clock.elapsedTime * 0.35;
    mesh.rotation.x = clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.45, 0.15, 180, 24]} />
      <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.12} envMapIntensity={1.4} />
    </mesh>
  );
}

function EmberLight() {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.position.set(Math.sin(t * 0.4) * 3, 1.5 + Math.cos(t * 0.6), 2);
    ref.current.intensity = 6 * (1 - scroll.dim * 0.7);
  });
  return <pointLight ref={ref} color="#fb923c" intensity={6} distance={14} decay={2} />;
}

export default function SceneStudio() {
  const hero = useRef(null);
  useSceneCamera(CAMERA, { parallax: 0.4 });
  useHeroMotion(hero, { float: 0.08, tilt: 0.12, spin: 0.05 });

  useFrame(({ scene }) => {
    scene.environmentIntensity = 1.2 - scroll.dim * 0.7;
  });

  return (
    <>
      <color attach="background" args={["#151d3d"]} />
      <Environment files={HDRI} />
      <Backdrop />
      <ambientLight intensity={0.25} />
      <EmberLight />
      <Sparkles count={120} scale={[14, 8, 4]} size={1.6} speed={0.15} opacity={0.3} color="#c7d3ff" />
      <group ref={hero}>
        {BLOCKS.map((block, i) => (
          <GlassBlock key={i} index={i} size={block.size} radius={block.radius} />
        ))}
        <ChromeKnot />
      </group>
    </>
  );
}
