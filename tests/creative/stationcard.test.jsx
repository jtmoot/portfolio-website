import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import StationCard from "../../src/creative/StationCard.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("StationCard", () => {
  it("is not a live region, so the idle tour does not talk over screen readers", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<StationCard station={{ id: "desk", link: "#experience" }} style={{}} onNavigate={() => {}} />));
    expect(host.querySelector("[role=status]")).toBeNull();
    expect(host.querySelector("[aria-live]")).toBeNull();
    await act(async () => root.unmount());
  });

  it("nudges itself back on screen when it would run off the right edge", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    const spy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ left: 900, right: 1100, top: 0, bottom: 50, width: 200, height: 50 });
    await act(async () => root.render(<StationCard station={{ id: "kitchen", link: "#cooking" }} style={{}} onNavigate={() => {}} />));
    const card = host.querySelector(".station-card");
    expect(card.style.getPropertyValue("--nudge")).toBe(`${window.innerWidth - 8 - 1100}px`);
    spy.mockRestore();
    await act(async () => root.unmount());
    host.remove();
  });
});

describe("StationCard, corkboard", () => {
  it("lists the podcasts with their art, each opening on Spotify in a new tab", async () => {
    const { PODCASTS } = await import("../../src/content/shelf.js");
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<StationCard station={{ id: "corkboard", link: null }} style={{}} onNavigate={() => {}} />));
    const links = [...host.querySelectorAll(".pods a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(PODCASTS.map((p) => p.href));
    expect(links.every((a) => a.target === "_blank")).toBe(true);
    expect(host.querySelectorAll(".pods img")).toHaveLength(4);
    await act(async () => root.unmount());
  });
});

describe("corkboard drawing", () => {
  it("pins the four podcast covers on the board", async () => {
    const { readFileSync } = await import("node:fs");
    const svg = readFileSync("src/creative/stations/art/corkboard.svg", "utf8");
    for (const id of ["how-to-take-over-the-world", "founders", "maxinomics", "ai-daily-brief"]) expect(svg).toContain(`href="/podcasts/${id}.jpg"`);
  });

  it("holds only the podcasts: no poster sheets", async () => {
    const { readFileSync } = await import("node:fs");
    const svg = readFileSync("src/creative/stations/art/corkboard.svg", "utf8");
    expect(svg.match(/<image /g)).toHaveLength(4);
    for (const cls of ["m-sheet\"", "m-sheet-fold", "m-bust", "m-candle"]) expect(svg).not.toContain(cls);
    const label = /label: "([^"]+)"/.exec(readFileSync("tools/stations/corkboard.mjs", "utf8"))[1];
    expect(label).not.toMatch(/sheet|poster|map|circuit|bust|chart/i);
  });
});

describe("the station lines", () => {
  it("are Joshua's own words (Nov 3, three of them changed Nov 4)", async () => {
    const { CARD_TEXT } = await import("../../src/creative/StationCard.jsx");
    expect(Object.fromEntries(Object.entries(CARD_TEXT).map(([id, t]) => [id, t.line]))).toEqual({
      desk: "Building, one day at a time.",
      library: "A short bookcase, mostly contained within my Kindle now.",
      plants: "All thriving: monsteras, a dracaena, a hosta and a money tree.",
      kitchen: "Short ribs, braised in my Dutch oven.",
      gym: "Functional fitness.",
      chess: "A Caro-Kann type of guy",
      reading: "Coffee usually. Tea sometimes. Bone broth occasionally.",
      corkboard: "Highly recommended!",
    });
  });

  it("shows no card for the brain chart", async () => {
    const { default: Card } = await import("../../src/creative/StationCard.jsx");
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Card station={{ id: "anatomy", link: null }} style={{}} onNavigate={() => {}} />));
    expect(host.innerHTML).toBe("");
    await act(async () => root.unmount());
  });
});
