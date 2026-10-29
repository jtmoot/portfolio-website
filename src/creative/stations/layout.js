/**
 * Where each station stands in Joshua's room, in floor units (cqw of the poster; 1 unit = 5 cm).
 * pos is the drawing's anchor (its world origin); footprint is the area the figure cannot walk through;
 * labelAt is where the handwritten label sits (z in cm above the floor, for wall pieces);
 * standAt, when given, is where the figure stops to visit (otherwise just in front of the footprint).
 */
export const LAYOUT = {
  desk: {
    id: "desk",
    label: "desk",
    pos: { x: 43, y: 0 },
    footprint: { x: 27, y: 0, w: 32, h: 16 },
    link: "#experience",
    labelAt: { x: 44, y: 19, z: 0 },
  },
  library: {
    id: "library",
    label: "library",
    pos: { x: 15, y: 0 },
    footprint: { x: 6, y: 0, w: 18, h: 7 },
    link: "#reading",
    labelAt: { x: 9, y: 10, z: 0 },
  },
  plants: {
    id: "plants",
    label: "plants",
    pos: { x: 73, y: 0 },
    footprint: { x: 62, y: 0, w: 22, h: 11 },
    link: null,
    labelAt: { x: 76, y: 13, z: 0 },
  },
  kitchen: {
    id: "kitchen",
    label: "kitchen",
    pos: { x: 100, y: 21 },
    footprint: { x: 88, y: 3, w: 12, h: 36 },
    link: "#cooking",
    labelAt: { x: 92, y: 42, z: 0 },
    standAt: { x: 84, y: 22 },
  },
  gym: {
    id: "gym",
    label: "gym",
    pos: { x: 54, y: 54 },
    footprint: { x: 32, y: 43, w: 44, h: 22 },
    link: "#running",
    labelAt: { x: 50, y: 72, z: 0 },
    standAt: { x: 54, y: 40 },
  },
  chess: {
    id: "chess",
    label: "chess",
    pos: { x: 16, y: 56 },
    footprint: { x: 8, y: 49, w: 16, h: 14 },
    link: "https://www.chess.com/member/breakfast_enjoyer",
    labelAt: { x: 23, y: 66, z: 0 },
    standAt: { x: 28, y: 56 },
  },
  corkboard: {
    id: "corkboard",
    label: "corkboard",
    pos: { x: 92, y: 0 },
    footprint: { x: 86, y: 0, w: 12, h: 2 },
    link: null,
    labelAt: { x: 91, y: 0, z: 186 },
    standAt: { x: 85.5, y: 8 },
  },
  anatomy: {
    id: "anatomy",
    label: "anatomy chart",
    pos: { x: 9, y: 0 },
    footprint: { x: 5, y: 0, w: 8, h: 2 },
    link: null,
    labelAt: { x: 10, y: 0, z: 196 },
    standAt: { x: 4, y: 10 },
  },
};
