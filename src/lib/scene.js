export const SCENES = ["diorama", "studio"];
const KEY = "scene";

export function readSceneParam() {
  const value = new URLSearchParams(window.location.search).get(KEY);
  return SCENES.includes(value) ? value : SCENES[0];
}

export function writeSceneParam(name) {
  const url = new URL(window.location.href);
  url.searchParams.set(KEY, name);
  window.history.replaceState(null, "", url);
}

export function isDesktop() {
  return window.matchMedia("(min-width: 900px)").matches;
}

export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
