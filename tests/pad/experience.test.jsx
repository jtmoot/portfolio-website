import { describe, it, expect } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Experience from "../../src/pad/Experience.jsx";
import { EXPERIENCE } from "../../src/content/data.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mount = async () => {
  const host = document.createElement("div");
  const root = createRoot(host);
  await act(async () => root.render(<Experience />));
  return { host, root };
};

describe("Experience", () => {
  it("lists every place in one card with its kind, dates and where", async () => {
    const { host, root } = await mount();
    const rows = host.querySelectorAll(".xp-card .xrow");
    expect(rows).toHaveLength(EXPERIENCE.length);
    const first = rows[0];
    expect(first.querySelector(".xp-kind").textContent).toBe(EXPERIENCE[0].kind);
    expect(first.querySelector(".when").textContent).toContain(EXPERIENCE[0].dates);
    expect(first.querySelector(".where").textContent).toContain(EXPERIENCE[0].place);
    await act(async () => root.unmount());
  });

  it("unfolds a row to its write-up and chips, and folds it again", async () => {
    const { host, root } = await mount();
    const toggle = host.querySelectorAll(".xrow-head")[1];
    const panel = () => host.querySelector(`#${toggle.getAttribute("aria-controls")}`);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel().hasAttribute("data-open")).toBe(false);
    await act(async () => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(panel().hasAttribute("data-open")).toBe(true);
    expect(panel().textContent).toContain(EXPERIENCE[1].blurb);
    expect(panel().querySelectorAll(".chip")).toHaveLength(EXPERIENCE[1].stack.length);
    await act(async () => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await act(async () => root.unmount());
  });

  it("every entry carries the fields the card needs", () => {
    for (const x of EXPERIENCE) {
      for (const k of ["id", "company", "kind", "role", "dates", "place", "blurb"]) expect(typeof x[k]).toBe("string");
      expect(Array.isArray(x.stack)).toBe(true);
    }
  });
});
