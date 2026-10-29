import { describe, it, expect, beforeEach } from "vitest";
import { getTheme, setTheme, toggleTheme } from "../../src/lib/theme.js";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("defaults to day", () => {
    expect(getTheme()).toBe("day");
  });

  it("toggle flips day and night on <html> and persists", () => {
    setTheme("day");
    toggleTheme();
    expect(document.documentElement.dataset.theme).toBe("night");
    expect(localStorage.getItem("theme")).toBe("night");
    toggleTheme();
    expect(document.documentElement.dataset.theme).toBe("day");
    expect(localStorage.getItem("theme")).toBe("day");
  });

  it("reads a saved theme", () => {
    localStorage.setItem("theme", "night");
    expect(getTheme()).toBe("night");
  });
});
