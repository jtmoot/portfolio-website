import { describe, it, expect } from "vitest";
import { soundFor } from "../../src/lib/clickSound.js";

const el = (html) => {
  const host = document.createElement("div");
  host.innerHTML = html;
  return host.querySelector("[data-hit]") || host.firstElementChild;
};

describe("soundFor", () => {
  it("clicks for buttons and links, even from an icon inside them", () => {
    expect(soundFor(el('<button><svg data-hit></svg></button>'))).toBe("click");
    expect(soundFor(el('<a href="/shelf"><span data-hit>shelf</span></a>'))).toBe("click");
  });

  it("lets a control ask for its own sound, or none", () => {
    expect(soundFor(el('<button data-sound="flip"><span data-hit></span></button>'))).toBe("flip");
    expect(soundFor(el('<button data-sound="none"></button>'))).toBeNull();
  });

  it("stays quiet on plain text and on the room floor", () => {
    expect(soundFor(el("<p>hello</p>"))).toBeNull();
    expect(soundFor(null)).toBeNull();
  });
});
