import * as THREE from "three";

/**
 * MeshMatcapMaterial with a triplanar "wear" mask multiplied into the matcap
 * lookup — the FreeStylized grunge gives flat matcap surfaces a hand-painted,
 * slightly worn edge. No lights or env map involved.
 */
export function createWearMatcap({
  matcap,
  wear,
  amount = 0.32,
  scale = 0.45,
  color = "#ffffff",
  side = THREE.FrontSide,
}) {
  const material = new THREE.MeshMatcapMaterial({ matcap, color: new THREE.Color(color), side });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWear = { value: wear };
    shader.uniforms.uWearAmt = { value: amount };
    shader.uniforms.uWearScale = { value: scale };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vWorldPos;\nvarying vec3 vWorldNormal;",
      )
      .replace(
        "#include <defaultnormal_vertex>",
        "#include <defaultnormal_vertex>\nvWorldNormal = normalize(mat3(modelMatrix) * objectNormal);",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        [
          "#include <common>",
          "varying vec3 vWorldPos;",
          "varying vec3 vWorldNormal;",
          "uniform sampler2D uWear;",
          "uniform float uWearAmt;",
          "uniform float uWearScale;",
        ].join("\n"),
      )
      .replace(
        "vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;",
        [
          "vec3 wn = abs(vWorldNormal);",
          "wn /= max(wn.x + wn.y + wn.z, 1e-4);",
          "float wx = texture2D(uWear, vWorldPos.zy * uWearScale).r;",
          "float wy = texture2D(uWear, vWorldPos.xz * uWearScale).r;",
          "float wz = texture2D(uWear, vWorldPos.xy * uWearScale).r;",
          "float wear = wx * wn.x + wy * wn.y + wz * wn.z;",
          "vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb * (1.0 - uWearAmt * (1.0 - wear));",
        ].join("\n"),
      );
  };
  material.customProgramCacheKey = () => "wear-matcap";
  return material;
}
