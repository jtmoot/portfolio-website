import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../../src/lib/audio.js", () => ({ play: vi.fn() }));

beforeAll(() => {
  vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => vi.useRealTimers());

describe("Stage", () => {
  it("turns the page as the paper starts to move, both ways, and not on mount", async () => {
    vi.useFakeTimers();
    const { play } = await import("../../src/lib/audio.js");
    const { createModeStore } = await import("../../src/lib/mode.js");
    const { default: Stage, FLIP_SOUND_DELAY_MS } = await import("../../src/creative/Stage.jsx");
    const store = createModeStore("pad");
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(<Stage store={store}>{() => <div />}</Stage>));
    expect(play).not.toHaveBeenCalled();

    await act(async () => store.set("creative"));
    await act(async () => vi.advanceTimersByTime(10));
    expect(host.querySelector(".stage").dataset.mode).toBe("creative");
    expect(play).toHaveBeenCalledWith("flip", { delay: FLIP_SOUND_DELAY_MS });

    await act(async () => store.set("pad"));
    expect(host.querySelector(".stage").dataset.mode).toBe("pad");
    expect(play).toHaveBeenCalledTimes(2);
    await act(async () => root.unmount());
    host.remove();
  });
});
