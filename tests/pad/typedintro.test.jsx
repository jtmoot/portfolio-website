import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import TypedIntro from "../../src/pad/TypedIntro.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("TypedIntro", () => {
  it("gives screen readers the whole paragraph as real text, not an aria-label", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<TypedIntro tokens={[{ text: "i build " }, { text: "ml systems", mark: true }, { text: "." }]} startDelay={10000} />));
    const p = host.querySelector("p");
    expect(p.hasAttribute("aria-label")).toBe(false);
    expect(p.querySelector(".sr-only").textContent).toBe("i build ml systems.");
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });
});
