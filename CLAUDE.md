# Portfolio Website — joshuamoorehead.dev

> **Status: clean-slate rebuild.** The previous bento-grid site was archived to the
> git tag `archive/bento-v1` and removed. This is a fresh, more ambitious build.
> A new session should NOT go looking for the old contracts, components, or docs —
> they are intentionally gone. Start from the design spec once it exists.

## The Vision

An **immersive 3D / WebGL portfolio** in the spirit of Bruno Simon's award-winning
site — the site itself is the experience, not a page of cards. Design direction and
interactive concepts are being handed off from a separate planning session
(Aura templates + interaction ideas). Do not lock in specifics until that handoff
lands and a design spec is written.

## Tech Stack (baseline — revisit at design time)

- **Build:** Vite 6.x
- **UI:** React 19.x (functional components + hooks only)
- **Language:** JavaScript JSX (no TypeScript, no routing — single-page)
- **3D:** Three.js via @react-three/fiber + @react-three/drei (to be installed for the rebuild)
- **Deployment:** Vercel (auto-deploys from `main`)

The old animation-library stack (GSAP, Lenis, Atropos, etc.) is still listed in
`package.json` but unused — prune/replace based on what the new design actually needs.

## Current Working State

- Branch `rebuild/immersive-3d` holds the build. `main` still points at the
  last archived state (keeps Vercel production stable until cutover).
- Studio scene chosen (Sept 2026); the diorama track was deleted. Spec in
  `docs/design-spec.md`, plan in `plan.md`, Aura exports in `docs/reference/aura/`.
- Layout: `src/lib/scroll.js` (beat timeline store) → `src/content/*` (DOM
  sections, GSAP reveals, pinned projects) → `src/scenes/studio/*` (r3f scene
  reading the store every frame). Camera keyframes are in `scroll.beat` units.
- Palette is dusk indigo (`--navy: #151d3d`), lifted from the original deep
  navy at Joshua's request.
- Pending: resume-driven content refresh and a headshot in the hero cluster.

## Workflow Rules (from global config — follow exactly)

- Do NOT start implementing until a plan is approved. Brainstorm → design spec → plan → build.
- Conventional commits (`feat:`, `fix:`, `refactor:`…). Never commit to `main` — always branch.
- Never delete or overwrite existing files without confirmation.
- Run `npm run build` after major steps to verify no build errors.
- No emoji in rendered UI. No `console.log` in production code. Handle fetch errors explicitly.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
```
