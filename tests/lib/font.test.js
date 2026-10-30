import { describe, it, expect, beforeEach } from "vitest";
import { FONTS, chooseFont } from "../../src/lib/font.js";

describe("chooseFont", () => {
  beforeEach(() => sessionStorage.clear());

  it("defaults to the serif pairing", () => {
    expect(chooseFont("")).toBe("serif");
    expect(FONTS).toEqual(["serif", "sans", "plex"]);
  });

  it("takes ?font= and remembers it for the visit, so /shelf keeps the same choice", () => {
    expect(chooseFont("?font=plex")).toBe("plex");
    expect(chooseFont("")).toBe("plex");
  });

  it("ignores unknown names", () => {
    expect(chooseFont("?font=comic")).toBe("serif");
  });
});
