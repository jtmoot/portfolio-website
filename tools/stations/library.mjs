// Joshua's library in the room: the same walnut bookcase as /shelf (bookcase-draw.mjs), at the
// room's camera and without the page's hit strips, so the shelf in the room is a small twin of the
// page it opens. Local world: wall plane x = 0, case spans y in [-46, 46], front face at x = 30.
import { station } from "./lib.mjs";
import { BOOKCASE_LABEL, bookcaseBounds, drawBookcase } from "./bookcase-draw.mjs";

export default station("library", {
  label: BOOKCASE_LABEL,
  bounds: bookcaseBounds(0),
  draw: (c) => drawBookcase(c, { interactive: false }),
});
