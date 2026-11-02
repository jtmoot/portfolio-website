import { describe, it, expect } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Leadership from "../../src/pad/Leadership.jsx";
import { LEADERSHIP } from "../../src/content/data.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Leadership", () => {
  it("lists each role as an unfolding row", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Leadership />));
    expect(host.querySelector("#leadership h2").textContent).toBe("Leadership");
    expect(host.querySelectorAll(".xrow")).toHaveLength(LEADERSHIP.length);
    await act(async () => host.querySelector(".xrow-head").click());
    expect(host.querySelector(".xp-more[data-open] .xp-points").textContent).toContain(LEADERSHIP[0].points[0]);
    await act(async () => root.unmount());
  });

  it("links a role's LinkedIn posts once they exist, and shows no empty link before then", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Leadership items={[{ ...LEADERSHIP[0], posts: [{ label: "Read the post", href: "https://www.linkedin.com/posts/x" }] }]} />));
    const link = host.querySelector(".xp-more a");
    expect(link.getAttribute("href")).toBe("https://www.linkedin.com/posts/x");
    expect(link.target).toBe("_blank");
    await act(async () => root.render(<Leadership />));
    expect(host.querySelector(".xp-more a")).toBeNull();
    await act(async () => root.unmount());
  });
});
