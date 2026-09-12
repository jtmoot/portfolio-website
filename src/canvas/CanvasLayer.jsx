import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { SCENE_COMPONENTS } from "../scenes/index.js";

export default function CanvasLayer({ scene }) {
  const Scene = SCENE_COMPONENTS[scene];
  return (
    <div className="canvas-layer">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 35, near: 0.1, far: 80, position: [0, 1.2, 7] }}
        onCreated={({ gl }) => gl.setClearColor("#050a1c")}
      >
        <Suspense fallback={null}>
          <Scene key={scene} />
        </Suspense>
      </Canvas>
    </div>
  );
}
