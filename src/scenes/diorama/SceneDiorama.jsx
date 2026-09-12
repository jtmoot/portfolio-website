import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Center, RoundedBox, useGLTF } from "@react-three/drei";
import { scroll } from "../../lib/scroll.js";
import { useSceneCamera } from "../shared/useSceneCamera.js";
import { useHeroMotion } from "../shared/useHeroMotion.js";
import { useMaterials } from "./useMaterials.js";

const RENOIR = "/assets/models/renoir.glb";
const CHESS = "/assets/models/chess.glb";

const STATIONS = [
  [-6, 0, -10],
  [6, 0, -16],
  [-6, 0, -22],
  [6, 0, -28],
];

// Aim slightly right of each station so the set piece lands behind the title
// column, not the body copy.
const stationCam = (i) => {
  const [x, y, z] = STATIONS[i];
  const side = x < 0 ? 1 : -1;
  return { pos: [x + side * 3.6, y + 2.3, z + 5.2], look: [x + 2.1, y + 0.9, z] };
};

const CAMERA = [
  { t: 0, pos: [0, 1.4, 6.8], look: [0, 1.1, 0] },
  { t: 1, pos: [3.2, 2.6, 9.5], look: [0, 0.9, -4] },
  { t: 2.125, ...stationCam(0) },
  { t: 2.375, ...stationCam(1) },
  { t: 2.625, ...stationCam(2) },
  { t: 2.875, ...stationCam(3) },
  { t: 3.5, pos: [0, 19, -18], look: [0, 0, -18.5] },
  { t: 4.5, pos: [0, 1.4, 6.8], look: [0, 1.1, 0] },
];

function applyMaterial(root, pick) {
  root.traverse((child) => {
    if (child.isMesh) {
      child.material = pick(child);
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
  return root;
}

function Plinth({ position, radius = 2.2 }) {
  return (
    <mesh position={[position[0], -0.06, position[2]]}>
      <cylinderGeometry args={[radius, radius * 1.05, 0.12, 48]} />
      <meshBasicMaterial color="#111a3a" />
    </mesh>
  );
}

function Hero({ materials }) {
  const { scene } = useGLTF(RENOIR);
  const model = useMemo(() => {
    const clone = applyMaterial(scene.clone(), () => materials.relief);
    // The scan's normals don't survive Draco quantisation and its winding is
    // inverted: rebuild normals here and rely on the double-sided material.
    clone.traverse((child) => child.isMesh && child.geometry.computeVertexNormals());
    return clone;
  }, [scene, materials]);
  const group = useRef(null);
  useHeroMotion(group, { float: 0.05, tilt: 0.14, spin: 0, sway: 0.28 });

  return (
    <group position={[1.6, 0, 0]}>
      <Plinth position={[0, 0, 0]} radius={1.5} />
      <group ref={group}>
        {/* The scan is a bas-relief plaque, thin along x — turn its face toward the camera. */}
        <primitive object={model} scale={5.2} rotation={[-0.12, Math.PI / 2, 0]} />
      </group>
    </group>
  );
}

// 01 Forge — a small server rack with an orange orbit ring: pipelines around compute.
function ForgeStation({ position, materials }) {
  const ring = useRef(null);
  useFrame(({ clock }) => {
    ring.current.rotation.z = clock.elapsedTime * 0.5;
    ring.current.rotation.x = Math.PI / 2 + Math.sin(clock.elapsedTime * 0.3) * 0.15;
  });
  return (
    <group position={position}>
      <Plinth position={[0, 0, 0]} />
      {[0, 0.55, 1.1].map((y) => (
        <RoundedBox key={y} args={[1.4, 0.45, 1.0]} radius={0.08} position={[0, y + 0.25, 0]} material={materials.black} />
      ))}
      <mesh ref={ring} position={[0, 0.95, 0]} material={materials.orange}>
        <torusGeometry args={[1.35, 0.05, 16, 100]} />
      </mesh>
      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} position={[x, 1.65, 0]} material={materials.glow}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
      ))}
    </group>
  );
}

// 02 Lorier — a watch bezel with a pulsing alert dot.
function LorierStation({ position, materials }) {
  const dot = useRef(null);
  const bezel = useRef(null);
  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 3) * 0.25;
    dot.current.scale.setScalar(pulse);
    bezel.current.rotation.z = clock.elapsedTime * 0.15;
  });
  return (
    <group position={position}>
      <Plinth position={[0, 0, 0]} />
      <group position={[0, 1.25, 0]} rotation={[0.35, 0, 0]}>
        <mesh ref={bezel} material={materials.chromeBright}>
          <torusGeometry args={[1.05, 0.16, 24, 96]} />
        </mesh>
        <mesh material={materials.navy}>
          <cylinderGeometry args={[0.95, 0.95, 0.12, 64]} />
        </mesh>
        <mesh position={[1.25, 0, 0]} material={materials.silver}>
          <cylinderGeometry args={[0.1, 0.1, 0.22, 24]} />
        </mesh>
        <mesh ref={dot} position={[0, 0.12, 0]} material={materials.glow}>
          <sphereGeometry args={[0.16, 24, 24]} />
        </mesh>
      </group>
    </group>
  );
}

// 03 Baron — bronze / silver / gold medallion layers, slowly counter-rotating.
function BaronStation({ position, materials }) {
  const group = useRef(null);
  useFrame(({ clock }) => {
    group.current.children.forEach((disc, i) => {
      disc.rotation.y = clock.elapsedTime * 0.2 * (i % 2 ? -1 : 1);
    });
  });
  const layers = [
    { y: 0.2, r: 1.5, material: materials.clay },
    { y: 0.65, r: 1.15, material: materials.silver },
    { y: 1.1, r: 0.8, material: materials.amber },
  ];
  return (
    <group position={position}>
      <Plinth position={[0, 0, 0]} />
      <group ref={group}>
        {layers.map((layer) => (
          <mesh key={layer.y} position={[0, layer.y, 0]} material={layer.material}>
            <cylinderGeometry args={[layer.r, layer.r, 0.3, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 04 Marcus — the chess set: one orange piece directing the rest.
function MarcusStation({ position, materials }) {
  const { scene } = useGLTF(CHESS);
  const model = useMemo(() => {
    let pieceIndex = 0;
    return applyMaterial(scene.clone(), (mesh) => {
      if (mesh.name.startsWith("Plane")) return materials.navy;
      pieceIndex += 1;
      return pieceIndex === 1 ? materials.orange : materials.grey;
    });
  }, [scene, materials]);

  return (
    <group position={position}>
      <Plinth position={[0, 0, 0]} radius={2.6} />
      <Center top position={[0, 0, 0]}>
        <primitive object={model} scale={0.55} rotation={[0, Math.PI / 5, 0]} />
      </Center>
    </group>
  );
}

// Flat surfaces sample a single matcap texel, so the ground uses a plain colour.
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, -10]}>
      <circleGeometry args={[60, 96]} />
      <meshBasicMaterial color="#070e26" />
    </mesh>
  );
}

function DimFog() {
  useFrame(({ scene }) => {
    if (!scene.fog) return;
    scene.fog.near = THREE.MathUtils.lerp(9, 3, scroll.dim);
    scene.fog.far = THREE.MathUtils.lerp(38, 20, scroll.dim);
  });
  return <fog attach="fog" args={["#050a1c", 9, 38]} />;
}

export default function SceneDiorama() {
  const materials = useMaterials();
  useSceneCamera(CAMERA, { parallax: 0.3 });

  return (
    <>
      <color attach="background" args={["#050a1c"]} />
      <DimFog />
      <Ground />
      <Hero materials={materials} />
      <ForgeStation position={STATIONS[0]} materials={materials} />
      <LorierStation position={STATIONS[1]} materials={materials} />
      <BaronStation position={STATIONS[2]} materials={materials} />
      <MarcusStation position={STATIONS[3]} materials={materials} />
    </>
  );
}

useGLTF.preload(RENOIR);
useGLTF.preload(CHESS);
