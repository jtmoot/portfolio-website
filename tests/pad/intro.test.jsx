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

const render = async (tokens) => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root.render(<Intro tokens={tokens} />));
  return host;
};

const TOKENS = [{ text: "I build " }, { text: "ml systems", mark: true }, { text: " at " }, { text: "CMU", mark: true }, { text: "." }];

describe("Intro", () => {
  it("is the whole paragraph from the start, as real text: it appears whole rather than typing", async () => {
    const p = (await render(TOKENS)).querySelector("p.intro");
    expect(p.textContent).toBe("I build ml systems at CMU.");
    expect(p.hasAttribute("aria-label")).toBe(false);
    expect(p.querySelector("[aria-hidden]")).toBeNull();
    expect(p.querySelector(".caret")).toBeNull();
  });

  it("numbers the highlights so they can draw in one after another", async () => {
    const marks = [...(await render(TOKENS)).querySelectorAll("mark")];
    expect(marks.map((m) => m.textContent)).toEqual(["ml systems", "CMU"]);
    expect(marks.map((m) => m.style.getPropertyValue("--i"))).toEqual(["0", "1"]);
  });

  it("escapes nothing by hand: text with markup characters stays text", async () => {
    const p = (await render([{ text: "a <b> & c" }])).querySelector("p");
    expect(p.textContent).toBe("a <b> & c");
    expect(p.querySelector("b")).toBeNull();
  });
});
