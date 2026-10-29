import svg from "./art/library.svg?raw";
import { artComponent } from "./art.jsx";

const Library = artComponent("library", svg);

export const station = {
  id: "library",
  label: "library",
  pos: { x: 15, y: 0 },
  footprint: { x: 6, y: 0, w: 18, h: 7 },
  link: "#reading",
  Component: Library,
};

export default Library;
