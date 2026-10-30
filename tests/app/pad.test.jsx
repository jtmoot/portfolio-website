import { describe, it, expect, vi, beforeAll } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { STATIONS } from "../../src/creative/stations/index.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  window.history.replaceState(null, "", "/");
});

describe("the main page", () => {
  it("has no margin stickers, posters or washi tape", async () => {
    const { default: App } = await import("../../src/App.jsx");
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(<App />));
    expect(host.querySelector(".experience, #experience")).not.toBeNull();
    expect(host.querySelectorAll(".obj, .margin, .tape")).toHaveLength(0);
    await act(async () => root.unmount());
  });

  it("leaves the stickers' links on the room's station cards", () => {
    const link = (id) => STATIONS.find((s) => s.id === id).link;
    expect(link("library")).toBe("/shelf");
    expect(link("chess")).toBe("https://www.chess.com/member/breakfast_enjoyer");
    expect(link("gym")).toBe("https://www.strava.com/athletes/121070736");
  });
});
