import { describe, it, expect, beforeEach } from "vitest";
import { SIDES, chooseSides } from "../../src/lib/sides.js";

describe("chooseSides", () => {
  beforeEach(() => sessionStorage.clear());

  it("shows nothing in the margins unless asked", () => {
    expect(chooseSides("")).toBeNull();
    expect(SIDES).toEqual(["rail", "float"]);
  });

  it("takes ?sides= and remembers it for the visit", () => {
    expect(chooseSides("?sides=float")).toBe("float");
    expect(chooseSides("")).toBe("float");
    expect(chooseSides("?sides=rail")).toBe("rail");
  });

  it("clears with ?sides=off and ignores unknown names", () => {
    chooseSides("?sides=rail");
    expect(chooseSides("?sides=off")).toBeNull();
    expect(chooseSides("")).toBeNull();
    expect(chooseSides("?sides=confetti")).toBeNull();
  });
});
