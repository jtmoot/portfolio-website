import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { VIEW } from "../../src/lib/floorView.js";
// Imported here, not inside the test: pulling in every drawing can take seconds on a busy machine.
import Floor from "../../src/creative/Floor.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => vi.restoreAllMocks());

describe("the floor layer on a first entry", () => {
  it("is born off and turns on two frames later, so its sketch-in transitions run", async () => {
    const frames = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => frames.push(cb));
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    const stage = document.createElement("div");
    stage.className = "stage";
    stage.innerHTML = '<main class="sheet"><section class="poster"></section></main>';
    document.body.append(stage);
    const host = stage.querySelector(".sheet");
    const root = createRoot(host);

    // Mounted with the paper already tipping, as on every first entry.
    await act(async () => root.render(<Floor view={VIEW} flipped onNavigate={() => {}} />));
    const layer = host.querySelector(".floor-layer");
    expect(layer).not.toBeNull();
    expect(layer.hasAttribute("data-on")).toBe(false);

    // One frame: still off. Two frames: on.
    const flush = async () => {
      const pending = frames.splice(0);
      await act(async () => pending.forEach((cb) => cb(16)));
    };
    await flush();
    expect(layer.hasAttribute("data-on")).toBe(false);
    await flush();
    expect(layer.hasAttribute("data-on")).toBe(true);

    // Back on the pad it goes off at once.
    await act(async () => root.render(<Floor view={VIEW} flipped={false} onNavigate={() => {}} />));
    expect(layer.hasAttribute("data-on")).toBe(false);
    await act(async () => root.unmount());
    stage.remove();
  }, 20000);
});
