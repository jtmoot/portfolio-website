import { describe, it, expect, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Sides from "../../src/pad/Sides.jsx";
import { SHELF } from "../../src/content/shelf.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let host;
let root;
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});

const render = async () => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root.render(<Sides />));
  return host;
};

describe("Sides", () => {
  it("a section index on the left", async () => {
    const el = await render();
    const index = el.querySelector('nav.side-index[aria-label="On this page"]');
    expect([...index.querySelectorAll("a")].map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Experience", "#experience"],
      ["Projects", "#work"],
      ["Leadership", "#leadership"],
      ["Contact", "#contact"],
    ]);
  });

  it("a small book on the right that opens the shelf, instead of a Now card", async () => {
    const el = await render();
    expect(el.querySelector(".side-now")).toBeNull();
    const book = el.querySelector("a.side-book");
    expect(book.getAttribute("href")).toBe("/shelf");
    expect(book.getAttribute("aria-label")).toBe(`The bookshelf, now reading ${SHELF[0].books[0].title}`);
    expect(book.querySelector("svg").getAttribute("aria-hidden")).toBe("true");
  });

  it("no longer pins project posters in the margins", async () => {
    const el = await render();
    expect(el.querySelector(".side-pin")).toBeNull();
  });
});

describe("Sides marks where you are", () => {
  it("follows the scroll all the way to Contact, which can't reach the top of the window", async () => {
    // A fake page measured like the real one at 1440 x 900.
    const TOPS = { experience: 461, work: 856, leadership: 3032, contact: 3276 };
    const sections = Object.entries(TOPS).map(([id, top]) => {
      const el = document.createElement("section");
      el.id = id;
      el.getBoundingClientRect = () => ({ top: top - window.scrollY });
      document.body.append(el);
      return el;
    });
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 3540 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 });
    const scrollTo = async (y) => {
      Object.defineProperty(window, "scrollY", { configurable: true, value: y });
      await act(async () => {
        window.dispatchEvent(new Event("scroll"));
        await new Promise((r) => requestAnimationFrame(r));
      });
    };
    const el = await render();
    const marked = () => el.querySelector('.side-index a[aria-current="true"]')?.textContent;
    await scrollTo(0);
    expect(marked()).toBe("Experience");
    await scrollTo(900);
    expect(marked()).toBe("Projects");
    await scrollTo(2400);
    expect(marked()).toBe("Leadership");
    await scrollTo(2640);
    expect(marked()).toBe("Contact");
    sections.forEach((s) => s.remove());
  });
});
