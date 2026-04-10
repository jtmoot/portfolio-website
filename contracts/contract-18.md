## Contract 18: Forge Live Status Ping

**Goal:** The Forge project card's "Live" badge pings the real deployment.

**Prerequisite:** Forge deployed on Railway.

**Acceptance Criteria:**

- [ ] `src/utils/forgeStatus.js`:
  - Pings `https://forgelab.up.railway.app/health` (or current URL)
  - Timeout: 5 seconds, one retry on failure
  - Returns: `{ isUp: boolean, latencyMs: number }`
  - Caches result for 60 seconds in sessionStorage
- [ ] StatusBadge.jsx updated for Forge card:
  - On mount: fetches status async
  - While loading: "Checking..." gray badge
  - If up: "Live · 142ms" green badge with pulse
  - If down: "Offline" red badge, no pulse
- [ ] Does not block page render — async update after mount
- [ ] Other project badges unaffected

**What NOT to do:**

- Don't ping on every re-render — respect the 60s cache
- Don't add uptime history
- Don't modify the Forge backend

**Verify:** Load page → Forge shows "Checking..." → updates to "Live · Xms" or "Offline." Network tab shows one health check. Cached on reload within 60s.
