import svg from "./art/anatomy.svg?raw";
import { artComponent } from "./art.jsx";

const Anatomy = artComponent("anatomy", svg);

export const station = {
  id: "anatomy",
  label: "anatomy chart",
  pos: { x: 9, y: 0 },
  footprint: { x: 5, y: 0, w: 8, h: 2 },
  link: null,
  Component: Anatomy,
};

export default Anatomy;
