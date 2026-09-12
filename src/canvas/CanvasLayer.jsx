import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SceneStudio from "../scenes/studio/SceneStudio.jsx";

export default function CanvasLayer() {
  return (
    <div className="canvas-layer">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 35, near: 0.1, far: 80, position: [0, 0.6, 7.5] }}
        onCreated={({ gl }) => gl.setClearColor("#151d3d")}
      >
        <Suspense fallback={null}>
          <SceneStudio />
        </Suspense>
      </Canvas>
    </div>
  );
}
