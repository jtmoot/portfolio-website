// The bookcase on /shelf: the shared walnut bookcase (bookcase-draw.mjs) at the page's camera, with
// every book a separately posable group. A book is three flat faces (spine, cover, top) so the page
// can turn each with one exact matrix. Local world: wall plane x = 0, spines facing +x, row along y.
import { station } from "./lib.mjs";
import { CAMERA } from "../../src/lib/bookcase.js";
import { BOOKCASE_LABEL, bookcaseBounds, drawBookcase } from "./bookcase-draw.mjs";

export default station("bookcase", {
  label: `${BOOKCASE_LABEL} Pick a spine to tip the book out.`,
  role: "group",
  cam: { azimuth: CAMERA.azimuth, elevation: CAMERA.elevation },
  // Tipped books come 14 cm forward of the case.
  bounds: bookcaseBounds(14),
  draw: (c) => drawBookcase(c, { interactive: true }),
});
