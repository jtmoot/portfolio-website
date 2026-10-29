import meta from "./art/meta.json";

/**
 * Builds the React component for one station's drawing.
 * @param {string} id station id, matching tools/stations/<id>.mjs
 * @param {string} svg raw svg markup from ./art/<id>.svg
 */
export function artComponent(id, svg) {
  function StationArt({ active = false }) {
    return (
      <div
        className="iso station-art"
        data-station={id}
        data-active={active || undefined}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  StationArt.displayName = `Station(${id})`;
  StationArt.meta = meta[id];
  return StationArt;
}
