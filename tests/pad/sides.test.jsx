import { describe, it, expect, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Sides from "../../src/pad/Sides.jsx";
import { PROJECTS } from "../../src/content/data.js";
import { SHELF } from "../../src/content/shelf.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let host;
let root;
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});

const render = async (variant) => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root.render(<Sides variant={variant} />));
  return host;
};

describe("Sides", () => {
  it("renders nothing without a variant", async () => {
    expect((await render(null)).innerHTML).toBe("");
  });

  it("rail: a section index on the left and a Now card on the right", async () => {
    const el = await render("rail");
    const index = el.querySelector('nav.side-index[aria-label="On this page"]');
    expect([...index.querySelectorAll("a")].map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Experience", "#experience"],
      ["Projects", "#work"],
      ["Leadership", "#leadership"],
      ["Contact", "#contact"],
    ]);
    const now = el.querySelector("aside.side-now");
    expect(now.querySelector("h2").textContent).toBe("Now");
    const rows = [...now.querySelectorAll("dt")].map((d) => d.textContent);
    expect(rows).toEqual(["Reading", "Building", "Training", "Chess"]);
    expect(now.textContent).toContain(SHELF[0].books[0].title);
    expect(now.querySelector('a[href="/shelf"]')).not.toBeNull();
    expect(now.querySelector('a[href^="https://www.strava.com/"]')).not.toBeNull();
    expect(now.querySelector('a[href^="https://www.chess.com/"]')).not.toBeNull();
  });

  it("float: each project with a poster pinned in the margins, previewing on hover and leading to its card", async () => {
    const el = await render("float");
    const pins = [...el.querySelectorAll(".side-pin")];
    const withPosters = PROJECTS.filter((p) => p.poster);
    expect(pins).toHaveLength(withPosters.length);
    pins.forEach((pin, i) => {
      expect(pin.getAttribute("href")).toBe(`#project-${withPosters[i].id}`);
      expect(pin.dataset.prev).toBe(withPosters[i].poster);
      expect(pin.querySelector("img").getAttribute("alt")).toBe("");
      expect(pin.getAttribute("aria-label")).toBe(`${withPosters[i].title}, jump to the project`);
    });
    expect(new Set(pins.map((p) => p.dataset.side))).toEqual(new Set(["left", "right"]));
  });
});
