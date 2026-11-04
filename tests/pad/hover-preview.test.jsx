import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import HoverPreview from "../../src/pad/HoverPreview.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("HoverPreview", () => {
  it("draws an envelope with the address for a link marked data-icon=mail", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const host = document.createElement("div");
    document.body.append(host);
    const link = document.createElement("a");
    link.dataset.ph = "josh.moorehead@outlook.com";
    link.dataset.icon = "mail";
    link.dataset.cap = "Email";
    document.body.append(link);
    const root = createRoot(host);
    await act(async () => root.render(<HoverPreview />));
    await act(async () => {
      link.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      vi.advanceTimersByTime(200);
    });
    const mail = host.querySelector(".preview .preview-mail");
    expect(mail.querySelector("svg")).not.toBeNull();
    expect(mail.textContent).toBe("josh.moorehead@outlook.com");
    expect(host.querySelector(".preview-ph:not(.preview-mail)")).toBeNull();
    await act(async () => root.unmount());
    link.remove();
    host.remove();
  });
});
