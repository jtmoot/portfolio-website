import { forwardRef } from "react";

/**
 * Joshua, drawn small and walking: version one, with limbs swung in code (CSS var --swing).
 * Facing comes from data-facing (dr, dl, ur, ul); the "u" facings show his back.
 */
const Figure = forwardRef(function Figure(_, ref) {
  return (
    <div ref={ref} className="figure" data-facing="dr" aria-label="Joshua, walking around his room" role="img">
      <svg viewBox="0 0 60 150" className="figure-svg" aria-hidden="true">
        <ellipse className="fig-shadow" cx="30" cy="147" rx="14" ry="3.2" />
        <g className="fig-body">
          {/* far arm */}
          <g className="fig-arm fig-arm-back">
            <rect x="13" y="56" width="8" height="34" rx="4" className="fig-hoodie-dark" />
            <circle cx="17" cy="91" r="3.6" className="fig-skin" />
          </g>
          {/* far leg */}
          <g className="fig-leg fig-leg-back">
            <rect x="24" y="92" width="10" height="44" rx="4.5" className="fig-pants-dark" />
            <path d="M22 136 h13 a4 4 0 0 1 4 4 v3 h-17 z" className="fig-shoe" />
          </g>
          {/* torso: hoodie with pocket and drawstrings */}
          <path d="M16 56 q0 -8 9 -9 h10 q9 1 9 9 l2 40 q-16 4 -32 0 z" className="fig-hoodie" />
          <path d="M22 80 h16 l2 10 h-20 z" className="fig-pocket" />
          <g className="fig-front-only">
            <path d="M27 50 v10 M33 50 v10" className="fig-line" />
          </g>
          {/* near leg */}
          <g className="fig-leg fig-leg-front">
            <rect x="27" y="92" width="10.5" height="44" rx="4.5" className="fig-pants" />
            <path d="M25 136 h14 a4 4 0 0 1 4 4 v3 h-18 z" className="fig-shoe" />
            <path d="M26 141 h16" className="fig-sole" />
          </g>
          {/* head */}
          <rect x="26.5" y="40" width="7" height="8" rx="2" className="fig-skin" />
          <ellipse cx="30" cy="31" rx="9.5" ry="11" className="fig-skin" />
          <path d="M20.5 30 q-1 -13 10 -13.5 q10.5 0.5 9.8 13 q-2.5 -6 -9.8 -6.5 q-7 0.4 -10 7 z" className="fig-hair" />
          <path d="M20.5 30 q-0.5 -13 10 -13.5 q10.5 0.5 9.8 13 q0 6 -2 9 q-7 4 -15.5 0 q-2.5 -3 -2.3 -8.5 z" className="fig-hair fig-back-only" />
          <g className="fig-front-only">
            <circle cx="33.5" cy="31" r="0.9" className="fig-eye" />
            <circle cx="27" cy="31" r="0.9" className="fig-eye" />
            <path d="M28.5 37 q2 1.2 4.5 0" className="fig-line" />
          </g>
          {/* near arm */}
          <g className="fig-arm fig-arm-front">
            <rect x="39" y="56" width="8.5" height="34" rx="4.2" className="fig-hoodie" />
            <circle cx="43.2" cy="91" r="3.8" className="fig-skin" />
          </g>
        </g>
      </svg>
    </div>
  );
});

export default Figure;
