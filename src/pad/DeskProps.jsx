/**
 * Small line drawings for the shelf page's margins, after the ruler, pencil and set square around
 * garvitsingla.in/shelf: a pencil, a ruler, a mug of tea and reading glasses. Decoration only.
 */

// Spread first, so a part's own fill overrides the default "none".
const ink = { fill: "none", stroke: "var(--ink)", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

function Pencil() {
  return (
    <svg className="desk-prop prop-pencil" viewBox="0 0 160 40">
      <g transform="rotate(-24 80 20)">
        <path d="M30 12h96v16H30z" {...ink} fill="#f0c44c" />
        <path d="M30 17h96M30 23h96" {...ink} strokeWidth={0.8} />
        <path d="M126 12h14v16h-14z" {...ink} fill="#c9c9c3" />
        <path d="M140 12h10a6 6 0 0 1 0 16h-10z" {...ink} fill="#e79a9a" />
        <path d="M30 12 8 20l22 8z" {...ink} fill="#f2dcb8" />
        <path d="M14 18 8 20l6 2z" fill="var(--ink)" />
      </g>
    </svg>
  );
}

function Ruler() {
  const ticks = [];
  for (let i = 0; i <= 20; i++) {
    const x = 14 + i * 7.4;
    ticks.push(<path key={i} d={`M${x} 34v${i % 5 === 0 ? -12 : i % 1 === 0 ? -7 : -4}`} {...ink} strokeWidth={0.9} />);
  }
  return (
    <svg className="desk-prop prop-ruler" viewBox="0 0 176 44">
      <g transform="rotate(8 88 22)">
        <path d="M8 6h160v28H8z" {...ink} fill="#e8d3a6" />
        {ticks}
        <circle cx="160" cy="20" r="3" {...ink} />
      </g>
    </svg>
  );
}

function Mug() {
  return (
    <svg className="desk-prop prop-mug" viewBox="0 0 120 130">
      <path className="prop-steam" d="M44 40c-6-8 6-14 0-22M60 38c-6-8 6-14 0-22M76 40c-6-8 6-14 0-22" {...ink} strokeWidth={1.2} opacity={0.55} />
      <path d="M26 52h68v46a18 18 0 0 1-18 18H44a18 18 0 0 1-18-18z" {...ink} fill="#9db7c4" />
      <path d="M94 62h6a12 12 0 0 1 0 24h-6" {...ink} />
      <ellipse cx="60" cy="52" rx="34" ry="5" {...ink} fill="#b6814f" />
      <path d="M86 56v22M86 78l-6 8h12z" {...ink} strokeWidth={1} />
      <path d="M14 120h92" {...ink} opacity={0.4} />
    </svg>
  );
}

function Glasses() {
  return (
    <svg className="desk-prop prop-glasses" viewBox="0 0 160 64">
      <g transform="rotate(-6 80 32)">
        <circle cx="46" cy="36" r="22" {...ink} fill="rgba(180,205,220,0.25)" />
        <circle cx="114" cy="36" r="22" {...ink} fill="rgba(180,205,220,0.25)" />
        <path d="M68 32c4-6 20-6 24 0" {...ink} />
        <path d="M24 30 6 18M136 30l18-12" {...ink} />
        <path d="M36 26a12 12 0 0 1 10-4M104 26a12 12 0 0 1 10-4" {...ink} strokeWidth={1} opacity={0.6} />
      </g>
    </svg>
  );
}

/** The four objects, two per margin. */
export default function DeskProps() {
  return (
    <>
      <div className="shelf-margin shelf-margin-left" aria-hidden="true">
        <Pencil />
        <Ruler />
      </div>
      <div className="shelf-margin shelf-margin-right" aria-hidden="true">
        <Mug />
        <Glasses />
      </div>
    </>
  );
}
