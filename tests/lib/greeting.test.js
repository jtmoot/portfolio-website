import { describe, it, expect, vi } from "vitest";
import { greetingFor, cleanCity, loadGreeting } from "../../src/lib/greeting.js";

describe("greeting", () => {
  it("says hello to a city, or hello there", () => {
    expect(greetingFor("Pittsburgh")).toBe("Hello, Pittsburgh!");
    expect(greetingFor(null)).toBe("Hello there!");
  });

  it("only trusts a plain, short city name", () => {
    expect(cleanCity("  São Paulo ")).toBe("São Paulo");
    expect(cleanCity("<script>")).toBeNull();
    expect(cleanCity("x".repeat(60))).toBeNull();
    expect(cleanCity("")).toBeNull();
  });

  it("asks the site's hello endpoint, and never guesses a city from the time zone", async () => {
    const ok = vi.fn(async () => ({ ok: true, json: async () => ({ city: "Pittsburgh" }) }));
    expect(await loadGreeting({ fetch: ok })).toBe("Hello, Pittsburgh!");
    expect(ok).toHaveBeenCalledWith("/api/hello", expect.anything());
    // Pittsburgh's time zone is America/New_York: a time zone names a region's biggest city, not yours.
    const down = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    expect(await loadGreeting({ fetch: down })).toBe("Hello there!");
    const broken = vi.fn(async () => {
      throw new TypeError("offline");
    });
    expect(await loadGreeting({ fetch: broken })).toBe("Hello there!");
  });
});
