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

describe("Shelf extras", () => {
  const mount = async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Shelf />));
    return { host, root };
  };

  it("ends with the Recommend a book form, which never opens email", async () => {
    const { host, root } = await mount();
    const section = host.querySelector(".recommend");
    expect(section.querySelector("h2").textContent).toBe("Recommend a book");
    expect(section.querySelector("form")).not.toBeNull();
    expect(section.querySelector('a[href^="mailto:"]')).toBeNull();
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("is plain: a bookcase and lists, with no doodles or fake window bars", async () => {
    const { host, root } = await mount();
    expect(host.querySelector(".bookcase svg")).not.toBeNull();
    expect(host.querySelectorAll(".desk-prop, .shelf-bar")).toHaveLength(0);
    expect(host.querySelector("h1").textContent).toBe("Library");
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("has no creative-mode toggle in its nav: the room belongs to the pad", async () => {
    const { host, root } = await mount();
    expect([...host.querySelectorAll(".nav button")].some((b) => b.textContent.includes("Creative mode"))).toBe(false);
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });

  it("has his sticky note drawn on top of the bookcase, in his hand", async () => {
    const { host, root } = await mount();
    const note = host.querySelector(".bookcase svg .bk-note-text");
    expect([...note.querySelectorAll("text")].map((t) => t.textContent)).toEqual(["Never stop the", "intellectual", "struggle"]);
    expect(host.querySelector(".bookcase svg .m-sticky")).not.toBeNull();
    expect(host.querySelector(".sticky-note")).toBeNull();
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
  });
});
