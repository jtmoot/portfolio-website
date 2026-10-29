import svg from "./art/kitchen.svg?raw";
import { artComponent } from "./art.jsx";

const Kitchen = artComponent("kitchen", svg);

export const station = {
  id: "kitchen",
  label: "kitchen",
  pos: { x: 100, y: 21 },
  footprint: { x: 88, y: 3, w: 12, h: 36 },
  link: "#cooking",
  Component: Kitchen,
};

export default Kitchen;
