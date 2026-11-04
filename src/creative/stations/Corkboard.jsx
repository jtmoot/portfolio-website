import svg from "./art/corkboard.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Corkboard = artComponent("corkboard", svg);

export const station = { ...LAYOUT.corkboard, Component: Corkboard };

export default Corkboard;
