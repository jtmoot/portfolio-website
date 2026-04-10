## Contract 17: GitHub Commit Heatmap

**Goal:** A contribution heatmap showing real commit activity.

**Prerequisite:** Contract 5 complete (GitHub API utility exists).

**Acceptance Criteria:**

- [ ] `src/utils/github.js` — add `fetchCommitActivity()`:
  - Fetches recent commits from top 5 repos:
    `GET /repos/joshuamoorehead/{repo}/commits?since={90_days_ago}&per_page=100`
  - Aggregates: count commits per day for last 90 days
  - Caches in sessionStorage with 5-minute TTL
  - Returns: `{ [dateString]: commitCount }` map
- [ ] `src/components/CommitHeatmap.jsx`:
  - Grid of small rounded squares: 13 columns × 7 rows (~90 days)
  - Color intensity: 0=empty(--bg-tag), 1-2=light, 3-4=medium, 5+=dark green
  - Dark mode: green scale adjusts for dark backgrounds
  - Hover a square → tooltip: "3 commits on Mar 15, 2026"
  - Total count below: "142 contributions in the last 90 days"
  - Loading state: skeleton grid with pulsing animation
  - Error state: "View my GitHub →" link
- [ ] Grid placement: replaces or augments the stats card (span 4)
- [ ] Section label: "Activity"

**What NOT to do:**

- Don't use GitHub GraphQL API
- Don't show more than 90 days
- Don't add date range selection

**Verify:** Heatmap renders with real data. Hover squares — tooltips work. Dark mode — colors visible. API failure — graceful fallback.
