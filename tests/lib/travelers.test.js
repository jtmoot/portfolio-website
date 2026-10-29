import { describe, it, expect } from "vitest";
import { TRAVELERS, travelerTarget } from "../../src/lib/travelers.js";
import { STATIONS } from "../../src/creative/stations/index.js";

const ids = new Set(STATIONS.map((s) => s.id));

describe("TRAVELERS", () => {
  it("every traveler lands on a station or is the figure", () => {
    for (const t of TRAVELERS) expect(t.station === "figure" || ids.has(t.station)).toBe(true);
  });

  it("the four posters all land on the corkboard", () => {
    const posters = TRAVELERS.filter((t) => t.kind === "poster");
    expect(posters).toHaveLength(4);
    expect(new Set(posters.map((p) => p.station))).toEqual(new Set(["corkboard"]));
  });

  it("left stickers are the brain, an open book, the king and the novablast", () => {
    const stickers = TRAVELERS.filter((t) => t.kind === "sticker");
    expect(stickers.map((s) => s.id)).toEqual(["brain", "book", "king", "novablast"]);
  });

  it("the book, king and shoe carry Garvit-style tags that link out; the brain has none", () => {
    const tag = (id) => TRAVELERS.find((t) => t.id === id).tag;
    expect(tag("brain")).toBeNull();
    expect(tag("book")).toEqual({ text: "my shelf", href: "#reading" });
    expect(tag("king")).toEqual({ text: "my rating", href: "https://www.chess.com/member/breakfast_enjoyer" });
    expect(tag("novablast")).toEqual({ text: "my runs", href: "https://www.strava.com/athletes/121070736" });
  });

  it("a traveler's target is its station's floor anchor", () => {
    const king = TRAVELERS.find((t) => t.id === "king");
    const chess = STATIONS.find((s) => s.id === "chess");
    expect(travelerTarget(king, STATIONS)).toEqual(chess.pos);
  });

  it("the polaroid's target is the figure's start in front of the desk", () => {
    const p = TRAVELERS.find((t) => t.id === "polaroid");
    expect(travelerTarget(p, STATIONS)).toEqual({ x: 44, y: 26 });
  });
});
