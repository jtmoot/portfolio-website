## Contract 0: Project Scaffold
**Goal:** Empty Vite + React project that renders "Hello World" in the browser.

**Acceptance Criteria:**
- [ ] Directory created: `~/Projects/portfolio-website/`
- [ ] `package.json` with vite, react, react-dom, @vitejs/plugin-react
- [ ] `vite.config.js` with React plugin configured
- [ ] `index.html` with root div and script tag pointing to src/main.jsx
- [ ] `src/main.jsx` — renders App into #root
- [ ] `src/App.jsx` — returns `<div>Hello World</div>`
- [ ] `src/index.css` — empty file, imported in main.jsx
- [ ] Directory structure created:
  ```
  src/
  ├── components/
  ├── hooks/
  └── utils/
  ```
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts dev server and shows "Hello World" in browser
- [ ] `npm run build` completes without errors
- [ ] `.gitignore` with node_modules, dist, .env, .DS_Store

**What NOT to do:**
- Don't use `npx create-vite` if it causes any issues — manually create the files
- Don't install any packages beyond react, react-dom, vite, @vitejs/plugin-react
- Don't add TypeScript
- Don't add any real components yet

**Verify:** `npm run dev` → browser shows "Hello World". `npm run build` → `dist/` folder created.

## Contract 1: Port the Bento Grid
**Goal:** The existing portfolio component renders exactly as it did before, inside the Vite app.

**Prerequisite:** Contract 0 is complete.

**Acceptance Criteria:**
- [ ] `portfolio.jsx` copied into `src/components/Portfolio.jsx`
- [ ] Component imports fixed for the Vite/React environment
- [ ] `App.jsx` updated to render `<Portfolio />`
- [ ] Google Fonts load correctly (DM Sans, Newsreader)
- [ ] All 9 grid sections render: profile, stats, focus, 3 projects, skills, education, research, connect
- [ ] Animated counters work (scroll into view triggers counting)
- [ ] Status badges show correct colors (Live=green, Active=blue, Building=amber)
- [ ] Skill tabs switch between categories on click
- [ ] All links work: GitHub, LinkedIn, email, Forge demo
- [ ] Responsive: 12-col grid on desktop, 2-col on tablet (<900px), 1-col on mobile (<580px)
- [ ] Pulse animation on "Live" badge works
- [ ] Hover effects on cards work (translateY lift + shadow)
- [ ] No console errors or warnings

**What NOT to do:**
- Don't extract sub-components yet (that's Contract 2)
- Don't change any colors, spacing, or layout
- Don't add dark mode yet
- Don't add any new features

**Verify:** Site looks identical to the original component. Test all 3 breakpoints. Click all interactive elements.

## Contract 2: Extract Components + CSS Variables
**Goal:** Break the monolithic Portfolio.jsx into clean separate components and replace hardcoded colors with CSS custom properties.

**Prerequisite:** Contract 1 is complete and site renders correctly.

**Acceptance Criteria:**
- [ ] Extracted: `src/components/Card.jsx` (with existing hover behavior)
- [ ] Extracted: `src/components/StatusBadge.jsx`
- [ ] Extracted: `src/components/AnimatedCounter.jsx`
- [ ] `Portfolio.jsx` imports and uses the extracted components
- [ ] `src/index.css` has CSS custom properties for all colors:
  ```css
  :root {
    --bg-primary: #f5f3f0;
    --bg-card: #ffffff;
    --bg-tag: #f5f3f0;
    --bg-dark-card: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    --text-primary: #1a1a1a;
    --text-secondary: #555;
    --text-muted: #888;
    --text-hint: #aaa;
    --text-on-dark: #ccc;
    --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
    --shadow-card-hover: 0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
  }
  ```
- [ ] All hardcoded color values in Portfolio.jsx replaced with var() references
- [ ] All hardcoded color values in Card.jsx replaced with var() references
- [ ] `body` styling moved from component `<style>` tag to index.css
- [ ] Site still renders identically to Contract 1
- [ ] No console errors or warnings

**What NOT to do:**
- Don't add dark mode variables yet (that's Contract 3)
- Don't change the layout or add new features
- Don't create CSS modules or separate CSS files per component
- Don't remove the `<style>` tag entirely — grid classes and animations stay there

**Verify:** Site looks identical to before. Inspect elements in devtools — colors come from CSS variables, not hardcoded hex values.

---

## Contract 3: Dark Mode Toggle
**Goal:** Working dark/light mode with a toggle button and smooth ripple transition.

**Prerequisite:** Contract 2 is complete with CSS variables.

**Acceptance Criteria:**
- [ ] `src/hooks/useTheme.js`:
  - React Context for theme state
  - Reads initial theme from localStorage, falls back to system preference (prefers-color-scheme)
  - Toggle function sets `data-theme` attribute on `<html>` element
  - Persists choice to localStorage
- [ ] `src/index.css` — dark mode variables added:
  ```css
  [data-theme="dark"] {
    --bg-primary: #0f0f0f;
    --bg-card: #1a1a1a;
    --bg-tag: #2a2a2a;
    --text-primary: #e8e6e1;
    --text-secondary: #aaa;
    --text-muted: #888;
    --text-hint: #666;
    --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
    --shadow-card-hover: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08);
  }
  ```
- [ ] `src/components/ThemeToggle.jsx`:
  - Fixed position button, top-right corner (top: 20px, right: 24px)
  - z-index: 1000
  - Sun icon (light mode) / Moon icon (dark mode) — inline SVG, not emoji
  - Smooth icon morph via CSS transform/opacity transition
  - On click: triggers ripple transition, then swaps theme
- [ ] Ripple transition effect:
  - A `<div>` overlay with the NEW theme's background color
  - Expands via `clip-path: circle()` from the toggle button's position
  - Animation duration: 0.5s ease-out
  - After animation completes, swap the actual theme and remove overlay
  - `@media (prefers-reduced-motion: reduce)` — skip animation, instant swap
- [ ] All text and backgrounds swap cleanly — no elements still showing light colors in dark mode
- [ ] The "Currently" card (dark gradient card) stays dark in both modes but adjusts slightly
- [ ] Status badge colors remain readable in both modes
- [ ] Tag backgrounds adjust for dark mode
- [ ] Link hover states work in both modes
- [ ] Theme persists across page reload

**What NOT to do:**
- Don't add any new sections or content
- Don't change the layout
- Don't use a CSS framework
- Don't use a third-party toggle component

**Verify:** 
1. Page loads — respects system preference
2. Click toggle — ripple expands, theme swaps
3. All text readable in both modes
4. Reload page — theme persisted
5. Test with `prefers-reduced-motion: reduce` — instant swap, no animation

## Contract 4: 3D Card Tilt on Hover
**Goal:** Cards tilt toward cursor position on hover with a subtle light reflection.

**Prerequisite:** Contract 2 is complete (Card.jsx extracted).

**Acceptance Criteria:**
- [ ] `Card.jsx` updated with tilt behavior:
  - On `mousemove`: calculate cursor position relative to card center
  - Apply `transform: perspective(800px) rotateX(Ydeg) rotateY(Xdeg)`
  - Max rotation: ±5 degrees
  - Rotation is proportional to cursor distance from center
  - `will-change: transform` applied for GPU compositing
- [ ] On `mouseleave`: smoothly return to flat (0.4s ease-out transition)
- [ ] Light reflection effect:
  - A semi-transparent radial gradient overlay that follows cursor position
  - Subtle — 5-8% opacity white gradient, visible but not distracting
  - Fades in on hover, fades out on leave
- [ ] `@media (hover: none)` — tilt disabled entirely on touch devices
- [ ] `@media (prefers-reduced-motion: reduce)` — tilt disabled
- [ ] Tilt does NOT interfere with clicking links or buttons inside cards
- [ ] Performance: no jank on 60fps displays — test with 6+ cards visible

**What NOT to do:**
- Don't add any external libraries (no tilt.js, no framer-motion)
- Don't apply tilt to the ThemeToggle button
- Don't change card layout or content

**Verify:** Hover over cards — smooth tilt toward cursor. Move cursor around card — tilt follows. Leave card — smooth return to flat. Test on mobile (no tilt). Click links inside cards — still works.

## Contract 5: GitHub Projects Section
**Goal:** A new grid section showing top GitHub repos fetched from the API.

**Prerequisite:** Contract 2 is complete.

**Acceptance Criteria:**
- [ ] `src/utils/github.js`:
  - Fetches `https://api.github.com/users/joshuamoorehead/repos?sort=pushed&per_page=10&type=owner`
  - No authentication needed (public repos only)
  - Caches response in sessionStorage with 5-minute TTL
  - Returns array of: `{ name, description, language, stargazers_count, forks_count, html_url, updated_at, topics }`
  - Handles fetch errors gracefully (returns empty array)
- [ ] `src/utils/languageColors.js`:
  - Map of language → color (Python: #3572A5, JavaScript: #f1e05a, etc.)
  - At least: Python, JavaScript, TypeScript, Jupyter Notebook, HTML, CSS, Shell, C, C++
- [ ] `src/components/GitHubProjects.jsx`:
  - Calls github.js on mount via useEffect
  - Loading state: 6 pulsing skeleton cards (gray rectangles with CSS animation)
  - Error/empty state: "Check out my repos on GitHub →" link
  - Displays top 6 repos (filter out forks if any)
  - Each repo shows:
    - Name (bold, clickable → opens repo in new tab)
    - Description (max 2 lines, overflow hidden)
    - Language dot (colored circle) + language name
    - Star icon (inline SVG) + count
    - Fork icon (inline SVG) + count
    - "Updated X days ago" — relative time, computed from updated_at
  - Inner grid: 3 columns on desktop, 2 on tablet, 1 on mobile
  - Section header: "Open Source" with same label style as other sections
  - "View all on GitHub →" link at bottom
- [ ] Added to Portfolio.jsx bento grid:
  - New CSS class `.github-card { grid-column: span 12; }`
  - Placed after the three project cards, before skills card
  - On mobile: spans full width like everything else
- [ ] GitHub card uses Card component (gets 3D tilt if Contract 4 is done)
- [ ] Works in both light and dark mode (if Contract 3 is done)

**What NOT to do:**
- Don't use GitHub GraphQL API — REST is simpler and sufficient
- Don't add pagination
- Don't add sorting/filtering UI
- Don't install any HTTP client library — use native fetch

**Verify:**
1. Page loads — skeleton shows briefly, then repos appear
2. Repo data is real (from GitHub API)
3. Click repo name → opens on GitHub
4. Disconnect internet → graceful fallback message
5. Reload within 5 min → data comes from sessionStorage (no new API call)

## Contract 6: SEO, Meta Tags, and Deploy
**Goal:** Production-ready meta tags and live deployment on Vercel via GitHub.

**Prerequisite:** Contracts 0-5 complete (or at minimum 0-2).

**Acceptance Criteria:**
- [ ] `index.html` updated with:
  ```html
  <title>Joshua Moorehead — ML Infrastructure & Agent Engineering</title>
  <meta name="description" content="ML Infrastructure Engineer & Agent Systems Builder. Carnegie Mellon MS ECE.">
  <meta property="og:title" content="Joshua Moorehead — ML Infrastructure & Agent Engineering">
  <meta property="og:description" content="Portfolio — ML systems, agent architectures, and infrastructure.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  ```
- [ ] `public/favicon.svg` — simple "JM" monogram in SVG (dark text on transparent)
- [ ] Git repository initialized:
  ```bash
  git init
  git add -A
  git commit -m "Phase 1: portfolio foundation"
  ```
- [ ] Pushed to GitHub:
  ```bash
  gh repo create portfolio-website --public --push --source .
  ```
- [ ] Vercel deployment instructions provided:
  - Framework preset: Vite
  - Build command: `npm run build`
  - Output directory: `dist`
- [ ] Site loads on Vercel URL without errors
- [ ] All features work on the deployed version

**What NOT to do:**
- Don't set up a custom domain yet
- Don't add analytics
- Don't add a sitemap or robots.txt
- Don't modify any components

**Verify:** Visit the Vercel URL — full site loads, all features work, meta tags visible in page source.
