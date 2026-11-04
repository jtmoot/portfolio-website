import { lazy, Suspense } from "react";
import { padTransform } from "../lib/floorView.js";

const Floor = lazy(() => import("./Floor.jsx"));

/**
 * Creative mode on phones: a fixed, viewport-wide blank sheet with the floor's 100 by 78 proportions
 * that tips the same way as the desktop poster and holds the same room. The page fades under it.
 * @param {{ view: object, flipped: boolean, onNavigate: (href: string) => void }} props
 */
export default function PhoneStage({ view, flipped, onNavigate }) {
  return (
    <div className="phone-stage" data-on={flipped || undefined} aria-hidden={!flipped}>
      <div className="phone-sheet">
        <div className="phone-poster" style={{ transform: flipped ? padTransform(view) : "none" }} />
        <Suspense fallback={null}>
          <Floor view={view} flipped={flipped} onNavigate={onNavigate} posterSelector=".phone-poster" />
        </Suspense>
      </div>
    </div>
  );
}
