import svg from "./art/desk.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Desk = artComponent("desk", svg);

export const station = { ...LAYOUT.desk, Component: Desk };

export default Desk;
