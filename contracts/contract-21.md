## Contract 21: Visitor Globe Backend (Cloudflare)

**Goal:** Cloudflare Worker + D1 database logging visitor country data.

**Note:** This is a Cloudflare/Wrangler task, not a Claude Code contract. Do this manually.

**Acceptance Criteria:**

- [ ] D1 database: `portfolio-analytics`
- [ ] Table: `visits (id INTEGER PRIMARY KEY AUTOINCREMENT, country TEXT, visited_at TEXT DEFAULT CURRENT_TIMESTAMP)`
- [ ] Worker: `portfolio-visitor-log`
  - `POST /api/visit` — reads `cf-ipcountry` header, inserts row
  - `GET /api/visits/countries` — returns `[{country: "US", count: 42}, ...]`
  - CORS headers allowing your Vercel domain
  - No PII — only country codes
- [ ] Worker deployed and accessible

**What NOT to do:**

- Don't store IPs
- Don't add authentication
- Don't add rate limiting (fire-and-forget)

**Verify:** `curl -X POST <worker-url>/api/visit` → 200. `GET /api/visits/countries` → JSON array.
