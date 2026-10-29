import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Shelf from "../../src/pad/Shelf.jsx";
import { SHELF } from "../../src/content/shelf.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Shelf page", () => {
  const mount = async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Shelf />));
    return { host, root };
  };

  it("leads back to the portfolio and shows every list", async () => {
    const { host, root } = await mount();
    expect(host.querySelector('a.back').getAttribute("href")).toBe("/");
    for (const s of SHELF) expect(host.querySelector(`#shelf-${s.id}`)).not.toBeNull();
    expect(host.querySelectorAll(".book-row")).toHaveLength(6);
    expect(host.querySelectorAll(".book-tile")).toHaveLength(27);
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("draws a typeset cover when a book has no image", async () => {
    const { host, root } = await mount();
    const missing = SHELF.flatMap((s) => s.books).find((b) => !b.cover);
    if (missing) expect(host.querySelector(`[data-book="${missing.id}"] .cover-drawn`).textContent).toContain(missing.title);
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });
});
