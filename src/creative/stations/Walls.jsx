import svg from "./art/walls.svg?raw";
import { artComponent } from "./art.jsx";

/** The back and right walls, anchored at the floor's back-left corner (pad 0,0). */
const Walls = artComponent("walls", svg);
export default Walls;
