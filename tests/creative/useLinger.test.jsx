import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { useLinger, LINGER_MS } from "../../src/creative/useLinger.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let api = null;
function Probe() {
  api = useLinger();
  return null;
}

afterEach(() => vi.useRealTimers());

describe("useLinger", () => {
  it("keeps the hovered id for LINGER_MS after the pointer leaves, then lets go", async () => {
    vi.useFakeTimers();
    const root = createRoot(document.createElement("div"));
    await act(async () => root.render(<Probe />));
    await act(async () => api.enter("desk"));
    expect(api.id).toBe("desk");
    await act(async () => api.leave());
    await act(async () => vi.advanceTimersByTime(LINGER_MS - 100));
    expect(api.id).toBe("desk");
    await act(async () => vi.advanceTimersByTime(200));
    expect(api.id).toBe(null);
    await act(async () => root.unmount());
  });

  it("re-entering before the timer ends keeps it", async () => {
    vi.useFakeTimers();
    const root = createRoot(document.createElement("div"));
    await act(async () => root.render(<Probe />));
    await act(async () => api.enter("desk"));
    await act(async () => api.leave());
    await act(async () => vi.advanceTimersByTime(LINGER_MS / 2));
    await act(async () => api.enter("desk"));
    await act(async () => vi.advanceTimersByTime(LINGER_MS * 2));
    expect(api.id).toBe("desk");
    await act(async () => root.unmount());
  });

  it("switches straight to a new station", async () => {
    vi.useFakeTimers();
    const root = createRoot(document.createElement("div"));
    await act(async () => root.render(<Probe />));
    await act(async () => api.enter("desk"));
    await act(async () => api.leave());
    await act(async () => api.enter("chess"));
    expect(api.id).toBe("chess");
    await act(async () => root.unmount());
  });
});
