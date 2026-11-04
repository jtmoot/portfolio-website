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
    // Beside the desk's right end he stood behind a 110 cm top that hid him to the waist.
    blocks: [{ x: 90, y: 0, w: 5, h: 16 }],
    link: "#experience",
    labelAt: { x: 75, y: 19, z: 0 },
  },
  library: {
    id: "library",
    label: "Library",
    pos: { x: 37, y: 0 },
    footprint: { x: 28, y: 0, w: 18, h: 7 },
    // Its right end is as tall as he is: standing just past it hid him to the waist.
    blocks: [{ x: 46, y: 0, w: 4, h: 7 }],
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
    // Past either end of the counters (90 cm tall) he was hidden to the waist and looked sunk in.
    blocks: [
      { x: 137, y: 66, w: 13, h: 4 },
      { x: 137, y: 24, w: 13, h: 6 },
    ],
    link: null,
    labelAt: { x: 142, y: 69, z: 0 },
    standAt: { x: 133, y: 48 },
  },
  gym: {
    id: "gym",
    label: "Gym",
    pos: { x: 92, y: 69 },
    footprint: { x: 70, y: 58, w: 54, h: 25 },
    // Drawn in three parts the room sorts against him separately (tools/stations/gym.mjs): the
    // tiles with the ladder, bells and shoes, always under him; the rack with its bar, whose plates
    // reach out to x 69.6 and 114.4; and the plyo box.
    parts: {
      floor: { x: 70, y: 58, w: 54, h: 25 },
      rack: { x: 69.6, y: 59.8, w: 44.8, h: 17.6 },
      box: { x: 110.4, y: 72.6, w: 12, h: 10 },
    },
    // Behind and beside the plyo box (x 110.4 to 122.4, 75 cm tall): close behind it he was hidden
    // from the waist down and looked to be standing in it. This keeps him out of its whole shadow.
    blocks: [{ x: 122.4, y: 62, w: 6, h: 22 }],
    link: "https://www.strava.com/athletes/121070736",
    labelAt: { x: 104, y: 85, z: 0 },
    standAt: { x: 84, y: 86.6 },
  },
  chess: {
    id: "chess",
    label: "Chess",
    pos: { x: 42.5, y: 67 },
    footprint: { x: 29.5, y: 60, w: 27, h: 14 },
    link: "https://www.chess.com/member/breakfast_enjoyer",
    labelAt: { x: 54.5, y: 79, z: 0 },
    // Behind the board, on white's side, facing the room (just clear of the table plus his body).
    standAt: { x: 46.5, y: 56.4 },
  },
  reading: {
    id: "reading",
    label: "Reading chair",
    // Front left, beside the chess table, facing the camera (-x), so he walks up to it in full view
    // and sits facing us. pos is the seat's centre.
    pos: { x: 15, y: 46 },
    // The chair's back, on its far side. The arms, lamp and side table are in `blocks`; the seat
    // between the arms is a block too, except while he's on his way to sit in it or getting up.
    footprint: { x: 20.2, y: 36.8, w: 3.2, h: 18.4 },
    seat: { x: 7.8, y: 40, w: 12.4, h: 12 },
    blocks: [
      { x: 7.8, y: 36.8, w: 12.4, h: 3.2 },
      { x: 7.8, y: 52, w: 12.4, h: 3.2 },
      { x: 5.2, y: 32.2, w: 5.6, h: 5.6 },
      { x: 5.8, y: 55.4, w: 6.4, h: 6.4 },
    ],
    // He sits inside the chair's outline: the back, seat, far arm and lamp draw behind him; the near
    // arm and the side table in front.
    paint: { x: 5, y: 32, w: 18.5, h: 13 },
    frontPaint: { x: 5, y: 48, w: 18.5, h: 14 },
    link: "/shelf",
    labelAt: { x: 7, y: 70, z: 0 },
    standAt: { x: 14.7, y: 46 },
    // He comes to the seat from in front of the chair, between the lamp and the side table.
    approachAt: { x: 3, y: 46 },
  },
  corkboard: {
    id: "corkboard",
    label: "Corkboard",
    pos: { x: 130, y: 0 },
    footprint: { x: 124, y: 0, w: 12, h: 2 },
    link: null,
    labelAt: { x: 129, y: 0, z: 186 },
    // Close enough to the board that its card (the podcasts) comes up while he looks at it.
    standAt: { x: 130, y: 6.2 },
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
