import svg from "./art/plants.svg?raw";
import { artComponent } from "./art.jsx";

const Plants = artComponent("plants", svg);

export const station = {
  id: "plants",
  label: "plants",
  pos: { x: 73, y: 0 },
  footprint: { x: 62, y: 0, w: 22, h: 11 },
  link: null,
  Component: Plants,
};

export default Plants;
