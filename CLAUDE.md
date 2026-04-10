# Portfolio Website — joshuamoorehead.dev

## First Things First (Read This After Every Compaction)

1. Re-read this file (CLAUDE.md)
2. Read the relevant contract from `contracts/` directory (e.g. `contracts/contract-09.md`)
3. Re-read any files you're about to modify before editing them
4. If you don't have a task plan yet, create one and show me before coding

## Contracts

- `contracts/completed.md` — Contracts 0–8 (done, reference only)
- `contracts/contract-09.md` through `contracts/contract-23.md` — one file per contract

## Project Overview

Personal portfolio for Joshua Moorehead — ML Infrastructure & Agent Engineering. Bento-grid layout with interactive animations, 3D elements, scroll-driven effects, and live data integrations. Single-page app, no routing.

## Tech Stack

- **Build:** Vite 6.x
- **UI:** React 19.x (functional components + hooks, no class components)
- **Styling:** CSS custom properties + inline styles (no Tailwind, no CSS-in-JS, no CSS modules)
- **Fonts:** Google Fonts (DM Sans, Newsreader) loaded via @import in component style tag
- **Deployment:** Vercel (auto-deploys from GitHub main branch)
- **Language:** JavaScript JSX (no TypeScript)

### Animation Libraries (installed in Contract 10+)

- **GSAP + ScrollTrigger** — scroll-driven animations, pinning, timelines. Always use `useGSAP()` hook from `@gsap/react` for cleanup.
- **Lenis** — smooth scrolling foundation. Integrated with GSAP ticker in `src/lib/lenis.js`.
- **Motion (Framer Motion)** — declarative React animations. Use for `whileInView`, springs, layout animations.
- **Atropos** — 3D parallax tilt on cards. Use `data-atropos-offset` for depth layers. Import CSS: `import 'atropos/css'`.
- **SplitType** — text splitting for character-level animations. Pair with GSAP stagger.
- **canvas-confetti** — celebratory confetti on CTA clicks. Fire-and-forget.

### 3D Libraries (installed in Contract 16+)

- **three** — 3D engine (peer dependency of R3F)
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — helper components (Float, OrbitControls, Html, useDetectGPU)

## Project Structure

```
portfolio-website/
├── CLAUDE.md                    # This file
├── TASK_CONTRACT.md             # Current contract (swap per session)
├── index.html                   # Entry HTML with meta tags + OG data
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg              # JM monogram
│   └── og-image.png             # Open Graph preview image
├── src/
│   ├── main.jsx                 # React entry — wraps App with LenisProvider
│   ├── App.jsx                  # Root component — entrance + Portfolio
│   ├── index.css                # Global styles, CSS variables, dark/light themes
│   ├── components/
│   │   ├── Portfolio.jsx        # Main bento grid layout
│   │   ├── Card.jsx             # Card with Atropos 3D tilt
│   │   ├── StatusBadge.jsx      # Live/Active/Building badges
│   │   ├── AnimatedCounter.jsx  # Scroll-triggered number counting
│   │   ├── ThemeToggle.jsx      # Dark/light toggle with ripple
│   │   ├── GitHubProjects.jsx   # Fetches + displays top repos
│   │   ├── CareerTimeline.jsx   # Scroll-scrubbed SVG timeline
│   │   ├── ProjectGallery.jsx   # Horizontal pinned scroll gallery
│   │   ├── MagneticButton.jsx   # Cursor-attracted CTA buttons
│   │   ├── Terminal.jsx         # Hidden CLI easter egg (backtick)
│   │   ├── AgentSwarm3D.jsx     # R3F 3D agent node graph (lazy-loaded)
│   │   ├── CommitHeatmap.jsx    # GitHub contribution grid
│   │   ├── Bookshelf.jsx        # Interactive book spine library
│   │   ├── VisitorGlobe.jsx     # R3F 3D globe (lazy-loaded)
│   │   └── EntranceAnimation.jsx # Name dance + assembly on load
│   ├── hooks/
│   │   └── useTheme.js          # Theme context + localStorage + system preference
│   ├── lib/
│   │   ├── gsap.js              # GSAP + ScrollTrigger registration
│   │   └── lenis.js             # LenisProvider + GSAP ticker sync
│   ├── utils/
│   │   ├── github.js            # GitHub REST API helpers + sessionStorage cache
│   │   ├── languageColors.js    # GitHub language → color map
│   │   └── forgeStatus.js       # Forge health check + cache
│   └── data/
│       └── books.js             # Book library data array
```

## Design Requirements

- Clean, minimal, engineering-focused aesthetic
- Bento grid layout: 12-col desktop, 2-col tablet (<900px), 1-col mobile (<580px)
- Dark mode support with CSS custom properties and ripple transition
- All colors via `var(--*)` — never hardcode hex in components
- Fonts: DM Sans (body), Newsreader (italic accents)
- Target: < 2s LCP, Lighthouse Performance > 85
- All animations respect `prefers-reduced-motion`
- All 3D content lazy-loaded with static fallbacks
- Film grain overlay at 0.03 opacity (CSS only, zero JS cost)

## CSS Variable Convention

All colors defined in `src/index.css`. Components use `var()` references only.

```css
:root { --bg-primary, --bg-card, --bg-tag, --text-primary, --text-secondary, --text-muted, --text-hint, --shadow-card, --shadow-card-hover }
[data-theme="dark"] { /* dark variants of all above */ }
```

## Current State

**Completed:** Contracts 0–9 (scaffold, bento grid, components extracted, CSS variables, dark mode with ripple, 3D card tilt, GitHub projects, SEO + Vercel deploy, scroll-triggered card entrances, career timeline)

**Next up:** Contract 10 (install animation library stack)

**Known issues:** Update this section as you encounter and fix issues.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
```

## Task Flow (Follow This Every Time)

1. Read TASK_CONTRACT.md — understand what needs to be built
2. Create a step-by-step plan and show it to me — do NOT start coding until I approve
3. Implement in small increments, testing after each one
4. Run `npm run build` after each major step to verify no build errors
5. Open http://localhost:5173 in Chrome to visually verify (if Chrome extension connected)
6. Go through every acceptance criteria checkbox in the contract
7. Do NOT mark the task as complete until ALL checkboxes pass

## Architecture Rules

- All React components go in `src/components/`
- All custom hooks go in `src/hooks/`
- All utility/helper functions go in `src/utils/`
- All static data arrays go in `src/data/`
- Library setup files go in `src/lib/`
- Global styles and CSS variables go in `src/index.css`
- Component-specific styles use inline styles (matching existing pattern)

## Coding Rules

- Functional components with hooks only — no class components
- Never implement stubs, placeholders, or TODO functions — every function must have real logic
- Never use `pass` or empty function bodies in production code
- Use descriptive variable names — no single-letter variables except loop counters
- Handle errors explicitly — fetch calls need try/catch with fallback UI
- Use semantic HTML where appropriate (section, nav, main, footer)
- All interactive elements need keyboard accessibility
- All images need alt text
- Never use emoji in rendered UI — use inline SVG icons instead
- No `console.log` in production code
- Import order: React → third-party libraries → local components → local utils → CSS

## Scaffolding Rules (CRITICAL)

- DO NOT use `npx create-next-app`, `npx create-react-app`, or any scaffolding CLI
- DO NOT use Next.js for anything — this is a Vite + React project
- If a directory already exists, DO NOT delete it and recreate — work with what's there
- If a command fails, STOP and report the error. Do NOT retry in /tmp or another directory
- If `npm install` fails, troubleshoot the specific error — do not wipe node_modules and start over unless necessary

## Animation Rules

- GSAP ScrollTrigger instances MUST be created inside `useGSAP()` hook for automatic cleanup
- Lenis MUST stay synced with GSAP ticker (configured in `src/lib/lenis.js`)
- React Three Fiber components MUST be wrapped in `React.lazy()` + `<Suspense fallback={...}>`
- R3F canvases MUST pause rendering when not in viewport (use `frameloop="demand"` or intersection observer)
- ALL animations MUST check `prefers-reduced-motion` — provide instant/static fallback
- `@media (hover: none)` — disable hover-dependent effects on touch devices
- Keep particle counts and polygon counts low — performance over flashiness
- Use `will-change: transform` sparingly — only on elements that actually animate frequently

## Performance Rules

- Lazy-load all 3D content (AgentSwarm3D, VisitorGlobe) — never in the initial bundle
- Use `useDetectGPU` from Drei — serve SVG/static fallback on low-end devices
- Cache API responses in sessionStorage with TTL (GitHub: 5min, Forge status: 60s)
- Images: use SVG where possible, compress PNGs, no unoptimized images
- No render-blocking resources — fonts loaded async via @import in component style tag
- Target bundle: core animation stack < 100KB gzipped, 3D libraries loaded on demand

## What NOT To Do

- Don't install packages not listed in the current contract
- Don't add features not specified in the current contract
- Don't refactor working code unless the current contract asks for it
- Don't add TypeScript — plain JSX
- Don't add routing — this is a single-page app
- Don't add a backend or serverless functions (except the Cloudflare Worker for visitor tracking)
- Don't use a CSS framework (no Tailwind, no Bootstrap, no styled-components)
- Don't add authentication
- Don't over-engineer — working and polished beats clever and complex

## File Naming Conventions

- Components: PascalCase.jsx (e.g., StatusBadge.jsx, AgentSwarm3D.jsx)
- Hooks: camelCase.js starting with "use" (e.g., useTheme.js)
- Utilities: camelCase.js (e.g., github.js, forgeStatus.js)
- Data files: camelCase.js (e.g., books.js)
- Library setup: camelCase.js (e.g., gsap.js, lenis.js)

## Browser Verification

After implementing visual changes, use Chrome to verify at http://localhost:5173:

- Check both light and dark mode
- Check mobile viewport (375px width) for responsive layouts
- Check `prefers-reduced-motion` behavior where applicable
- Check console for errors or warnings
- Check Network tab for unnecessary API calls or large bundles

## When Confused

- Re-read TASK_CONTRACT.md for acceptance criteria
- Re-read this CLAUDE.md for conventions
- Look at existing components for patterns to follow
- Ask me — don't guess or assume
