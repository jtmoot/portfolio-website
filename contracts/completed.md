# Completed Contracts (0–8)

These contracts are done. Kept here for reference only.

---

## Contract 0: Project Scaffold

**Goal:** Empty Vite + React project that renders "Hello World" in the browser.

**Acceptance Criteria:**

- [x] Directory created: `~/Projects/portfolio-website/`
- [x] `package.json` with vite, react, react-dom, @vitejs/plugin-react
- [x] `vite.config.js` with React plugin configured
- [x] `index.html` with root div and script tag pointing to src/main.jsx
- [x] `src/main.jsx` — renders App into #root
- [x] `src/App.jsx` — returns `<div>Hello World</div>`
- [x] `src/index.css` — empty file, imported in main.jsx
- [x] Directory structure created:
  ```
  src/
  ├── components/
  ├── hooks/
  └── utils/
  ```
- [x] `npm install` completes without errors
- [x] `npm run dev` starts dev server and shows "Hello World" in browser
- [x] `npm run build` completes without errors
- [x] `.gitignore` with node_modules, dist, .env, .DS_Store

---

## Contract 1: Port the Bento Grid

**Goal:** The existing portfolio component renders exactly as it did before, inside the Vite app.

**Acceptance Criteria:**

- [x] `portfolio.jsx` copied into `src/components/Portfolio.jsx`
- [x] Component imports fixed for the Vite/React environment
- [x] `App.jsx` updated to render `<Portfolio />`
- [x] Google Fonts load correctly (DM Sans, Newsreader)
- [x] All 9 grid sections render: profile, stats, focus, 3 projects, skills, education, research, connect
- [x] Animated counters work (scroll into view triggers counting)
- [x] Status badges show correct colors (Live=green, Active=blue, Building=amber)
- [x] Skill tabs switch between categories on click
- [x] All links work: GitHub, LinkedIn, email, Forge demo
- [x] Responsive: 12-col grid on desktop, 2-col on tablet (<900px), 1-col on mobile (<580px)
- [x] Pulse animation on "Live" badge works
- [x] Hover effects on cards work (translateY lift + shadow)
- [x] No console errors or warnings

---

## Contract 2: Extract Components + CSS Variables

**Goal:** Break the monolithic Portfolio.jsx into clean separate components and replace hardcoded colors with CSS custom properties.

**Acceptance Criteria:**

- [x] Extracted: `src/components/Card.jsx` (with existing hover behavior)
- [x] Extracted: `src/components/StatusBadge.jsx`
- [x] Extracted: `src/components/AnimatedCounter.jsx`
- [x] `Portfolio.jsx` imports and uses the extracted components
- [x] `src/index.css` has CSS custom properties for all colors
- [x] All hardcoded color values in Portfolio.jsx replaced with var() references
- [x] All hardcoded color values in Card.jsx replaced with var() references
- [x] `body` styling moved from component `<style>` tag to index.css
- [x] Site still renders identically to Contract 1
- [x] No console errors or warnings

---

## Contract 3: Dark Mode Toggle

**Goal:** Working dark/light mode with a toggle button and smooth ripple transition.

**Acceptance Criteria:**

- [x] `src/hooks/useTheme.js` — React Context, localStorage, system preference, data-theme attribute
- [x] `src/index.css` — dark mode variables added
- [x] `src/components/ThemeToggle.jsx` — fixed position, SVG icons, ripple transition
- [x] Ripple transition effect via clip-path circle expansion
- [x] `@media (prefers-reduced-motion: reduce)` — instant swap
- [x] All text and backgrounds swap cleanly
- [x] Theme persists across page reload

---

## Contract 4: 3D Card Tilt on Hover

**Goal:** Cards tilt toward cursor position on hover with a subtle light reflection.

**Acceptance Criteria:**

- [x] `Card.jsx` updated with perspective(800px), ±5deg rotation, glare overlay
- [x] On mouseleave: smooth return to flat (0.4s ease-out)
- [x] `@media (hover: none)` — tilt disabled on touch devices
- [x] `@media (prefers-reduced-motion: reduce)` — tilt disabled
- [x] Tilt does NOT interfere with clicking links or buttons
- [x] Performance: no jank on 60fps displays

---

## Contract 5: GitHub Projects Section

**Goal:** A new grid section showing top GitHub repos fetched from the API.

**Acceptance Criteria:**

- [x] `src/utils/github.js` — fetch, cache (5min TTL), error handling
- [x] `src/utils/languageColors.js` — language color map
- [x] `src/components/GitHubProjects.jsx` — skeleton loading, error state, repo cards
- [x] Added to Portfolio.jsx bento grid (span 12)
- [x] Works in both light and dark mode

---

## Contract 6: SEO, Meta Tags, and Deploy

**Goal:** Production-ready meta tags and live deployment on Vercel via GitHub.

**Acceptance Criteria:**

- [x] `index.html` updated with meta tags
- [x] `public/favicon.svg` — JM monogram
- [x] Git repository initialized and pushed to GitHub
- [x] Vercel deployment configured

**Known gap:** `public/og-image.png` not yet created (deferred to Contract 23).

---

## Contract 7: Terminal Boot Sequence

**Goal:** Site loads with a terminal-style boot animation before revealing the portfolio.

**Acceptance Criteria:**

- [x] `src/components/BootSequence.jsx` — full-screen terminal, typed lines, progress bars
- [x] `src/components/EntranceReveal.jsx` — vertical split door reveal
- [x] `App.jsx` — booting → revealing → ready state machine
- [x] Skip: click, sessionStorage, prefers-reduced-motion
- [x] Portfolio renders behind with visibility: hidden
- [x] No layout shift on unmount

---

## Contract 8: Scroll-Triggered Card Entrances

**Goal:** Each bento card animates in when scrolled into view.

**Acceptance Criteria:**

- [x] `src/hooks/useScrollReveal.js` — IntersectionObserver wrapper
- [x] `src/components/ScrollReveal.jsx` — directional entrance component
- [x] Staggered timing, directional offsets (left/right/bottom)
- [x] `@media (prefers-reduced-motion: reduce)` — all visible immediately
- [x] Animations trigger once only
- [x] No horizontal scrollbar from off-screen positions
