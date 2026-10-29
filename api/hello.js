/**
 * GET /api/hello: the visitor's city, from the header Vercel adds to every request
 * (x-vercel-ip-city, URL-encoded). Only the city name leaves this function; nothing is stored,
 * logged or sent anywhere else, and the answer is never cached.
 * @param {Request} request
 * @returns {Response}
 */
export function GET(request) {
  const raw = request.headers.get("x-vercel-ip-city");
  let city = null;
  if (raw) {
    try {
      city = decodeURIComponent(raw);
    } catch {
      city = null;
    }
  }
  return Response.json({ city }, { headers: { "cache-control": "private, no-store" } });
}
