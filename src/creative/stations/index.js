import { station as desk } from "./Desk.jsx";
import { station as library } from "./Library.jsx";
import { station as plants } from "./Plants.jsx";
import { station as kitchen } from "./Kitchen.jsx";
import { station as gym } from "./Gym.jsx";
import { station as chess } from "./Chess.jsx";
import { station as reading } from "./Reading.jsx";
import { station as corkboard } from "./Corkboard.jsx";
import { station as anatomy } from "./Anatomy.jsx";

/** Stations in idle-route order. */
export const STATIONS = [desk, library, plants, kitchen, gym, chess, reading, corkboard, anatomy];
/**
 * The boxes the figure is sorted against each frame: a station's `paint` box when it has one, plus
 * a second box for a front layer he can sit behind (the reading chair's back and near arm); or,
 * for a station drawn in parts (the gym), one box per part, a flat one staying under him.
 * @param {object[]} stations
 */
export const paintBoxes = (stations) =>
  stations.flatMap((s) =>
    s.parts
      ? s.parts.map((p) => ({ id: p.id, footprint: p.paint, ...(p.flat ? { flat: true } : {}) }))
      : [{ id: s.id, footprint: s.paint || s.footprint }, ...(s.frontPaint ? [{ id: `${s.id}-front`, footprint: s.frontPaint }] : [])],
  );

/** The stops on his idle tour, in order: every station but the ones marked tour: false. */
export const TOUR = STATIONS.filter((s) => s.tour !== false);
