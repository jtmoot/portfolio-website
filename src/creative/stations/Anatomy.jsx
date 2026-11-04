import svg from "./art/anatomy.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Anatomy = artComponent("anatomy", svg);

export const station = { ...LAYOUT.anatomy, Component: Anatomy };

export default Anatomy;
