import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { createWearMatcap } from "./wearMatcap.js";

const MATCAPS = {
  chrome: "/assets/matcaps/chrome-dark.png",
  chromeBright: "/assets/matcaps/chrome-studio.png",
  navy: "/assets/matcaps/navy-matte.png",
  black: "/assets/matcaps/black-gloss.png",
  grey: "/assets/matcaps/grey-soft.png",
  silver: "/assets/matcaps/silver-matte.png",
  clay: "/assets/matcaps/clay-neutral.png",
  amber: "/assets/matcaps/amber-glass.png",
  orange: "/assets/matcaps/orange-flat.png",
  glow: "/assets/matcaps/orange-glow.png",
};

const WEAR = "/assets/textures/wear-grunge.png";

/** Loads every matcap once and returns ready-to-use wear-matcap materials. */
export function useMaterials() {
  const textures = useTexture({ ...MATCAPS, wear: WEAR }, (loaded) => {
    Object.entries(loaded).forEach(([key, texture]) => {
      if (key === "wear") {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
      } else {
        texture.colorSpace = THREE.SRGBColorSpace;
      }
    });
  });

  return useMemo(() => {
    const make = (key, options = {}) =>
      createWearMatcap({ matcap: textures[key], wear: textures.wear, ...options });
    return {
      chrome: make("chrome", { amount: 0.25 }),
      chromeBright: make("chromeBright", { amount: 0.2 }),
      navy: make("navy", { amount: 0.4, scale: 0.12 }),
      black: make("black", { amount: 0.3 }),
      grey: make("grey", { amount: 0.35 }),
      silver: make("silver", { amount: 0.3 }),
      // Photogrammetry scans arrive with inverted winding; render both sides.
      // Tinted so the face-on relief lands mid-tone: bright enough to read,
      // dark enough that the headline stays legible over it.
      relief: make("silver", { amount: 0.35, scale: 0.9, color: "#6b7699", side: THREE.DoubleSide }),
      clay: make("clay", { amount: 0.4 }),
      amber: make("amber", { amount: 0.2 }),
      orange: make("orange", { amount: 0.25 }),
      glow: make("glow", { amount: 0.1 }),
    };
  }, [textures]);
}
