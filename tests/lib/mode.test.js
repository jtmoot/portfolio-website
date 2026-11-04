import { describe, it, expect, vi, beforeEach } from "vitest";
import { createModeStore, createModeController, lockScroll, unlockScroll } from "../../src/lib/mode.js";

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

describe("mode controller", () => {
  const deferred = () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };

  it("enters creative only once the room has loaded", async () => {
    const store = createModeStore();
    const d = deferred();
    const c = createModeController(store, () => d.promise);
    const done = c.toggle();
    expect(store.get()).toBe("pad");
    d.resolve();
    await done;
    expect(store.get()).toBe("creative");
  });

  it("a second toggle while loading cancels the first", async () => {
    const store = createModeStore();
    const d = deferred();
    const c = createModeController(store, () => d.promise);
    const first = c.toggle();
    c.toggle();
    d.resolve();
    await first;
    expect(store.get()).toBe("pad");
  });

  it("stays on the pad if the room fails to load", async () => {
    const store = createModeStore();
    const c = createModeController(store, () => Promise.reject(new Error("offline")));
    await c.toggle();
    expect(store.get()).toBe("pad");
  });

  it("leaves creative immediately", async () => {
    const store = createModeStore("creative");
    const c = createModeController(store, () => new Promise(() => {}));
    await c.toggle();
    expect(store.get()).toBe("pad");
  });
});
