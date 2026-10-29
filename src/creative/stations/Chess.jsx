import svg from "./art/chess.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

const Chess = artComponent("chess", svg);

export const station = { ...LAYOUT.chess, Component: Chess };

export default Chess;
