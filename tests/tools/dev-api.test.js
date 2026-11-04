import { describe, it, expect, vi } from "vitest";
import { apiMiddleware, devApi } from "../../tools/dev-api.mjs";

/** A Node request: an async iterable of body chunks with url, method and headers. */
const req = (url, { method = "GET", headers = {}, body = "" } = {}) => ({
  url,
  method,
  headers: { host: "localhost:5199", ...headers },
  async *[Symbol.asyncIterator]() {
    if (body) yield Buffer.from(body);
  },
});

/** A Node response that records what was written. */
const res = () => {
  const r = { status: 0, headers: {}, body: "" };
  r.writeHead = (status, headers) => {
    r.status = status;
    Object.assign(r.headers, headers);
  };
  r.end = (chunk) => {
    r.body = chunk ? Buffer.from(chunk).toString() : "";
    r.ended = true;
  };
  return r;
};

const run = async (mw, request) => {
  const out = res();
  const next = vi.fn();
  await mw(request, out, next);
  return { out, next };
};

describe("apiMiddleware", () => {
  it("runs api/<name>.js's handler for the method, as Vercel would", async () => {
    const load = vi.fn(async () => ({ GET: () => Response.json({ hi: 1 }, { status: 200, headers: { "cache-control": "no-store" } }) }));
    const { out, next } = await run(apiMiddleware({ load }), req("/api/hello?x=1"));
    expect(load).toHaveBeenCalledWith("/api/hello.js");
    expect(next).not.toHaveBeenCalled();
    expect(out.status).toBe(200);
    expect(out.headers["cache-control"]).toBe("no-store");
    expect(JSON.parse(out.body)).toEqual({ hi: 1 });
  });

  it("stands in for Vercel's city header, so the room says Hello, Pittsburgh! locally", async () => {
    const { GET } = await import("../../api/hello.js");
    const load = async () => ({ GET });
    const { out } = await run(apiMiddleware({ load }), req("/api/hello"));
    expect(JSON.parse(out.body)).toEqual({ city: "Pittsburgh" });
    const { out: other } = await run(apiMiddleware({ load, city: "São Paulo" }), req("/api/hello"));
    expect(JSON.parse(other.body)).toEqual({ city: "São Paulo" });
  });

  it("passes the body and headers through on a POST", async () => {
    let seen;
    const load = async () => ({
      POST: async (r) => {
        seen = { method: r.method, type: r.headers.get("content-type"), body: await r.text(), url: r.url };
        return Response.json({ ok: true }, { status: 201 });
      },
    });
    const { out } = await run(apiMiddleware({ load }), req("/api/recommend", { method: "POST", headers: { "content-type": "application/json" }, body: '{"title":"Stoner"}' }));
    expect(out.status).toBe(201);
    expect(seen).toEqual({ method: "POST", type: "application/json", body: '{"title":"Stoner"}', url: "http://localhost:5199/api/recommend" });
  });

  it("answers 405 for a method the file doesn't handle", async () => {
    const load = async () => ({ GET: () => new Response("x") });
    const { out } = await run(apiMiddleware({ load }), req("/api/hello", { method: "DELETE" }));
    expect(out.status).toBe(405);
  });

  it("leaves everything else, and names that aren't files, to Vite", async () => {
    // load answers null when there is no such file.
    const load = vi.fn(async () => null);
    for (const url of ["/", "/src/main.jsx", "/api/../vite.config.js", "/api/Hello"]) {
      const { next } = await run(apiMiddleware({ load }), req(url));
      expect(next).toHaveBeenCalled();
    }
    expect(load).not.toHaveBeenCalled();
    const { next } = await run(apiMiddleware({ load }), req("/api/nope"));
    expect(next).toHaveBeenCalled();
  });

  it("answers 500 when a handler or its file fails, instead of hanging the request", async () => {
    const throwing = async () => ({
      GET: () => {
        throw new Error("boom");
      },
    });
    const broken = async () => {
      throw new SyntaxError("Unexpected token");
    };
    for (const load of [throwing, broken]) {
      const { out } = await run(apiMiddleware({ load }), req("/api/hello"));
      expect(out.status).toBe(500);
      expect(out.ended).toBe(true);
    }
  });
});

describe("apiMiddleware only answers this machine's own pages", () => {
  const load = vi.fn(async () => ({ POST: () => Response.json({ ok: true }, { status: 201 }), GET: () => Response.json({}) }));

  it("refuses another website's page posting to it (an Origin that isn't the dev server)", async () => {
    const { out } = await run(apiMiddleware({ load }), req("/api/recommend", { method: "POST", headers: { origin: "https://evil.example" }, body: "{}" }));
    expect(out.status).toBe(403);
  });

  it("refuses a Host that isn't localhost (DNS rebinding, or another machine on the network)", async () => {
    for (const host of ["evil.example:5199", "192.168.1.20:5199"]) {
      const { out } = await run(apiMiddleware({ load }), req("/api/hello", { headers: { host } }));
      expect(out.status).toBe(403);
    }
  });

  it("answers its own pages, on any loopback name", async () => {
    for (const host of ["localhost:5199", "127.0.0.1:5199", "[::1]:5199"]) {
      const { out } = await run(apiMiddleware({ load }), req("/api/recommend", { method: "POST", headers: { host, origin: `http://${host}` }, body: "{}" }));
      expect(out.status).toBe(201);
    }
  });
});

describe("devApi", () => {
  it("is a dev-server-only Vite plugin", () => {
    const plugin = devApi();
    expect(plugin.name).toBe("dev-api");
    expect(plugin.apply).toBe("serve");
    expect(typeof plugin.configureServer).toBe("function");
  });
});
