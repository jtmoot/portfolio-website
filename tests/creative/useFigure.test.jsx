import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { useFigure } from "../../src/creative/useFigure.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const STATIONS = [{ id: "desk", footprint: { x: 27, y: 0, w: 32, h: 16 } }];

function Probe({ active }) {
  useFigure({ active, stations: STATIONS, start: { x: 44, y: 26 }, onFrame: () => {} });
  return null;
}

afterEach(() => vi.restoreAllMocks());

describe("useFigure", () => {
  it("attaches key listeners and a frame loop only while active, and removes them all", async () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 7);
    const caf = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    const host = document.createElement("div");
    const root = createRoot(host);

    await act(async () => root.render(<Probe active />));
    const keyAdds = add.mock.calls.filter(([t]) => t === "keydown" || t === "keyup").length;
    expect(keyAdds).toBe(2);
    expect(raf).toHaveBeenCalled();

    await act(async () => root.render(<Probe active={false} />));
    const keyRemoves = remove.mock.calls.filter(([t]) => t === "keydown" || t === "keyup").length;
    expect(keyRemoves).toBe(2);
    expect(caf).toHaveBeenCalledWith(7);

    const before = raf.mock.calls.length;
    await act(async () => root.render(<Probe active={false} />));
    expect(raf.mock.calls.length).toBe(before);
    await act(async () => root.unmount());
  });
});
