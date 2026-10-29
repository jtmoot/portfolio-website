/** What he says when he waves: "Hello, Pittsburgh!", or "Hello there!" when the city is unknown. */
export const greetingFor = (city) => (city ? `Hello, ${city}!` : "Hello there!");

/** A city name we are happy to print: letters, spaces and a little punctuation, under 40 characters. */
export function cleanCity(raw) {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s || s.length > 40 || !/^[\p{L}][\p{L} .'’-]*$/u.test(s)) return null;
  return s;
}

/** The city in an IANA time zone name ("America/New_York" is New York); null for UTC and offsets. */
export function cityFromTimeZone(tz) {
  if (typeof tz !== "string" || !tz.includes("/") || tz.startsWith("Etc/")) return null;
  return cleanCity(tz.split("/").at(-1).replace(/_/g, " "));
}

/**
 * The greeting, from the site's /api/hello (the city Vercel sees), else the browser's time zone.
 * @param {{ fetch?: typeof fetch, timeZone?: string, timeoutMs?: number }} [o]
 * @returns {Promise<string>}
 */
export async function loadGreeting({ fetch: get = globalThis.fetch, timeZone, timeoutMs = 1500 } = {}) {
  const tz = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  let city = null;
  if (typeof get === "function") {
    const ctl = typeof AbortController === "function" ? new AbortController() : null;
    const timer = setTimeout(() => ctl?.abort(), timeoutMs);
    try {
      const res = await get("/api/hello", { signal: ctl?.signal, headers: { accept: "application/json" } });
      if (res.ok) city = cleanCity((await res.json())?.city);
    } catch {
      // Offline, blocked, timed out, or no endpoint (local dev): use the time zone instead.
    } finally {
      clearTimeout(timer);
    }
  }
  return greetingFor(city ?? cityFromTimeZone(tz));
}
