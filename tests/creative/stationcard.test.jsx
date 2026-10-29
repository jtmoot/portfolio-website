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
