/** What he says when he waves: "Hello, Pittsburgh!", or "Hello there!" when the city is unknown. */
export const greetingFor = (city) => (city ? `Hello, ${city}!` : "Hello there!");

/** A city name we are happy to print: letters, spaces and a little punctuation, under 40 characters. */
export function cleanCity(raw) {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s || s.length > 40 || !/^[\p{L}][\p{L} .'’-]*$/u.test(s)) return null;
  return s;
}

/**
 * The greeting, from the site's /api/hello (the city Vercel sees), else "Hello there!". There is
 * no time-zone guess: a zone names its region's biggest city (Pittsburgh is America/New_York).
 * @param {{ fetch?: typeof fetch, timeoutMs?: number }} [o]
 * @returns {Promise<string>}
 */
export async function loadGreeting({ fetch: get = globalThis.fetch, timeoutMs = 1500 } = {}) {
  let city = null;
  if (typeof get === "function") {
    const ctl = typeof AbortController === "function" ? new AbortController() : null;
    const timer = setTimeout(() => ctl?.abort(), timeoutMs);
    try {
      const res = await get("/api/hello", { signal: ctl?.signal, headers: { accept: "application/json" } });
      if (res.ok) city = cleanCity((await res.json())?.city);
    } catch {
      // Offline, blocked, timed out, or no endpoint (local dev): a plain hello.
    } finally {
      clearTimeout(timer);
    }
  }
  return greetingFor(city);
}
