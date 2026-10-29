import svg from "./art/kitchen.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Kitchen = artComponent("kitchen", svg);

export const station = { ...LAYOUT.kitchen, Component: Kitchen };

export default Kitchen;
