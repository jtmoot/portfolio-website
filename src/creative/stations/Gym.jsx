import svg from "./art/gym.svg?raw";
import { artComponent } from "./art.jsx";

const Gym = artComponent("gym", svg);

export const station = {
  id: "gym",
  label: "gym",
  pos: { x: 76, y: 50 },
  footprint: { x: 54, y: 39, w: 44, h: 22 },
  link: "#running",
  Component: Gym,
};

export default Gym;
