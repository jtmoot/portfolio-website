import { forwardRef } from "react";
import sheet from "./stations/art/figure.svg?raw";
import meta from "./stations/art/meta.json";

/** Sprite sheet geometry: every symbol shares this viewBox; anchor is the point between his feet. */
export const FIGURE_META = meta.figure;

/**
 * Joshua, walking. Floor.jsx swaps the <use> href (f-{facing}-{frame}) every frame and positions
 * the element so the anchor sits on his floor point.
 */
const Figure = forwardRef(function Figure(_, ref) {
  const { width, height, anchor } = FIGURE_META;
  return (
    <div
      ref={ref}
      className="figure iso"
      role="img"
      aria-label="Joshua, walking around his room"
      style={{ "--ax": `${(-anchor[0] / width) * 100}%`, "--ay": `${(-anchor[1] / height) * 100}%` }}
    >
      <div className="figure-sheet-host" aria-hidden="true" dangerouslySetInnerHTML={{ __html: sheet }} />
      <svg viewBox={`0 0 ${width} ${height}`} className="figure-svg iso-svg" aria-hidden="true">
        <use href="#f-dr-idle" />
      </svg>
    </div>
  );
});

export default Figure;
