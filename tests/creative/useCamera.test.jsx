import { describe, it, expect, vi, afterEach } from "vitest";
import { act, useRef } from "react";
import { createRoot } from "react-dom/client";
import { useCamera, SETTLE_MS } from "../../src/creative/useCamera.js";
import { VIEW } from "../../src/lib/floorView.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let cam = null;
function Probe({ flipped }) {
  const layer = useRef(null);
  cam = useCamera({ layerRef: layer, view: VIEW, flipped, start: { x: 54, y: 26 }, still: false });
  return (
    <div className="sheet">
      <div ref={layer} className="floor-layer" />
    </div>
  );
}

afterEach(() => vi.useRealTimers());

describe("useCamera", () => {
  it("frames the start when the paper tips, settles, then follows; resets on the way back", async () => {
    vi.useFakeTimers();
    const stage = document.createElement("div");
    stage.className = "stage";
    document.body.appendChild(stage);
    const root = createRoot(stage);
    await act(async () => root.render(<Probe flipped={false} />));
    expect(stage.style.getPropertyValue("--pan-x")).toBe("0");

    await act(async () => root.render(<Probe flipped />));
    expect(stage.style.getPropertyValue("--pan-x")).not.toBe("");
    expect(stage.dataset.settled).toBeUndefined();
    await act(async () => vi.advanceTimersByTime(SETTLE_MS + 10));
    expect(stage.dataset.settled).toBe("");

    const before = cam.pan.current.x;
    cam.follow({ x: 5000, y: 0 }, 1 / 60);
    expect(cam.pan.current.x).not.toBe(before);

    await act(async () => root.render(<Probe flipped={false} />));
    expect(stage.style.getPropertyValue("--pan-x")).toBe("0");
    expect(stage.dataset.settled).toBeUndefined();
    await act(async () => root.unmount());
    stage.remove();
  });
});
