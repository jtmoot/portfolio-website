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

  it("unfolds a row to its bullets and chips, and folds it again", async () => {
    const { host, root } = await mount();
    const toggle = host.querySelectorAll(".xrow-head")[1];
    const panel = () => host.querySelector(`#${toggle.getAttribute("aria-controls")}`);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel().hasAttribute("data-open")).toBe(false);
    await act(async () => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(panel().hasAttribute("data-open")).toBe(true);
    expect([...panel().querySelectorAll("ul.xp-points li")].map((li) => li.textContent)).toEqual(EXPERIENCE[1].points);
    expect(panel().querySelectorAll(".chip")).toHaveLength(EXPERIENCE[1].stack.length);
    await act(async () => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await act(async () => root.unmount());
  });

  it("shows no photo on hover, and links the place's site from the unfolded row", async () => {
    const { host, root } = await mount();
    for (const row of host.querySelectorAll(".xrow")) {
      expect(row.closest("[data-prev],[data-ph]")).toBeNull();
      expect(row.querySelector("[data-prev],[data-ph]")).toBeNull();
    }
    const toggle = host.querySelectorAll(".xrow-head")[0];
    // The link sits in the panel, not the row head: a link can't live inside the button.
    expect(toggle.querySelector("a")).toBeNull();
    const site = host.querySelector(`#${toggle.getAttribute("aria-controls")} a.xp-site`);
    expect(site.getAttribute("href")).toBe("https://corenaturalresources.com/");
    expect(site.textContent).toBe("corenaturalresources.com");
    expect(site.getAttribute("target")).toBe("_blank");
    expect(site.getAttribute("rel")).toBe("noreferrer");
    await act(async () => root.unmount());
  });

  it("every entry carries the fields the card needs", () => {
    for (const x of EXPERIENCE) {
      for (const k of ["id", "company", "kind", "role", "dates", "place"]) expect(typeof x[k]).toBe("string");
      expect(Array.isArray(x.stack)).toBe(true);
    }
  });
});
