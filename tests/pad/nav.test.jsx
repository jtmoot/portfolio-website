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

  it("offers a sound switch in creative mode only, sharing the page's mute", async () => {
    const { isMuted, setMuted } = await import("../../src/lib/audio.js");
    setMuted(false);
    const host = document.createElement("div");
    const root = createRoot(host);
    const sound = () => [...host.querySelectorAll("button")].find((b) => /^Sound/.test(b.textContent));
    await act(async () => root.render(<Nav theme="day" onToggleTheme={() => {}} mode="pad" onToggleMode={() => {}} />));
    expect(sound()).toBeUndefined();
    await act(async () => root.render(<Nav theme="day" onToggleTheme={() => {}} mode="creative" onToggleMode={() => {}} />));
    expect(sound().textContent).toBe("Sound on");
    expect(sound().getAttribute("aria-pressed")).toBe("true");
    await act(async () => sound().click());
    expect(isMuted()).toBe(true);
    expect(sound().textContent).toBe("Sound off");
    await act(async () => setMuted(false));
    expect(sound().textContent).toBe("Sound on");
    await act(async () => root.unmount());
  });

  it("hands a section link over in creative mode, so the page comes back first; on the pad it is a plain link", async () => {
    const went = [];
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    const render = (mode) => act(async () => root.render(<Nav theme="day" onToggleTheme={() => {}} mode={mode} onToggleMode={() => {}} onNavigate={(href) => went.push(href)} />));
    const experience = () => [...host.querySelectorAll("a")].find((a) => a.textContent === "Experience");
    const click = () => {
      const e = new MouseEvent("click", { bubbles: true, cancelable: true });
      experience().dispatchEvent(e);
      return e.defaultPrevented;
    };
    await render("creative");
    expect(click()).toBe(true);
    expect(went).toEqual(["#experience"]);
    await render("pad");
    expect(click()).toBe(false);
    expect(went).toEqual(["#experience"]);
    await act(async () => root.unmount());
    host.remove();
  });

  it("sits in a sticky dock so it can follow the scroll", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Nav theme="day" onToggleTheme={() => {}} mode="pad" onToggleMode={() => {}} />));
    expect(host.firstElementChild.className).toBe("nav-dock");
    await act(async () => root.unmount());
  });
});
