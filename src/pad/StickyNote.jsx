/**
 * A yellow sticky note in Joshua's hand, stuck at the top of the shelf: drawn paper with a soft
 * shadow and a lifting corner, the line set in the hand font.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function StickyNote({ children }) {
  return (
    <aside className="sticky-note" aria-label="A sticky note">
      <svg className="sticky-paper" viewBox="0 0 100 100" aria-hidden="true">
        <path className="sticky-face" d="M3 2h94v93.5c-9 1.2-15.5 4-19.5 7.5H3z" />
        <path className="sticky-glue" d="M3 2h94v9H3z" />
        <path className="sticky-curl" d="M97 95.5c-9 1.2-15.5 4-19.5 7.5 1.2-7.8 5.8-13.2 13.4-15.6 2.4-.8 4.4-1.2 6.1-1.3z" />
        <path className="sticky-curl-shade" d="M97 95.5c-9 1.2-15.5 4-19.5 7.5 3-1.3 7.5-2.2 12.9-2.6 2.6-.3 4.8-.4 6.6-.4z" />
      </svg>
      <p className="hand">{children}</p>
    </aside>
  );
}
