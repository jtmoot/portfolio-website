import { station as desk } from "./Desk.jsx";
import { station as library } from "./Library.jsx";
import { station as plants } from "./Plants.jsx";
import { station as kitchen } from "./Kitchen.jsx";
import { station as gym } from "./Gym.jsx";
import { station as chess } from "./Chess.jsx";
import { station as corkboard } from "./Corkboard.jsx";
import { station as anatomy } from "./Anatomy.jsx";

/** Stations in idle-route order. */
export const STATIONS = [desk, library, plants, kitchen, gym, chess, corkboard, anatomy];
/** The stops on his idle tour, in order: every station but the ones marked tour: false. */
export const TOUR = STATIONS.filter((s) => s.tour !== false);
