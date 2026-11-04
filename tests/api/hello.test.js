import { describe, it, expect } from "vitest";
import { GET } from "../../api/hello.js";

describe("api/hello", () => {
  it("returns only the visitor's city from Vercel's header, and is never cached", async () => {
    const res = GET(new Request("https://x.test/api/hello", { headers: { "x-vercel-ip-city": "S%C3%A3o%20Paulo", "x-vercel-ip-latitude": "1" } }));
    expect(await res.json()).toEqual({ city: "São Paulo" });
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("returns null without the header", async () => {
    const res = GET(new Request("https://x.test/api/hello"));
    expect(await res.json()).toEqual({ city: null });
  });
});
