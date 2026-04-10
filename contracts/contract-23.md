## Contract 23: Final Deploy + OG Image

**Goal:** Generate an OG image, final build, push, and deploy.

**Prerequisite:** All previous contracts complete.

**Acceptance Criteria:**

- [ ] Generate OG image (1200x630px):
  - Create a static HTML page styled like a mini version of the portfolio hero
  - Screenshot it at 1200x630 and save as `public/og-image.png`
  - OR: create it manually in any image tool — dark background, "Joshua Moorehead" in DM Sans, subtitle, bento grid preview
- [ ] Update `index.html` meta tags:
  ```html
  <meta
    property="og:image"
    content="https://joshuamoorehead.dev/og-image.png"
  />
  <meta
    name="twitter:image"
    content="https://joshuamoorehead.dev/og-image.png"
  />
  ```
- [ ] Final build verification:
  - `npm run build` succeeds with zero warnings
  - Preview build locally: `npm run preview`
  - Test all features in the preview build
- [ ] Git commit and push:
  ```bash
  git add -A
  git commit -m "Portfolio complete: animation stack, 3D agent viz, visitor globe, polish"
  git push
  ```
- [ ] Vercel auto-deploys from push
- [ ] Verify live site: all features work on production URL

**What NOT to do:**

- Don't add new features
- Don't change anything — this is deploy-only
- Don't set up a custom domain (do that yourself later)

**Verify:** Visit the Vercel URL. Full scroll journey works. Share the URL on Slack/Discord — OG image preview appears. All interactive features work on production.
