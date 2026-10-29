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

describe("useFigure keys", () => {
  const drive = async (events) => {
    let cb = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
      cb = fn;
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    let ref;
    function Probe2() {
      ref = useFigure({ active: true, stations: STATIONS, start: { x: 44, y: 40 }, onFrame: () => {} }).stateRef;
      return null;
    }
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Probe2 />));
    let t = 0;
    const frames = (n) => {
      for (let i = 0; i < n; i++) cb((t += 16));
    };
    frames(1);
    events(frames);
    const a = { ...ref.current.pos };
    frames(30);
    const b = { ...ref.current.pos };
    await act(async () => root.unmount());
    return { a, b };
  };

  it("releases a key even when Shift changes what keyup reports", async () => {
    const { a, b } = await drive((frames) => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "w", code: "KeyW" }));
      frames(10);
      window.dispatchEvent(new KeyboardEvent("keyup", { key: "W", code: "KeyW" }));
    });
    expect(b).toEqual(a);
  });

  it("drops held keys when the window loses focus", async () => {
    const { a, b } = await drive((frames) => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", code: "ArrowLeft" }));
      frames(10);
      window.dispatchEvent(new Event("blur"));
    });
    expect(b).toEqual(a);
  });
});

describe("useFigure hold and speed", () => {
  const runWith = async (opts, n = 60) => {
    let cb = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
      cb = fn;
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    let ref;
    function P() {
      ref = useFigure({ active: true, stations: STATIONS, start: { x: 44, y: 40 }, onFrame: () => {}, ...opts }).stateRef;
      return null;
    }
    const root = createRoot(document.createElement("div"));
    await act(async () => root.render(<P />));
    let t = 0;
    for (let i = 0; i < n; i++) cb((t += 16));
    const pos = { ...ref.current.pos };
    await act(async () => root.unmount());
    return pos;
  };

  it("passes hold through, so the idle tour waits", async () => {
    expect(await runWith({ hold: true })).toEqual({ x: 44, y: 40 });
    expect(await runWith({ hold: false })).not.toEqual({ x: 44, y: 40 });
  });

  it("passes speed through", async () => {
    const slow = await runWith({ speed: 0.5 }, 30);
    const fast = await runWith({ speed: 2 }, 30);
    const d = (p) => Math.hypot(p.x - 44, p.y - 40);
    expect(d(fast)).toBeCloseTo(d(slow) * 4, 0);
  });
});
