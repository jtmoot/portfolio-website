import svg from "./art/gym.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Gym = artComponent("gym", svg);

export const station = { ...LAYOUT.gym, Component: Gym };

export default Gym;
