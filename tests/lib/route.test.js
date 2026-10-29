import { describe, it, expect } from "vitest";
import { pageOf } from "../../src/lib/route.js";

describe("pageOf", () => {
  it("serves the shelf at /shelf, with or without a trailing slash, and the pad everywhere else", () => {
    expect(pageOf("/shelf")).toBe("shelf");
    expect(pageOf("/shelf/")).toBe("shelf");
    expect(pageOf("/")).toBe("pad");
    expect(pageOf("/anything")).toBe("pad");
  });
});
