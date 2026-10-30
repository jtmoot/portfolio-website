import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Bookcase from "../../src/pad/Bookcase.jsx";
import { SHELF } from "../../src/content/shelf.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => vi.unstubAllGlobals());

const BOOKS = SHELF.flatMap((s) => s.books);

const mount = async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  await act(async () => root.render(<Bookcase />));
  const book = (id) => host.querySelector(`[data-book="${id}"]`);
  const done = async () => {
    await act(async () => root.unmount());
    host.remove();
  };
  return { host, book, done };
};

describe("Bookcase", () => {
  it("draws every book on the shelf as something you can focus and name", async () => {
    const { host, book, done } = await mount();
    expect(host.querySelectorAll("svg [data-book]")).toHaveLength(BOOKS.length);
    for (const b of BOOKS) {
      expect(book(b.id).getAttribute("tabindex"), b.id).toBe("0");
      expect(book(b.id).getAttribute("role")).toBe("button");
      expect(book(b.id).getAttribute("aria-label")).toBe(`${b.title} by ${b.author}`);
    }
    await done();
  });

  it("opens on the first book, already tipped out", async () => {
    const { host, book, done } = await mount();
    expect(book(BOOKS[0].id).hasAttribute("data-picked")).toBe(true);
    expect(host.querySelector(".book-panel h2").textContent).toBe(BOOKS[0].title);
    await done();
  });

  it("clicking a spine tips that book out and shows its details, one at a time", async () => {
    const { host, book, done } = await mount();
    const target = BOOKS.find((b) => b.id === "chip-war");
    await act(async () => book("chip-war").dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(book("chip-war").hasAttribute("data-picked")).toBe(true);
    expect(book(BOOKS[0].id).hasAttribute("data-picked")).toBe(false);
    const panel = host.querySelector(".book-panel");
    expect(panel.querySelector("h2").textContent).toBe(target.title);
    expect(panel.textContent).toContain(target.author);
    expect(panel.textContent).toContain("Already read");
    expect(panel.querySelector("a").getAttribute("href")).toContain("goodreads.com");
    expect(panel.querySelector("img").getAttribute("src")).toBe(target.cover);
    await done();
  });

  it("works from the keyboard", async () => {
    const { host, book, done } = await mount();
    await act(async () => book("ddia").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(host.querySelector(".book-panel h2").textContent).toBe("Designing Data-Intensive Applications");
    await done();
  });

  it("puts a tipped book back in its place on the shelf when another is picked", async () => {
    const { book, done } = await mount();
    const parent = book("zero").parentNode;
    const next = book("zero").nextSibling;
    await act(async () => book("zero").dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await act(async () => book("ddia").dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(book("zero").parentNode).toBe(parent);
    expect(book("zero").nextSibling).toBe(next);
    await done();
  });
});
