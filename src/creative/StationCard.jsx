/** One line and a link for each station, shown when the figure (or the pointer) is near it. */
export const CARD_TEXT = {
  desk: { line: "where the work happens.", cta: "see experience" },
  library: { line: "the short library, mostly history.", cta: "see the reading list" },
  plants: { line: "two monsteras, a corn plant and a hosta. all thriving.", cta: null },
  kitchen: { line: "short ribs, low and slow.", cta: "see cooking" },
  gym: { line: "barbell, kettlebells, sprints, a weighted vest.", cta: "see training" },
  chess: { line: "rapid, as breakfast_enjoyer.", cta: "open chess.com" },
  corkboard: { line: "history, tech, philosophy, finance.", cta: null },
  anatomy: { line: "the brain, in sagittal section.", cta: null },
};

/**
 * @param {{ station: { id: string, link: string | null }, style: object, onNavigate: (href: string) => void }} props
 */
export default function StationCard({ station, style, onNavigate }) {
  const text = CARD_TEXT[station.id];
  const external = station.link?.startsWith("http");
  return (
    <div className="station-card" style={style} role="status">
      <p>{text.line}</p>
      {station.link && text.cta && (
        <a
          href={station.link}
          data-c="ring"
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          onClick={(e) => {
            if (external) return;
            e.preventDefault();
            onNavigate(station.link);
          }}
        >
          {text.cta}
        </a>
      )}
    </div>
  );
}
