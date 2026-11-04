import { describe, it, expect, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Intro from "../../src/pad/Intro.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let host;
let root;
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});

const render = async (paragraphs) => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root.render(<Intro paragraphs={paragraphs} />));
  return host;
};

const PARAS = [[{ text: "I build " }, { text: "ml systems", mark: true }, { text: "." }], [{ text: "At " }, { text: "CMU", mark: true }, { text: "." }]];

describe("Intro", () => {
  it("is every paragraph from the start, as real text: it appears whole rather than typing", async () => {
    const intro = (await render(PARAS)).querySelector(".intro");
    expect([...intro.querySelectorAll(":scope > p")].map((p) => p.textContent)).toEqual(["I build ml systems.", "At CMU."]);
    expect(intro.hasAttribute("aria-label")).toBe(false);
    expect(intro.querySelector("[aria-hidden]")).toBeNull();
    expect(intro.querySelector(".caret")).toBeNull();
  });

  it("numbers the highlights across paragraphs so they draw in one after another", async () => {
    const marks = [...(await render(PARAS)).querySelectorAll("mark")];
    expect(marks.map((m) => m.textContent)).toEqual(["ml systems", "CMU"]);
    expect(marks.map((m) => m.style.getPropertyValue("--i"))).toEqual(["0", "1"]);
  });

  it("escapes nothing by hand: text with markup characters stays text", async () => {
    const p = (await render([[{ text: "a <b> & c" }]])).querySelector(".intro p");
    expect(p.textContent).toBe("a <b> & c");
    expect(p.querySelector("b")).toBeNull();
  });
});
