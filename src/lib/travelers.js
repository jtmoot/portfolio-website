/** Where the figure appears when the polaroid lands: in front of the desk. */
export const FIGURE_START = { x: 44, y: 26 };

/**
 * Everything in the margins that travels onto the floor in creative mode.
 * `from` is the object's place on the poster (cqw of the sheet); `station` is where it lands;
 * `tag`, on stickers, is Garvit's little dotted label: what it says and where it links.
 */
export const TRAVELERS = [
  { id: "brain", kind: "sticker", station: "anatomy", tag: null, from: { left: 1.9, top: 6, width: 7.8, rot: -4 } },
  { id: "book", kind: "sticker", station: "library", tag: { text: "my shelf", href: "#reading" }, from: { left: 6.4, top: 20, width: 7.6, rot: 3 } },
  { id: "king", kind: "sticker", station: "chess", tag: { text: "my rating", href: "https://www.chess.com/member/breakfast_enjoyer" }, from: { left: 3.4, top: 33, width: 4.6, rot: -5 } },
  { id: "novablast", kind: "sticker", station: "gym", tag: { text: "my runs", href: "https://www.strava.com/athletes/121070736" }, from: { left: 2.6, top: 49, width: 5.8, rot: 4 } },
  { id: "poster-history", kind: "poster", station: "corkboard", from: { left: 86.2, top: 5.5, width: 7.6, rot: -7 } },
  { id: "poster-tech", kind: "poster", station: "corkboard", from: { left: 87.5, top: 21.4, width: 6.8, rot: 5 } },
  { id: "poster-philosophy", kind: "poster", station: "corkboard", from: { left: 87, top: 37.4, width: 7.4, rot: -3 } },
  { id: "poster-finance", kind: "poster", station: "corkboard", from: { left: 86.7, top: 49.9, width: 9.8, rot: 2.5 } },
  { id: "polaroid", kind: "polaroid", station: "figure", from: { left: 29.7, top: 13.6, width: 7.2, rot: -3 } },
];

/**
 * The floor point (pad units) a traveler flies to.
 * @param {{ station: string }} traveler
 * @param {{ id: string, pos: { x: number, y: number } }[]} stations
 */
export function travelerTarget(traveler, stations) {
  if (traveler.station === "figure") return FIGURE_START;
  return stations.find((s) => s.id === traveler.station).pos;
}
