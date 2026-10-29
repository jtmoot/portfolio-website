/**
 * A handwritten label at ground level beside a station.
 * @param {{ text: string, active: boolean, style: object, onEnter: () => void }} props
 */
export default function StationLabel({ text, active, style, onEnter }) {
  return (
    <span className={`station-label hand${active ? " active" : ""}`} style={style} onPointerEnter={onEnter}>
      {text}
    </span>
  );
}
