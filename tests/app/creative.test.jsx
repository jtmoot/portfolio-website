import { describe, it, expect, vi, beforeAll } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  window.history.replaceState(null, "", "/?mode=creative");
});

describe("creative mode in the app", () => {
  it("makes the tipped paper inert and Escape returns to the pad", async () => {
    const { default: App } = await import("../../src/App.jsx");
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(<App />));
    const poster = host.querySelector(".poster");
    expect(poster.hasAttribute("inert")).toBe(true);
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(host.querySelector(".stage").dataset.mode).toBe("pad");
    expect(host.querySelector(".poster").hasAttribute("inert")).toBe(false);
    await act(async () => root.unmount());
  });
});
