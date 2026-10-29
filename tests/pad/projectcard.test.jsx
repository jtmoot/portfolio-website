import { describe, it, expect, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import ProjectCard, { startPlayback } from "../../src/pad/ProjectCard.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let host;
afterEach(() => {
  host?.remove();
});

const render = async (el) => {
  host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  await act(async () => root.render(el));
  return host;
};

const BASE = { id: "x", title: "Thing", tagline: "does stuff", tag: "python", poster: "/media/x-poster.jpg", links: [] };

describe("ProjectCard", () => {
  it("shows the poster image when there is no video", async () => {
    const el = await render(<ProjectCard project={{ ...BASE, video: null }} />);
    expect(el.querySelector("video")).toBeNull();
    expect(el.querySelector("img").getAttribute("src")).toBe("/media/x-poster.jpg");
  });

  it("renders a muted looping video with the poster when there is one", async () => {
    const el = await render(<ProjectCard project={{ ...BASE, video: "/media/x" }} />);
    const v = el.querySelector("video");
    expect(v.muted).toBe(true);
    expect(v.loop).toBe(true);
    expect(v.getAttribute("poster")).toBe("/media/x-poster.jpg");
    expect([...v.querySelectorAll("source")].map((s) => s.getAttribute("src"))).toEqual(["/media/x.webm", "/media/x.mp4"]);
  });

  it("plays when scrolled into view and pauses when it leaves, without hovering", async () => {
    globalThis.matchMedia = (q) => ({ matches: q === "(pointer: fine)" });
    let fire;
    globalThis.IntersectionObserver = class {
      constructor(cb) {
        fire = cb;
      }
      observe() {}
      disconnect() {}
    };
    const calls = [];
    const proto = HTMLMediaElement.prototype;
    const { play, pause } = proto;
    proto.play = function () {
      calls.push("play");
      return Promise.resolve();
    };
    proto.pause = function () {
      calls.push("pause");
    };
    try {
      await render(<ProjectCard project={{ ...BASE, video: "/media/x" }} />);
      await act(async () => fire([{ isIntersecting: true }]));
      await act(async () => fire([{ isIntersecting: false }]));
      expect(calls).toEqual(["play", "pause"]);
    } finally {
      proto.play = play;
      proto.pause = pause;
      delete globalThis.IntersectionObserver;
      delete globalThis.matchMedia;
    }
  });

  it("startPlayback swallows a blocked play()", async () => {
    const fake = { play: () => Promise.reject(new Error("NotAllowedError")) };
    await expect(startPlayback(fake)).resolves.toBeUndefined();
  });

  it("startPlayback tolerates a missing element", async () => {
    await expect(startPlayback(null)).resolves.toBeUndefined();
  });
});
