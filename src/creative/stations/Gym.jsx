import svg from "./art/gym.svg?raw";
import floorSvg from "./art/gym-floor.svg?raw";
import rackSvg from "./art/gym-rack.svg?raw";
import boxSvg from "./art/gym-box.svg?raw";
import { artComponent } from "./art.jsx";
import { LAYOUT } from "./layout.js";

/** The whole gym, for the harness. */
const Gym = artComponent("gym", svg);
const { floor, rack, box } = LAYOUT.gym.parts;

/**
 * In the room the gym is three drawings in one box, each sorted against him on its own
 * (tools/stations/gym.mjs): the tiles with the ladder, bells and shoes always under him, then the
 * rack with its bar and the plyo box, in front of or behind him as he walks round them.
 */
export const station = {
  ...LAYOUT.gym,
  Component: Gym,
  parts: [
    { id: "gym-floor", Component: artComponent("gym", floorSvg), paint: floor, flat: true },
    { id: "gym-rack", Component: artComponent("gym", rackSvg), paint: rack },
    { id: "gym-box", Component: artComponent("gym", boxSvg), paint: box },
  ],
};

export default Gym;
