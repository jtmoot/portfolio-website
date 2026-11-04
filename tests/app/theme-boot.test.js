import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

describe("theme boot", () => {
  it("applies the saved theme in <head>, before the app script, so night visitors never see day paper", () => {
    const boot = html.indexOf('localStorage.getItem("theme")');
    const app = html.indexOf('src="/src/main.jsx"');
    expect(boot).toBeGreaterThan(-1);
    expect(boot).toBeLessThan(html.indexOf("</head>"));
    expect(boot).toBeLessThan(app);
  });
});
