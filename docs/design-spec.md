# Design Spec — Immersive 3D Portfolio (v1)

Source material: two Aura exports (`Noah-Vance-Generative-Design.zip`,
`AURA-VR-Game-Agency.zip` in ~/Downloads) + site analysis session (2026-09-04).
This is the design contract for the immersive build. A second, simpler
component/motion-library version will be built separately later — nothing here
should assume it.

## Concept

One continuous scroll journey. The site behaves like a scroll-scrubbed film:
a full-viewport 3D scene is pinned behind the content, and scrolling drives
the "playhead" — camera moves, objects assemble/disassemble, lighting shifts.
Content sections (about, projects, contact) are beats in that timeline, not
separate pages. This is the "scrolling makes a video" effect, implemented as a
real-time r3f scene scrubbed by scroll rather than a pre-rendered video —
sharper, lighter, and it can react to the cursor.

## Two scene tracks (both built, one ships)

The scroll structure, content, palette and motion language below are shared.
Only what lives inside the `<Canvas>` differs:

**Track A — Studio.** Glass & chrome. Procedural rounded-box cluster with
transmission (glass) material + a chrome-matcap companion, lit by a real
studio HDRI (environment only, never visible). Shader mesh-gradient and
particle backdrop ported from the Noah Vance export. Reads as polished,
technical, "2026 agency."

**Track B — Diorama.** Stylized, matcap-shaded. No lights, no HDRI — every
surface's look comes from one matcap image (chrome-dark hero, navy-matte
ground and props, orange matcaps for interactive/highlight pieces). Hero object
is the Renoir *La Lecture* photogrammetry scan (chess pieces as fallback);
project stations are small stylized set pieces on a navy ground plane the
camera flies between. FreeStylized grunge masks add painterly edge-wear via a
custom matcap shader. Reads as distinctive, hand-made, quietly playful.

Recommendation going in: B with the A-style hero treatment. Decision is made
after both run on the same content (plan Phase 4).

## Aesthetic (from Noah Vance template)

- **Palette:** deep navy ground `#050a1c` / `#0a1128`, warm orange accents
  (Tailwind orange-200/300/400), cool blue-white particle tones. High contrast,
  dark-only — no light mode for v1.
- **Type:** large editorial serif or grotesk display for headings, quiet
  sans for body. Hero text staggers in with blur+slide (`blur(12px) → 0`).
- **Texture:** shader mesh-gradient glow + particle field (the Noah Vance
  hero-gl approach), film grain overlay, thin 1px hairline borders.
- **No emoji, no clip-art.** Everything either typography, shader, or 3D.

## Scene & scroll structure (beats)

1. **Boot / hero** — camera close on the hero object (glb or procedural
   glass/chrome block cluster). Name + one-liner staggers in. Idle float +
   cursor-reactive tilt (Noah Vance torus behavior).
2. **About** — camera pulls back; blocks orbit into a loose constellation.
   Short bio, CMU ECE MS, ML + data infra focus.
3. **Projects** — pinned section; each scroll beat swings the camera to a new
   "station": Forge, Lorier restock monitor, Baron Filtration, Marcus.
   Each station = one 3D vignette + a card with stack, links, one-line proof.
4. **Work / timeline** — condensed career/education timeline, content-first,
   scene dims to 15% opacity behind it (Noah Vance hero-fade pattern).
5. **Contact / CTA** — camera returns to hero object reassembled; magnetic
   button microinteraction; GitHub / LinkedIn / email links.

## Motion language (lifted from the Aura exports)

- ScrollTrigger-style scrub with `scrub: 0.8–1.2` feel — slightly lagged,
  never 1:1 janky.
- Reveals: `opacity 0→1, y 40–80→0, blur 10px→0`, stagger 0.12–0.15,
  power3.out.
- One pinned storytelling section (`pin: true`, +120% duration).
- Microinteractions: magnetic CTA button (elastic return), nav underline
  scale-x on hover, cursor-parallax on the hero object (±10° rotation).
- Idle: hero object floats ±14px on a 3.2s sine loop.

## Tech decisions

- **r3f + drei + three** (to install) for the scene; `<ScrollControls>` or
  GSAP ScrollTrigger driving a timeline that the scene reads — decide in
  implementation, but scroll position is the single source of truth.
- **GSAP + ScrollTrigger** (already installed) for DOM reveals; **Lenis**
  (already installed) for smooth scroll.
- Prune unused deps (atropos, split-type, canvas-confetti, motion,
  @motionone/utils) once the build stands.
- DPR clamped to 2, particle counts tuned, `frameloop="demand"` where
  possible. Static fallback (poster + content) if WebGL unavailable.

## Assets (in repo, `public/assets/`)

- `hdri/` — `story_studio_05_2k.exr`, `ferndale_studio_11_2k.exr` (Poly
  Haven). Converted to 1K `.hdr` in Phase 0. Track A only.
- `matcaps/` — 15 curated 512px matcaps from nidorx/matcaps, named by look
  (chrome-*, black-*, navy-matte, blue-glass, orange-*, amber-glass, clay,
  silver, grey). Both tracks; Track B's entire material system.
- `models/` — `chess_pieces.glb`, Renoir *La Lecture* scan. Draco-compressed
  in Phase 0. Boston fern (FBX) and volcano/tree packs stay in ~/Downloads
  unless a station needs them (convert + decimate on demand).
- FreeStylized masks (`fs_stylized_grunge_06`, `fs_stylized_brush_13`) are
  16-bit grayscale; downsampled to 1K 8-bit for the Track B edge-wear shader.

## Non-goals for v1

- No CMS, no blog, no light mode, no routing.
- No pre-rendered video scrubbing (the r3f scene *is* the video).
- Mobile gets the full content and simplified motion (no pinned scenes,
  reduced particles) — not a separate design.
