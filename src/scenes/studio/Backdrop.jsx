import { useMemo } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { scroll } from "../../lib/scroll.js";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Port of the Noah Vance hero-gl mesh gradient: three drifting radial glows.
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uDim;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float t = uTime;
    vec2 c1 = vec2(0.28 + 0.14 * sin(t * 0.31), 0.62 + 0.12 * cos(t * 0.42));
    vec2 c2 = vec2(0.74 + 0.12 * cos(t * 0.24), 0.34 + 0.14 * sin(t * 0.37));
    vec2 c3 = vec2(0.50 + 0.20 * sin(t * 0.19 + 2.0), 0.50 + 0.18 * sin(t * 0.28 + 1.0));
    float d1 = exp(-3.2 * length(uv - c1));
    float d2 = exp(-3.2 * length(uv - c2));
    float d3 = exp(-3.8 * length(uv - c3));
    vec3 glow = vec3(0.13, 0.25, 0.78) * d1 + vec3(0.04, 0.50, 0.60) * d2 + vec3(0.98, 0.55, 0.25) * d3 * 0.5;
    // Linear-space values: #050a1c is roughly (0.0015, 0.0031, 0.011) before sRGB encoding.
    vec3 base = vec3(0.0015, 0.0031, 0.011);
    float vignette = smoothstep(0.95, 0.35, length(uv - 0.5));
    vec3 col = base + glow * 0.085 * vignette * (1.0 - uDim * 0.85);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const DISTANCE = 40;

/**
 * Full-screen gradient plane parented to the camera, so it fills the view no
 * matter where the scroll timeline points the camera.
 */
export default function Backdrop() {
  const camera = useThree((state) => state.camera);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uDim: { value: 0 } }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uDim.value = scroll.dim;
  });

  const height = 2 * DISTANCE * Math.tan((camera.fov * Math.PI) / 360) * 1.3;
  const width = height * Math.max(camera.aspect, 1.8);

  return (
    <>
      <primitive object={camera} />
      {createPortal(
        <mesh position={[0, 0, -DISTANCE]} scale={[width, height, 1]}>
          <planeGeometry />
          <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} depthWrite={false} />
        </mesh>,
        camera,
      )}
    </>
  );
}
