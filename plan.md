# Implementation Plan — Immersive 3D Portfolio (two tracks)

Spec: `docs/design-spec.md`. Branch: `rebuild/immersive-3d`.

Two scene directions get built on one shared foundation and are switchable at
runtime (`?scene=studio` / `?scene=diorama`, plus a dev toggle). Everything
outside the `<Canvas>` is identical between them. Once a winner is picked the
other scene module is deleted — no dead code ships.

## Phase 0 — Shared foundation
1. Prune dead deps (atropos, split-type, canvas-confetti, motion,
   @motionone/utils, @studio-freight/react-lenis); keep gsap, @gsap/react, lenis.
2. Install three, @react-three/fiber, @react-three/drei; gltf-transform CLI as a
   dev tool for draco compression.
3. App shell: fixed full-viewport `<Canvas>` behind a scrolling DOM layer; Lenis
   smooth scroll wired to GSAP ScrollTrigger; a single `useScrollProgress`
   store that both scenes read (scroll position is the only source of truth).
4. Scene registry + `?scene=` switch; `SceneStudio` and `SceneDiorama` stubs.
5. Asset prep: convert the two `.exr` HDRIs to 1K `.hdr`; draco-compress the
   Renoir scan and chess pieces; matcap loader helper.
6. Verify: `npm run build` clean; both stubs render on a navy ground.

## Phase 1 — DOM layer (shared)
7. Content sections: hero copy, about, projects (Forge, Lorier, Baron
   Filtration, Marcus), timeline, contact — real content, placeholder-free.
8. Motion language: blur+slide reveals, pinned projects section, scene-dim
   behind timeline, magnetic CTA, nav underline, film-grain overlay.

## Phase 2 — Track A: Studio scene (`scenes/studio`)
9. Procedural glass block cluster (MeshTransmissionMaterial) + chrome matcap
   companion, lit by `story_studio_05` HDRI (env only, not background).
10. Shader mesh-gradient + particle backdrop (port of the Noah Vance hero-gl).
11. Camera path keyed to scroll beats; blocks disassemble/reassemble across
    stations; idle float + cursor tilt on hero.

## Phase 3 — Track B: Diorama scene (`scenes/diorama`)
12. Matcap material system: `chrome-dark` hero, `navy-matte` ground/props,
    orange matcaps for interactive/highlight objects; no lights, no HDRI.
13. Hero: Renoir scan in `chrome-dark` (chess pieces as fallback), cursor
    reactive. Stations: small stylized set pieces per project (chess pieces,
    fern/tree if converted, procedural props) on a navy ground plane.
14. Stylized edge treatment: fs_stylized_grunge_06 as subtle edge-wear/roughness
    mask on a custom matcap shader; optional toon outline pass.
15. Camera "flight" between stations keyed to the same scroll beats as Track A.

## Phase 4 — Compare & decide
16. Side-by-side walkthrough with both tracks on the same content; pick one.
17. Delete the losing scene module and its assets.

## Phase 5 — Hardening (winner only)
18. Mobile: simplified motion (no pinning, reduced particles), layout QA.
19. Performance pass (draco, texture sizes, frameloop tuning), Lighthouse check.
20. `npm run build` + preview walkthrough; only then discuss cutover of `main`.

## Working agreements
- Conventional commits on `rebuild/immersive-3d`; never touch `main`.
- Build verified after each phase before moving on.
- Reference copies of the Aura exports live in `docs/reference/aura/`.
