import svg from "./art/plants.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Plants = artComponent("plants", svg);

export const station = { ...LAYOUT.plants, Component: Plants };

export default Plants;
