import { describe, it, expect } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Work, { isWide } from "../../src/pad/Work.jsx";
import { PROJECTS } from "../../src/content/data.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Work", () => {
  it("lays cards out two, then one wide, repeating", () => {
    expect([0, 1, 2, 3, 4, 5].map(isWide)).toEqual([false, false, true, false, false, true]);
  });

  it("numbers the cards and marks the wide ones", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Work />));
    const cards = host.querySelectorAll("article.card");
    expect(cards).toHaveLength(PROJECTS.length);
    expect(cards[0].querySelector(".card-meta").textContent).toContain("№ 001");
    expect(cards[2].hasAttribute("data-wide")).toBe(true);
    expect(cards[0].hasAttribute("data-wide")).toBe(false);
    await act(async () => root.unmount());
  });

  it("every project carries the fields the card needs", () => {
    for (const p of PROJECTS) {
      for (const k of ["kind", "badge", "url", "body"]) expect(typeof p[k]).toBe("string");
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });
});
