// What the reading corner's two drawings share. Local world: the chair's seat centred on the origin;
// it faces +y (toward the camera: the room's -x), +x is toward the viewer's right, z up. Centimetres.
// Both drawings use these bounds so they register exactly, one behind the figure and one in front.
export const BOUNDS = [[-78, -76, 0], [90, -76, 0], [-78, 60, 0], [90, 60, 0], [-60, -15, 172], [70, -5, 90], [-46, -42, 96], [46, -42, 96]];
export const SEAT = 46; // seat cushion top
export const W = 46; // the chair's half width
