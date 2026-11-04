import svg from "./art/reading.svg?raw";
import frontSvg from "./art/reading-front.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Reading = artComponent("reading", svg);
const ReadingFront = artComponent("reading-front", frontSvg);

export const station = { ...LAYOUT.reading, Component: Reading, Front: ReadingFront };

export default Reading;
