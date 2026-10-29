import { describe, it, expect, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Nav, { COMPACT_AT } from "../../src/pad/Nav.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const scrollTo = async (y) => {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  await act(async () => window.dispatchEvent(new Event("scroll")));
};

afterEach(() => Object.defineProperty(window, "scrollY", { value: 0, configurable: true }));

describe("Nav", () => {
  it("compacts into a floating pill once the page scrolls, and opens again at the top", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Nav theme="day" onToggleTheme={() => {}} mode="pad" onToggleMode={() => {}} />));
    const nav = () => host.querySelector("nav");
    expect(nav().hasAttribute("data-compact")).toBe(false);
    await scrollTo(COMPACT_AT + 1);
    expect(nav().hasAttribute("data-compact")).toBe(true);
    await scrollTo(0);
    expect(nav().hasAttribute("data-compact")).toBe(false);
    await act(async () => root.unmount());
  });

  it("sits in a sticky dock so it can follow the scroll", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Nav theme="day" onToggleTheme={() => {}} mode="pad" onToggleMode={() => {}} />));
    expect(host.firstElementChild.className).toBe("nav-dock");
    await act(async () => root.unmount());
  });
});
