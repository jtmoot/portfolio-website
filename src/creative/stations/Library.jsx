import svg from "./art/library.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Library = artComponent("library", svg);

export const station = { ...LAYOUT.library, Component: Library };

export default Library;
