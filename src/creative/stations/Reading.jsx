import svg from "./art/reading.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Reading = artComponent("reading", svg);

export const station = { ...LAYOUT.reading, Component: Reading };

export default Reading;
