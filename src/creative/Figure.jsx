import { forwardRef } from "react";
import sheet from "./stations/art/figure.svg?raw";
import meta from "./stations/art/meta.json";

/** Sprite sheet geometry: every symbol shares this viewBox; anchor is the point between his feet. */
export const FIGURE_META = meta.figure;

/**
 * Joshua, walking. Floor.jsx swaps the <use> href (f-{facing}-{frame}) every frame and positions
 * the element so the anchor sits on his floor point. `over` is the second, arm-only layer drawn
 * above a station he reaches across (it reuses the one sprite sheet, so it carries no copy).
 * @param {{ over?: boolean }} props
 */
const Figure = forwardRef(function Figure({ over = false }, ref) {
  const { width, height, anchor } = FIGURE_META;
  return (
    <div
      ref={ref}
      className={over ? "figure figure-over iso" : "figure iso"}
      role={over ? undefined : "img"}
      aria-label={over ? undefined : "Joshua, walking around his room"}
      aria-hidden={over || undefined}
      hidden={over || undefined}
      style={{ "--ax": `${(-anchor[0] / width) * 100}%`, "--ay": `${(-anchor[1] / height) * 100}%` }}
    >
      {!over && <div className="figure-sheet-host" aria-hidden="true" dangerouslySetInnerHTML={{ __html: sheet }} />}
      <svg viewBox={`0 0 ${width} ${height}`} className="figure-svg iso-svg" aria-hidden="true">
        <use href="#f-dr-idle" />
      </svg>
    </div>
  );
});

export default Figure;
