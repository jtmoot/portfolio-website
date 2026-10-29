import { station as desk } from "./Desk.jsx";
import { station as gym } from "./Gym.jsx";

/** Stations in idle-route order. Entries that are not drawn yet are null and filtered out. */
export const STATIONS = [desk, null, null, null, gym, null, null, null].filter(Boolean);
