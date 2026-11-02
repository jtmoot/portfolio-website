# Portfolio Website — joshuamoorehead.dev

> **Status: personal-pad rebuild.** The bento site is archived at tag `archive/bento-v1`;
> the r3f studio direction (Sept 2026) is dead and archived in `docs/archive/`.

## The Vision

A personal notepad page modeled closely on garvitsingla.in: dotted pad paper, Geist Mono
body, Gloria Hallelujah for the name and section titles, halftone stickers in the left
margin, posters on the right, hover screenshot previews, moving project cards, Experience
before Work. One signature moment, "creative mode": the pad falls flat into an isometric
floor and the margin objects become detailed isometric SVG illustrations of Joshua's real
rooms, with a walkable drawn figure. Never a three.js or game-engine look.

- Spec: `docs/superpowers/specs/2026-10-28-personal-pad-design.md`
- Plan: `docs/superpowers/plans/2026-10-28-personal-pad.md`
- Reference mockups: `docs/superpowers/reference/pad-mockups/`

## Tech Stack

- **Build:** Vite 6.x
- **UI:** React 19.x (functional components + hooks only), JSX, no TypeScript, no routing
- **Motion:** CSS transitions and transforms, `requestAnimationFrame`; no animation libraries
- **Tests:** Vitest + jsdom (`tests/` mirrors `src/`)
- **Deployment:** Vercel (auto-deploys from `main`)

## Current Working State

- Branch `rebuild/personal-pad` holds the build. `main` still points at the archived
  bento site (keeps Vercel production stable until cutover).
- Project media (mp4, webm, poster jpg) lives in `public/media/`; featured order is in
  `docs/project-rankings.md`.

## Workflow Rules (from global config — follow exactly)

- Do NOT start implementing until a plan is approved. Brainstorm → design spec → plan → build.
- Conventional commits (`feat:`, `fix:`, `refactor:`…). Never commit to `main` — always branch.
- Never delete or overwrite existing files without confirmation.
- Run `npm run build` after major steps to verify no build errors.
- No emoji in rendered UI. No `console.log` in production code. Handle fetch errors explicitly.

## Commands

```bash
npm test           # Vitest unit tests
npm run dev        # Vite dev server at http://localhost:5173
                   # also serves api/*.js (DEV_CITY sets the greeting's city);
                   # `doppler run -- npm run dev` gives /api/recommend the dev database
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
```
