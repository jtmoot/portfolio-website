import { describe, it, expect, vi, beforeEach } from "vitest";
import { createModeStore, lockScroll, unlockScroll } from "../../src/lib/mode.js";

describe("mode store", () => {
  it("starts on the pad and toggles back and forth", () => {
    const m = createModeStore();
    expect(m.get()).toBe("pad");
    m.toggle();
    expect(m.get()).toBe("creative");
    m.toggle();
    expect(m.get()).toBe("pad");
  });

  it("notifies once per change and not for a no-op set", () => {
    const m = createModeStore();
    const fn = vi.fn();
    m.subscribe(fn);
    m.set("creative");
    m.set("creative");
    m.set("pad");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("can start in creative mode", () => {
    expect(createModeStore("creative").get()).toBe("creative");
  });
});

describe("scroll lock", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    unlockScroll();
  });

  it("is idempotent", () => {
    lockScroll();
    lockScroll();
    expect(document.body.style.overflow).toBe("hidden");
    unlockScroll();
    expect(document.body.style.overflow).toBe("");
  });
});
