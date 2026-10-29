import { describe, it, expect, vi } from "vitest";
import { cityFromTimeZone, greetingFor, cleanCity, loadGreeting } from "../../src/lib/greeting.js";

describe("greeting", () => {
  it("says hello to a city, or hello there", () => {
    expect(greetingFor("Pittsburgh")).toBe("Hello, Pittsburgh!");
    expect(greetingFor(null)).toBe("Hello there!");
  });

  it("reads a city out of a time zone", () => {
    expect(cityFromTimeZone("America/New_York")).toBe("New York");
    expect(cityFromTimeZone("America/Argentina/Buenos_Aires")).toBe("Buenos Aires");
    expect(cityFromTimeZone("UTC")).toBeNull();
    expect(cityFromTimeZone("Etc/GMT+5")).toBeNull();
    expect(cityFromTimeZone(undefined)).toBeNull();
  });

  it("only trusts a plain, short city name", () => {
    expect(cleanCity("  São Paulo ")).toBe("São Paulo");
    expect(cleanCity("<script>")).toBeNull();
    expect(cleanCity("x".repeat(60))).toBeNull();
    expect(cleanCity("")).toBeNull();
  });

  it("asks the site's hello endpoint first, then falls back to the time zone", async () => {
    const ok = vi.fn(async () => ({ ok: true, json: async () => ({ city: "Pittsburgh" }) }));
    expect(await loadGreeting({ fetch: ok, timeZone: "America/New_York" })).toBe("Hello, Pittsburgh!");
    expect(ok).toHaveBeenCalledWith("/api/hello", expect.anything());
    const down = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    expect(await loadGreeting({ fetch: down, timeZone: "America/New_York" })).toBe("Hello, New York!");
    const broken = vi.fn(async () => {
      throw new TypeError("offline");
    });
    expect(await loadGreeting({ fetch: broken, timeZone: "UTC" })).toBe("Hello there!");
  });
});
