import { describe, it, expect } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import SpeedWheel from "../../src/creative/SpeedWheel.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("SpeedWheel", () => {
  it("is a labelled slider that arrow keys and the wheel turn", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    let value = 1;
    const render = () => root.render(<SpeedWheel value={value} onChange={(v) => { value = v; render(); }} />);
    await act(async () => render());
    const knob = host.querySelector("[role=slider]");
    expect(knob.getAttribute("aria-label")).toBe("walking speed");
    expect(knob.getAttribute("aria-valuenow")).toBe("1");
    expect(knob.getAttribute("aria-valuetext")).toBe("1x");
    await act(async () => knob.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })));
    expect(value).toBe(1.25);
    await act(async () => knob.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })));
    expect(value).toBe(1);
    await act(async () => knob.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, bubbles: true, cancelable: true })));
    expect(value).toBe(1.25);
    await act(async () => knob.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })));
    expect(value).toBe(0.5);
    await act(async () => root.unmount());
    host.remove();
  });

  it("does not let its arrow keys walk the figure", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => root.render(<SpeedWheel value={1} onChange={() => {}} />));
    let reached = false;
    const spy = () => (reached = true);
    window.addEventListener("keydown", spy);
    host.querySelector("[role=slider]").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    window.removeEventListener("keydown", spy);
    expect(reached).toBe(false);
    await act(async () => root.unmount());
    host.remove();
  });
});
