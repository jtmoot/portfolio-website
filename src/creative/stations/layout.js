/**
 * Where each station stands in Joshua's room (130 by 100 floor units, 6.5 by 5 m; 1 unit = 5 cm).
 * pos is the drawing's anchor (its world origin); footprint is the area the figure cannot walk through;
 * labelAt is where the handwritten label sits (z in cm above the floor, for wall pieces);
 * standAt, when given, is where the figure stops to visit (otherwise just in front of the footprint).
 */
export const LAYOUT = {
  desk: {
    id: "desk",
    label: "Desk",
    pos: { x: 54, y: 0 },
    footprint: { x: 38, y: 0, w: 32, h: 16 },
    link: "#experience",
    labelAt: { x: 55, y: 19, z: 0 },
  },
  library: {
    id: "library",
    label: "Library",
    pos: { x: 17, y: 0 },
    footprint: { x: 8, y: 0, w: 18, h: 7 },
    link: "/shelf",
    labelAt: { x: 11, y: 10, z: 0 },
  },
  plants: {
    id: "plants",
    label: "Plants",
    pos: { x: 89, y: 0 },
    footprint: { x: 78, y: 0, w: 22, h: 13 },
    link: null,
    labelAt: { x: 92, y: 15, z: 0 },
  },
  kitchen: {
    id: "kitchen",
    label: "Kitchen",
    pos: { x: 130, y: 48 },
    footprint: { x: 117, y: 30, w: 13, h: 36 },
    link: null,
    labelAt: { x: 122, y: 69, z: 0 },
    standAt: { x: 113, y: 48 },
  },
  gym: {
    id: "gym",
    label: "Gym",
    pos: { x: 72, y: 69 },
    footprint: { x: 50, y: 58, w: 54, h: 25 },
    link: "https://www.strava.com/athletes/121070736",
    labelAt: { x: 84, y: 85, z: 0 },
    standAt: { x: 64, y: 86.2 },
  },
  chess: {
    id: "chess",
    label: "Chess",
    pos: { x: 22, y: 67 },
    footprint: { x: 9, y: 60, w: 27, h: 14 },
    link: "https://www.chess.com/member/breakfast_enjoyer",
    labelAt: { x: 34, y: 79, z: 0 },
    // Behind the board, on white's side, facing the room.
    standAt: { x: 26, y: 57 },
  },
  reading: {
    id: "reading",
    label: "Reading chair",
    // Front left, beside the chess table: the chair's seat is where he sits.
    pos: { x: 9, y: 43 },
    // The chair's back, the side table and the lamp; the seat stays open so he can sit in it.
    footprint: { x: 0, y: 30, w: 27, h: 9.4 },
    link: "/shelf",
    labelAt: { x: 2, y: 54, z: 0 },
    standAt: { x: 9, y: 43 },
  },
  corkboard: {
    id: "corkboard",
    label: "Corkboard",
    pos: { x: 110, y: 0 },
    footprint: { x: 104, y: 0, w: 12, h: 2 },
    link: null,
    labelAt: { x: 109, y: 0, z: 186 },
    standAt: { x: 110, y: 8 },
  },
  anatomy: {
    id: "anatomy",
    // Just a picture on the wall: no label, and not a stop on his tour.
    label: null,
    tour: false,
    pos: { x: 12, y: 0 },
    footprint: { x: 8, y: 0, w: 8, h: 2 },
    link: null,
    labelAt: { x: 13, y: 0, z: 196 },
    standAt: { x: 5, y: 11 },
  },
};
