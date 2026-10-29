import svg from "./art/gym.svg?raw";
import { artComponent } from "./art.jsx";

const Gym = artComponent("gym", svg);

export const station = {
  id: "gym",
  label: "gym",
  pos: { x: 66, y: 52 },
  footprint: { x: 44, y: 41, w: 44, h: 23 },
  link: "#running",
  Component: Gym,
};

export default Gym;
