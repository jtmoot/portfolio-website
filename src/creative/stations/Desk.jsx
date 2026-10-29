import svg from "./art/desk.svg?raw";
import { artComponent } from "./art.jsx";

const Desk = artComponent("desk", svg);

export const station = {
  id: "desk",
  label: "desk",
  pos: { x: 40, y: 0 },
  footprint: { x: 24, y: 0, w: 32, h: 16 },
  link: "#experience",
  Component: Desk,
};

export default Desk;
