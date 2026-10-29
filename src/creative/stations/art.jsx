import { memo } from "react";
import meta from "./art/meta.json";

/**
 * Builds the React component for one station's drawing.
 * @param {string} id station id, matching tools/stations/<id>.mjs
 * @param {string} svg raw svg markup from ./art/<id>.svg
 */
export function artComponent(id, svg) {
  // The markup lives in a memoized child so toggling `active` never re-sets innerHTML: stations
  // animate their own elements (the chess pieces), and a fresh copy would drop those references.
  const Drawing = memo(function Drawing() {
    return <div className="station-svg" dangerouslySetInnerHTML={{ __html: svg }} />;
  });
  function StationArt({ active = false }) {
    return (
      <div className="iso station-art" data-station={id} data-active={active || undefined}>
        <Drawing />
      </div>
    );
  }
  StationArt.displayName = `Station(${id})`;
  StationArt.meta = meta[id];
  return StationArt;
}
