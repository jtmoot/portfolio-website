import svg from "./art/corkboard.svg?raw";
import { artComponent } from "./art.jsx";

const Corkboard = artComponent("corkboard", svg);

export const station = {
  id: "corkboard",
  label: "corkboard",
  pos: { x: 92, y: 0 },
  footprint: { x: 86, y: 0, w: 12, h: 2 },
  link: null,
  Component: Corkboard,
};

export default Corkboard;
