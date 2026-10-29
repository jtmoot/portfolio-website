import { describe, it, expect } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import StationCard from "../../src/creative/StationCard.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("StationCard", () => {
  it("is not a live region, so the idle tour does not talk over screen readers", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<StationCard station={{ id: "desk", link: "#experience" }} style={{}} onNavigate={() => {}} />));
    expect(host.querySelector("[role=status]")).toBeNull();
    expect(host.querySelector("[aria-live]")).toBeNull();
    await act(async () => root.unmount());
  });
});
