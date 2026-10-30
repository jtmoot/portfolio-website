import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Cursor from "../../src/pad/Cursor.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => vi.unstubAllGlobals());

const mount = async () => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  document.body.innerHTML = '<button id="b">go</button><canvas id="art"></canvas><p id="t">text</p>';
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => root.render(<Cursor />));
  const dot = host.querySelector(".cursor");
  const over = (id) => document.getElementById(id).dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: 10, clientY: 10 }));
  return { dot, over, root };
};

describe("Cursor", () => {
  it("marks real clickables, but not drawings that only look interactive", async () => {
    const { dot, over, root } = await mount();
    await act(async () => over("b"));
    expect(dot.classList.contains("hot")).toBe(true);
    await act(async () => over("art"));
    expect(dot.classList.contains("hot")).toBe(false);
    await act(async () => over("t"));
    expect(dot.classList.contains("hot")).toBe(false);
    await act(async () => root.unmount());
  });

  it("tightens while the button is held", async () => {
    const { dot, over, root } = await mount();
    await act(async () => over("b"));
    await act(async () => document.dispatchEvent(new MouseEvent("pointerdown")));
    expect(dot.classList.contains("press")).toBe(true);
    await act(async () => document.dispatchEvent(new MouseEvent("pointerup")));
    expect(dot.classList.contains("press")).toBe(false);
    await act(async () => root.unmount());
  });
});

describe("Cursor in the room", () => {
  const room = async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    document.body.innerHTML = '<div class="floor-station"><svg id="art"></svg><div class="station-card"><a id="go" href="/shelf">See the shelf</a></div></div>';
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => root.render(<Cursor />));
    const dot = host.querySelector(".cursor");
    const over = (id) => document.getElementById(id).dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: 5, clientY: 5 }));
    return { dot, over, root };
  };

  it("tells a station's area apart from the link in its card", async () => {
    const { dot, over, root } = await room();
    await act(async () => over("art"));
    expect(dot.classList.contains("area")).toBe(true);
    expect(dot.classList.contains("hot")).toBe(false);
    await act(async () => over("go"));
    expect(dot.classList.contains("hot")).toBe(true);
    expect(dot.classList.contains("area")).toBe(false);
    await act(async () => root.unmount());
  });
});
