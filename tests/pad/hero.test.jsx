import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Hero from "../../src/pad/Hero.jsx";
import { DOTS } from "../../src/pad/DotPortrait.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Hero portrait", () => {
  it("shows the portrait with no caption under it", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Hero />));
    const card = host.querySelector(".polaroid");
    expect(card.querySelector("figcaption")).toBeNull();
    const art = card.querySelector(".portrait-dots, .portrait-img");
    expect(art).not.toBeNull();
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("uses a finer dot grid than the first pass (64 a side)", () => {
    expect(DOTS).toBeGreaterThanOrEqual(90);
  });
});
