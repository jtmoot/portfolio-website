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

  it("underlines the linked words inside a bullet, opening the post in a new tab", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    const row = { ...LEADERSHIP[0], points: ["Plain bullet.", { text: "Won the Big Award; other things.", link: { words: "Big Award", href: "https://www.linkedin.com/posts/x" } }] };
    await act(async () => root.render(<Leadership items={[row]} />));
    const [plain, linked] = host.querySelectorAll(".xp-points li");
    expect(plain.textContent).toBe("Plain bullet.");
    expect(plain.querySelector("a")).toBeNull();
    expect(linked.textContent).toBe("Won the Big Award; other things.");
    const a = linked.querySelector("a");
    expect(a.textContent).toBe("Big Award");
    expect(a.getAttribute("href")).toBe("https://www.linkedin.com/posts/x");
    expect(a.target).toBe("_blank");
    expect(a.rel).toBe("noreferrer");
    await act(async () => root.unmount());
  });

  it("links a role's LinkedIn posts once they exist, and shows no empty link before then", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Leadership items={[{ ...LEADERSHIP[0], posts: [{ label: "Read the post", href: "https://www.linkedin.com/posts/x" }] }]} />));
    const link = host.querySelector(".xp-more a");
    expect(link.getAttribute("href")).toBe("https://www.linkedin.com/posts/x");
    expect(link.target).toBe("_blank");
    await act(async () => root.render(<Leadership items={[{ ...LEADERSHIP[0], posts: [] }]} />));
    expect(host.querySelector(".xp-more a")).toBeNull();
    await act(async () => root.unmount());
  });
});
