import svg from "./art/chess.svg?raw";
import { artComponent } from "./art.jsx";

const Chess = artComponent("chess", svg);

export const station = {
  id: "chess",
  label: "chess",
  pos: { x: 24, y: 50 },
  footprint: { x: 16, y: 43, w: 16, h: 14 },
  link: "https://www.chess.com/member/breakfast_enjoyer",
  Component: Chess,
};

export default Chess;
