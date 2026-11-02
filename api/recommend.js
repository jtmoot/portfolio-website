import { createHash } from "node:crypto";
import postgres from "postgres";
import { validate } from "../src/lib/recommend.js";

/**
 * POST /api/recommend: stores a visitor's book recommendation in Postgres (Railway) for Joshua to
 * read with `npm run recs`. Up to 5 sends per visitor per day, keyed by a salted hash of the IP;
 * the IP itself is never stored or logged. Nothing is ever read back out through this endpoint.
 */

const MAX_BYTES = 4096;
const PER_DAY = 5;
const DAY_MS = 24 * 3600 * 1000;

const reply = (status, body) => Response.json(body, { status, headers: { "cache-control": "private, no-store" } });
const UNREACHABLE = "Couldn't reach the list. Try again later.";

/**
 * The endpoint's logic, with its database and salt passed in so it can be tested without either.
 * @param {Request} request
 * @param {{ db: { recentCount: (ipHash: string, since: Date) => Promise<number>, insert: (row: object) => Promise<void> } | null, salt: string, now?: () => Date }} deps
 * @returns {Promise<Response>}
 */
export async function handle(request, { db, salt, now = () => new Date() }) {
  const raw = await request.text();
  if (raw.length > MAX_BYTES) return reply(413, { error: "That's too long to send." });
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { error: "Send the form as JSON." });
  }
  const checked = validate(body);
  if (!checked.ok) return reply(400, { error: checked.error });
  if (checked.spam) return reply(201, { ok: true });
  if (!db || !salt) return reply(503, { error: UNREACHABLE });

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex");
  try {
    if ((await db.recentCount(ipHash, new Date(now().getTime() - DAY_MS))) >= PER_DAY) {
      return reply(429, { error: "Too many sends from here today. Try again tomorrow." });
    }
    await db.insert({ ...checked.value, ipHash });
  } catch {
    return reply(503, { error: UNREACHABLE });
  }
  return reply(201, { ok: true });
}

let sql = null;

/** The Railway database, connected on first use. Railway's proxy speaks TLS with its own certificate. */
function database() {
  if (!process.env.DATABASE_URL) return null;
  sql ??= postgres(process.env.DATABASE_URL, { ssl: "require", max: 1, idle_timeout: 5, connect_timeout: 5 });
  return {
    recentCount: async (ipHash, since) => {
      const [row] = await sql`select count(*)::int as n from recommendations where ip_hash = ${ipHash} and created_at > ${since}`;
      return row.n;
    },
    insert: async ({ title, author, olKey, coverId, note, name, ipHash }) => {
      await sql`insert into recommendations (title, author, ol_key, cover_id, note, from_name, ip_hash)
                values (${title}, ${author}, ${olKey}, ${coverId}, ${note}, ${name}, ${ipHash})`;
    },
  };
}

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export function POST(request) {
  return handle(request, { db: database(), salt: process.env.REC_SALT || "" });
}
