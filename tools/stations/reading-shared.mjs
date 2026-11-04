// What the reading corner's two drawings share. Local world: the chair's seat centred on the origin;
// it faces +y (toward the camera: the room's -x), +x is toward the viewer's right, z up. Centimetres.
// Both drawings use these bounds so they register exactly, one behind the figure and one in front.
export const BOUNDS = [[-72, -76, 0], [86, -76, 0], [-72, 60, 0], [86, 60, 0], [-55, 35, 172], [63, 30, 90], [-46, -42, 96], [46, -42, 96]];
export const SEAT = 46; // seat cushion top
export const W = 46; // the chair's half width
