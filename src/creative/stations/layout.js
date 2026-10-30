/**
 * Where each station stands in Joshua's room (150 by 100 floor units, 7.5 by 5 m; 1 unit = 5 cm).
 * pos is the drawing's anchor (its world origin); footprint is the area the figure cannot walk through;
 * labelAt is where the handwritten label sits (z in cm above the floor, for wall pieces);
 * standAt, when given, is where the figure stops to visit (otherwise just in front of the footprint).
 */
export const LAYOUT = {
  desk: {
    id: "desk",
    label: "Desk",
    pos: { x: 74, y: 0 },
    footprint: { x: 58, y: 0, w: 32, h: 16 },
    link: "#experience",
    labelAt: { x: 75, y: 19, z: 0 },
  },
  library: {
    id: "library",
    label: "Library",
    pos: { x: 37, y: 0 },
    footprint: { x: 28, y: 0, w: 18, h: 7 },
    link: "/shelf",
    labelAt: { x: 47, y: 10, z: 0 },
  },
  plants: {
    id: "plants",
    label: "Plants",
    pos: { x: 109, y: 0 },
    footprint: { x: 98, y: 0, w: 22, h: 13 },
    link: null,
    labelAt: { x: 112, y: 15, z: 0 },
  },
  kitchen: {
    id: "kitchen",
    label: "Kitchen",
    pos: { x: 150, y: 48 },
    footprint: { x: 137, y: 30, w: 13, h: 36 },
    link: null,
    labelAt: { x: 142, y: 69, z: 0 },
    standAt: { x: 133, y: 48 },
  },
  gym: {
    id: "gym",
    label: "Gym",
    pos: { x: 92, y: 69 },
    footprint: { x: 70, y: 58, w: 54, h: 25 },
    link: "https://www.strava.com/athletes/121070736",
    labelAt: { x: 104, y: 85, z: 0 },
    standAt: { x: 84, y: 86.2 },
  },
  chess: {
    id: "chess",
    label: "Chess",
    pos: { x: 42, y: 67 },
    footprint: { x: 29, y: 60, w: 27, h: 14 },
    link: "https://www.chess.com/member/breakfast_enjoyer",
    labelAt: { x: 54, y: 79, z: 0 },
    // Behind the board, on white's side, facing the room.
    standAt: { x: 46, y: 57 },
  },
  reading: {
    id: "reading",
    label: "Reading chair",
    // Front left, beside the chess table, facing into the room. pos is the seat's centre.
    pos: { x: 15, y: 46 },
    // The chair's back. The arms, lamp and side table are in `blocks`, so the seat stays open between them.
    footprint: { x: 6.6, y: 36.8, w: 3.2, h: 18.4 },
    blocks: [
      { x: 9.8, y: 36.8, w: 12.4, h: 3.2 },
      { x: 9.8, y: 52, w: 12.4, h: 3.2 },
      { x: 5.2, y: 32.2, w: 5.6, h: 5.6 },
      { x: 5.8, y: 55.4, w: 6.4, h: 6.4 },
    ],
    // He sits inside the chair's outline: the seat and far arm draw behind him, the back and near arm in front.
    paint: { x: 5, y: 32, w: 18, h: 8.5 },
    frontPaint: { x: 5, y: 40.5, w: 18, h: 21.5 },
    link: "/shelf",
    labelAt: { x: 7, y: 70, z: 0 },
    standAt: { x: 14.7, y: 46 },
  },
  corkboard: {
    id: "corkboard",
    label: "Corkboard",
    pos: { x: 130, y: 0 },
    footprint: { x: 124, y: 0, w: 12, h: 2 },
    link: null,
    labelAt: { x: 129, y: 0, z: 186 },
    standAt: { x: 130, y: 8 },
  },
  anatomy: {
    id: "anatomy",
    // Just a picture on the wall: no label, and not a stop on his tour.
    label: null,
    tour: false,
    pos: { x: 32, y: 0 },
    footprint: { x: 28, y: 0, w: 8, h: 2 },
    link: null,
    labelAt: { x: 33, y: 0, z: 196 },
    standAt: { x: 25, y: 11 },
  },
};
