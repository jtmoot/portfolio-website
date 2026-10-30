import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.doUnmock("../../src/lib/audio.js");
  vi.resetModules();
});

const mount = async () => {
  let muted = false;
  const audio = { isMuted: () => muted, setMuted: vi.fn((v) => (muted = v)) };
  vi.doMock("../../src/lib/audio.js", () => audio);
  const { default: IntroTools } = await import("../../src/pad/IntroTools.jsx");
  const onReplay = vi.fn();
  const host = document.createElement("div");
  const root = createRoot(host);
  await act(async () => root.render(<IntroTools onReplay={onReplay} />));
  return { host, root, audio, onReplay };
};

describe("IntroTools", () => {
  it("replays from a small icon button", async () => {
    const { host, root, onReplay } = await mount();
    const b = host.querySelector('button[aria-label="Replay the name with sound"]');
    expect(b.textContent.trim()).toBe("");
    await act(async () => b.click());
    expect(onReplay).toHaveBeenCalledTimes(1);
    await act(async () => root.unmount());
  });

  it("toggles mute and shows the state", async () => {
    const { host, root, audio } = await mount();
    const b = host.querySelector('button[aria-label="Mute sound"]');
    expect(b.getAttribute("aria-pressed")).toBe("false");
    await act(async () => b.click());
    expect(audio.setMuted).toHaveBeenCalledWith(true);
    expect(b.getAttribute("aria-pressed")).toBe("true");
    await act(async () => root.unmount());
  });
});
