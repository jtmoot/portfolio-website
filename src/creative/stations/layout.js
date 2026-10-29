/**
 * Where each station stands in Joshua's room, in floor units (cqw of the poster; 1 unit = 5 cm).
 * pos is the drawing's anchor (its world origin); footprint is the area the figure cannot walk through.
 */
export const LAYOUT = {
  desk: {
    id: "desk",
    label: "desk",
    pos: { x: 43, y: 0 },
    footprint: { x: 27, y: 0, w: 32, h: 16 },
    link: "#experience",
  },
  library: {
    id: "library",
    label: "library",
    pos: { x: 15, y: 0 },
    footprint: { x: 6, y: 0, w: 18, h: 7 },
    link: "#reading",
  },
  plants: {
    id: "plants",
    label: "plants",
    pos: { x: 73, y: 0 },
    footprint: { x: 62, y: 0, w: 22, h: 11 },
    link: null,
  },
  kitchen: {
    id: "kitchen",
    label: "kitchen",
    pos: { x: 100, y: 21 },
    footprint: { x: 88, y: 3, w: 12, h: 36 },
    link: "#cooking",
  },
  gym: {
    id: "gym",
    label: "gym",
    pos: { x: 76, y: 50 },
    footprint: { x: 54, y: 39, w: 44, h: 22 },
    link: "#running",
  },
  chess: {
    id: "chess",
    label: "chess",
    pos: { x: 24, y: 50 },
    footprint: { x: 16, y: 43, w: 16, h: 14 },
    link: "https://www.chess.com/member/breakfast_enjoyer",
  },
  corkboard: {
    id: "corkboard",
    label: "corkboard",
    pos: { x: 92, y: 0 },
    footprint: { x: 86, y: 0, w: 12, h: 2 },
    link: null,
  },
  anatomy: {
    id: "anatomy",
    label: "anatomy chart",
    pos: { x: 9, y: 0 },
    footprint: { x: 5, y: 0, w: 8, h: 2 },
    link: null,
  },
};
