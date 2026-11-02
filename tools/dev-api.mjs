import { existsSync } from "node:fs";
import { resolve } from "node:path";

/** /api/<name>, where <name> is a plain lowercase file name: nothing that could climb out of api/. */
const ROUTE = /^\/api\/([a-z][a-z0-9-]*)(?:\?|$)/;

/** Loopback names only: this runs before Vite's own host check and CORS handling. */
const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);
const hostname = (host) => (host ?? "").replace(/:\d+$/, "").toLowerCase();

/**
 * True when the request comes from a page served by this dev server on this machine: a loopback
 * Host (which also defeats DNS rebinding) and, when the browser sends one, an Origin on that Host.
 * @param {import("node:http").IncomingMessage} req
 */
function fromHere(req) {
  if (!LOOPBACK.has(hostname(req.headers.host))) return false;
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

/**
 * Connect middleware that runs the Vercel functions in api/ inside Vite's dev server: a request to
 * /api/<name> calls the method's export of api/<name>.js with a Web Request, and writes its Web
 * Response back. Vercel's x-vercel-ip-city header is stood in for, so /api/hello knows a city.
 * Only pages from this dev server on this machine are answered, since `doppler run` gives
 * /api/recommend a real database.
 * @param {{ load: (path: string) => Promise<object | null>, city?: string }} o
 *   load returns the module at that path, or null when there is no such file
 * @returns {(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, next: () => void) => Promise<void>}
 */
export function apiMiddleware({ load, city = "Pittsburgh" }) {
  return async (req, res, next) => {
    const name = ROUTE.exec(req.url ?? "")?.[1];
    if (!name) return next();
    if (!fromHere(req)) {
      res.writeHead(403, { "content-type": "text/plain" });
      res.end("The dev API only answers this dev server's own pages.");
      return;
    }
    try {
      const mod = await load(`/api/${name}.js`);
      if (!mod) return next();
      const handler = mod[req.method];
      if (typeof handler !== "function") {
        res.writeHead(405, { "content-type": "text/plain" });
        res.end("Method not allowed");
        return;
      }
      const headers = new Headers();
      for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
      if (!headers.has("x-vercel-ip-city")) headers.set("x-vercel-ip-city", encodeURIComponent(city));
      const chunks = [];
      if (req.method !== "GET" && req.method !== "HEAD") for await (const c of req) chunks.push(c);
      const request = new Request(`http://${req.headers.host ?? "localhost"}${req.url}`, {
        method: req.method,
        headers,
        body: chunks.length ? Buffer.concat(chunks) : undefined,
      });
      const response = await handler(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (err) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end(`api/${name}.js failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
}

/**
 * A Vite plugin (dev server only) that serves api/*.js, so the greeting and the recommend form work
 * under `npm run dev`. The city is DEV_CITY, else Pittsburgh; run `doppler run -- npm run dev` to
 * give /api/recommend the dev database.
 * @returns {import("vite").Plugin}
 */
export function devApi() {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server) {
      const root = server.config.root;
      const load = async (path) => (existsSync(resolve(root, `.${path}`)) ? server.ssrLoadModule(path) : null);
      server.middlewares.use(apiMiddleware({ load, city: process.env.DEV_CITY || "Pittsburgh" }));
    },
  };
}
