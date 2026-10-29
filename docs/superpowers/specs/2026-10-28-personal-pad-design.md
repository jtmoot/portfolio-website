# Design: the personal pad, with a creative mode that becomes an isometric room

Date: 2026-10-28. Branch: `rebuild/immersive-3d` (rename to `rebuild/personal-pad` is the builder's call).
Supersedes `docs/design-spec.md` and `plan.md` (the studio / r3f scroll-film direction). Those two files are
kept until Joshua says to archive them. Nothing in `src/scenes/` survives this design.

Reference mockups, committed in `docs/superpowers/reference/pad-mockups/`: `direction-v9.html` is the quiet
page with the measured proportions, `direction-v13.html` is the creative-mode motion, with the images they
load and two screenshots of the agreed look (`v9-pad.jpg`, `v13-landed-c.jpg`). Open them with any static
server from that folder. They are throwaway spikes: copy the measurements, the sticker pipeline, the iso helper,
the traveler maths and the flip CSS from them freely, but rebuild them as real components.

## 1. Intent

Joshua's portfolio should read as a person's notepad, not as a generated site. The model is
garvitsingla.in: a sheet of dotted pad paper in the middle, a mono body typeface, his handwriting face for
the name and section titles, halftone object stickers in the left margin, posters in the right margin, small
screenshot previews when you hover a link, and project cards that move. Joshua wants that recipe copied
closely, in his own proportions, with his own objects, content and photo, and pitched slightly more serious
and leader-focused than Garvit's.

On top of that sits one signature moment, "creative mode". Click it and the paper tips over and lies flat as
an isometric floor, the margin stickers and posters slide onto it, and everything becomes hairline isometric
line drawings of Joshua's real rooms: his desk, his library, his plants, his gym, his kitchen, a chess table,
a corkboard, an anatomy chart. A small drawn Joshua walks around and the visitor can take the controls.
It must look like isometric illustration, never like a 3D engine.

Why: recruiters and collaborators should get a sense of a thoughtful person with a life, in under a minute,
and remember one thing (the paper falling into a room). Why now: the old bento site is archived and the r3f
studio direction was rejected as generic.

## 2. Goals, non-goals, anti-goals

Goals
- A quiet page that a designer would believe was hand-made. Garvit's layout proportions, Joshua's content.
- One continuous creative-mode motion, about 1.5 s, reversible, that works on a phone.
- Isometric drawings that are detailed and specific to Joshua's actual things (section 6).
- A walkable figure of Joshua with keyboard and tap controls, wandering on its own when idle.
- Experience before Work. Company logos per job. Hover previews on links and experience rows.
- Ship from `main` on Vercel after cutover, replacing the archived bento site.

Non-goals
- No blog, no CMS, no routing, no dark-pattern analytics. Single page.
- No pixel-perfect clone of Garvit's copy or assets. His structure, our everything else.

Anti-goals (a failure even if it works)
- Anything that looks like a game engine: lit low-poly meshes, a perspective camera, GLB models, a
  three.js room. The user called that "3d garbage" twice. Creative mode is CSS 3D transforms plus SVG
  illustration. Shading, soft shadows, gradients and WebGL or canvas shader effects inside a drawing (steam,
  glow, heat haze) are welcome when they make the illustration better; they must read as illustration, like
  the anatomy skill's gallery (its Raptor engine test stand is the quality bar), not as a scene.
- Typefaces or layout that read as "AI coded" (Architects Daughter, Inter, cream + terracotta, card kits).
- Generic drawings. A desk that is any desk fails. Each station must contain the specific items in section 6.
- Emoji in the UI. `console.log` in shipped code. A page that needs a download or a loading bar.

## 3. Constraints

- Stack: Vite 6, React 19, JSX, no TypeScript. Keep `react`, `react-dom`, `vite`, `@vitejs/plugin-react`.
  Remove `three`, `@react-three/fiber`, `@react-three/drei`, `@gltf-transform/cli`. GSAP and Lenis are
  removed unless the builder finds a concrete need (the mockups use only CSS transitions and
  `requestAnimationFrame`). My call: remove them.
- Deployment: Vercel from `main`. `main` is not touched until cutover is approved.
- Fonts: Gloria Hallelujah (Google Fonts) for the name, section titles and creative-mode labels. Geist Mono
  (self-hosted woff2, from the Vercel Geist release) for everything else. No third face.
- Repo rules: conventional commits, branch per feature, never delete or overwrite existing files without
  confirmation, `npm run build` after major steps, no emoji, no `console.log`.
- Secrets: none expected. If any appear (analytics key), Doppler per the global rule.
- Budget: Joshua wants to preserve his Fable allowance. The build and the drawing loop are to be done by a
  cheaper model (Opus 5.5) following the plan; Fable reviews afterwards.

## 4. The quiet page

### 4.1 Geometry

The page scrolls normally, like Garvit's. The "sheet" is one element the width of the viewport (max 1512 px,
centered) with `container-type: inline-size`, so every size below is in `cqw` of the sheet and the layout
scales as one picture. The first screen of the sheet, 100 by 78 cqw (1512 by 1180 at full size), is the
"poster": the hero and the top of Experience, with the margins beside them. Margin objects are positioned
inside that first screen only and stay there as the body scrolls past (they belong to the first screen, not
to the viewport). The body column continues below the poster for as long as the content needs.
Measured from Garvit's live page at 1512 px wide:

| Element | left | top | width | note |
|---|---|---|---|---|
| nav | 22.6 | 3.24 | 57.1 | links at 0.794cqw (12 px) mono, right side holds day/night and creative toggles |
| portrait (polaroid) | 29.7 | 13.6 | 7.2 | dot-matrix headshot, cursor repels dots |
| hero text | 38.6 | 8 | 33.6 | h1 "hello, i'm joshua moorehead" at 1.984cqw Gloria |
| body column | 20.4 | 32 | 59.3 | sections stack here |
| left stickers | 1.9 / 7.8 / 4 | 7.5 / 23.5 / 37.3 | 9.7 / 8 / 6 | see 4.4 for the new smaller set |
| right posters | 86.2 / 87.5 / 87 / 86.7 | 5.5 / 21.4 / 37.4 / 49.9 | 7.6 / 6.8 / 7.4 / 9.8 | |

Body text 0.926cqw (14 px at 1512), line-height 1.323cqw. h2 same size as h1, Gloria Hallelujah.
Paper: dotted pad, dot pitch about 1.6cqw, dots `#c9c7bd` on `#f4f3ee`. Night mode inverts to ink paper
`#17181a` with dots `#2c2d31` and text `#d9d7cf`. Both palettes live as tokens on `:root`.

Below 820 px the poster stops scaling: margins (stickers and posters) hide, the body column becomes
full-width with 16 px gutters, and the creative-mode toggle still works (section 5.6).

### 4.2 Sections, in order

1. Hero: polaroid left, typed intro right. Intro types itself with the pencil-sketch sound, with a replay
   button, with `<mark>` highlights on the handles. Text is Joshua's, written by him; placeholder until then.
2. Experience (before Work, on purpose). One row per job and school: logo (24 px, grayscale, colour on
   hover), company, role, dates. Hovering a row shows the preview card with a photo for that job.
3. Work ("things i've built"). Grid of cards, 2 across at full width. Each card plays a looping muted mp4
   on hover (desktop) or when scrolled into view (phone), with window chrome and a tag inside the chrome.
   First cards: Forge, Lorier restock monitor, plus the projects Joshua picks from his resume.
4. Reading, chess, running, cooking: short lists with live-ish touches where cheap (chess.com link to
   `breakfast_enjoyer`, current reading stack). No API calls that can fail silently; static content.
5. Contact: email, GitHub `jtmoot`, LinkedIn. Hover preview on each.

### 4.3 Interactions

- Custom cursor: a small ink dot that grows on interactive elements, via a `data-c` attribute. Native
  cursor hidden only on devices with a fine pointer.
- Hover preview: `data-prev` (image), `data-ph` (placeholder colour) and `data-cap` (caption) on any link or
  row. Card fades in 120 ms beside the pointer, clamped to the viewport. Images are social-preview PNGs
  Joshua supplies, 1200x630, served from `public/previews/`.
- Day/night and creative toggles sit at the right end of the nav, as tiny mono text with the toggle-tick
  sound. Sounds are off until the first user gesture and respect `prefers-reduced-motion` by being silent.
- Dot-matrix portrait: canvas, 1 dot per 3 px of the headshot, dots pushed away from the cursor within
  60 px and springing back. Falls back to the plain photo without JS.

### 4.4 Margin objects

Left margin, top to bottom, all halftone stickers with a white die-cut edge, made with the browser-canvas
pipeline from the mockup (threshold near-white to transparent, white mask drawn 24 times around a 6 px circle
for the edge, dots with radius `max(0.35, (1 - lum) * cell * 0.72)`), then exported once to PNG and committed
to `public/stickers/`:

1. Brain, from the Gray's Anatomy plate (public domain). Already have a stand-in.
2. Bookshelf, like Garvit's book sticker, from a photo of Joshua's short library.
3. Chess king, from Joshua's own piece on white paper.
4. Running shoe: an Asics Novablast, Joshua's shoe, photographed on white paper.

Four objects instead of Garvit's three, so each is about 80 percent of the measured widths above (7.8 / 6.4 /
4.8 / 5.6 cqw), re-spaced evenly between top 6 and top 50. Joshua asked for "all smaller, on the left".

Right margin: four posters Joshua picks, one each for history, tech, philosophy, finance. Printed-paper
look: slight paper tint, 1 px ink border, tiny drop shadow, each rotated between -3 and 3 degrees.
Until he supplies them, use the public-domain stand-ins from the mockup.

## 5. Creative mode

### 5.1 The motion

Entering creative mode first scrolls the page to the top (smooth, at most 300 ms, skipped if already there)
and locks scroll. The stage is the viewport. The thing that flips is the sheet, clipped to its first screen
(the 100 by 78 cqw poster) with `overflow: hidden`; the rest of the page is simply hidden under it.
The floor is therefore a 100 by 78 rectangle in "floor space" (x right, y down, in cqw of the sheet), and
every station, traveler destination, footprint and figure position in this section is in that space. The
parent transform projects floor space to the screen; nothing is positioned in screen space.

One motion, 1.5 s, `cubic-bezier(.6, 0, .25, 1)`, reversible by "back to the pad" in the same nav spot.
The stage has no perspective (orthographic). The pad gets `transform-style: preserve-3d` and animates to
`translateY(6cqw) scale(0.62) rotateX(54.7deg) rotateZ(-45deg)`, which is a true isometric floor. Its
writing fades to 0.18 opacity so the page is still faintly there. The background behind the stage darkens a
step (`#bcbcb4` day, `#0f1012` night).

Every margin object is a "traveler": absolutely positioned, `transform-origin: 50% 100%`, with `data-from`
(its pad coordinates) and `data-to` (its floor coordinates). During the same 1.5 s it moves to `data-to` and
counter-rotates with `rotateZ(45deg) rotateX(-54.7deg)` so it stands upright on the floor. Halfway through,
its flat image fades out (delay 0.5 s) and its isometric drawing fades in (delay 0.9 s). Stations with no
traveler (desk, plants, kitchen) draw themselves on after the paper lands, 0.9 s to 1.6 s, using a
stroke-dashoffset reveal so they look sketched rather than popped.

Drawings use the pad's ink and paper family: ink line work (`#2a2a28`) over paper (`#f4f3ee`) with a full
grey tonal range between them for shading, soft cast shadows on the floor, and one warm accent allowed per
station where the thing is warm (the stove flame, the heat under the Dutch oven). Line weight 0.6 at 1512
wide for contours, lighter for hatching. Night mode inverts paper and ink and keeps the accent.

`prefers-reduced-motion`: no flip. Crossfade pad to the landed state in 300 ms, figure does not wander.

### 5.2 Traveler map

| Traveler on the pad | Becomes | Where on the floor (left, top, width in cqw of the pad) |
|---|---|---|
| brain sticker | anatomy chart of the brain, framed, on the back wall | 14, 2, 8 |
| bookshelf sticker | the short library, to the left of the desk | 10, 8, 14 |
| chess king sticker | chess table with a game in progress, front left | 30, 44, 12 |
| Novablast sticker | the gym corner, front right | 60, 46, 15 |
| four posters | one corkboard on the back wall holding all four | 58, 2, 14 (posters converge on it) |
| polaroid | the figure of Joshua, standing by the desk, then starts walking | 44, 26 |

Stations without a traveler: desk (28, 4, 16), plants by the window to the right of the desk (46, 6, 10),
kitchen along the right edge (88, 14, 16). The floor is the pad itself; its dotted paper is the ground.
Coordinates are a starting layout, verified by screenshot; the builder adjusts for overlap.

### 5.3 The stations, in detail

Each station is one inline SVG, `viewBox 0 0 200 120`, drawn at the detail level of the anatomy skill's
gallery: every object fully modelled with contours, shading gradients, cast shadows and small hardware
(screws, cables, hinges, pot rims). Joshua's words: "try really hard to get as detailed as possible and
good looking". The `iso(x, y, z)` helper that maps `[OX + (x - y) * S * 0.866, OY + (x + y) * S * 0.5 - z * S]`
and its `box`, `cyl`, `line`, `rect`, `path` primitives are the scaffolding; the skill's own drawing output
is the art. WebGL or canvas shader layers (the skill's optional effects) may sit under or over a station for
steam, glow or haze, as long as the station degrades to the plain SVG when WebGL is unavailable. They are drawn with the `wheresryan22/anatomy` isometric drawing skill (or
the Kris Chase gist, or `MrBongoC/ai-iso-skill`, whichever the builder finds gives the most faithful result
after trying one station with each), installed with `npx skills add wheresryan22/anatomy -g -a claude-code`.
Joshua has approved installing these skills globally for this work (2026-10-28). If none of the three gives
usable output, the fallback is hand-coded SVG with the `iso` helper from the mockup, which is how the
mockup drawings were made; the detail lists still apply.

Acceptance: the builder screenshots each station at 1512 and 390 wide and checks it against its list before
moving on; Joshua is the final judge at his review. "Detailed" means a viewer can name every item below
from the drawing.

Desk (work)
- Standing desk, top raised a little above normal height, two visible legs on a T-frame.
- Behind it, a wall of black acoustic panels: a grid of rectangular panels with bevelled edges, drawn in
  ink tone with mid-tone bevels, roughly 3 by 2 panels visible.
- Two monitors on the desk, side by side, each with a laptop in front of or below it: one "work" laptop,
  one "school" laptop, both closed-lid or half-open, each tethered to its monitor by a thin cable.
- Two small bookshelf speakers at the outer ends, a microphone on a short boom arm at the right, an
  Apple-style low keyboard and a mouse centred.
- A small GPU box or external drive under the desk is optional, not required.

Library (reading)
- Short, waist-high bookshelf, three shelves, standing to the left of the desk.
- Books of varied heights and thicknesses, some leaning, a couple lying flat on top. Spines get a handful of
  tiny title ticks, not text. Joshua will give titles; the top shelf then gets his current stack.

Plants (by the window, right of the desk)
- A window frame on the back wall with four panes and a sill.
- Three or four big pots, 8 inches and up: two monsteras with split leaves and a moss pole, one corn plant
  (dracaena) with a cane trunk and a crown of long strappy leaves, one hosta with broad ribbed leaves low
  in its pot. Pots are plain cylinders with a saucer. They should read as "big boys", knee to hip height.

Gym corner (training)
- A Rogue-style squat rack: two uprights with holes, a pull-up bar across the top, J-cups holding a barbell
  with a plate each side.
- On the floor: two kettlebells of different sizes, a plyo box, an agility ladder laid out in a few rungs.
- A weighted vest hanging on the rack's upright, a pair of Asics Novablast shoes beside the rack. The shoe
  should keep the Novablast profile: thick rockered midsole, low collar.
- Small chalk bucket optional.

Kitchen (cooking)
- A counter with a four-burner stovetop. On one burner, an enamelled Dutch oven with two side handles and a
  domed lid with a knob. A pepper mill and a small spice jar on the counter, a wooden spoon in a crock.
- Animation when the figure arrives (section 5.4): the lid lifts and tilts up on the far side, three or
  four steam wisps rise as drawn curves that fade, a pinch of spice falls from above the pot as a few dots.
  Lid closes when the figure leaves. The whole beat is about 2.5 s and loops while the figure stays.

Chess table (chess)
- Small square table, two chairs facing, an 8 by 8 board drawn in paper and mid squares with a few pieces
  mid-game: silhouettes only, king and knight recognisable. A tiny captured-piece pile on one side.

Corkboard (posters)
- A wide cork rectangle with a thin frame, four pinned sheets with slightly curled corners, each a reduced
  halftone of the real poster image once supplied (stand-in: blank sheets with a scribble).

Anatomy chart (the brain)
- A framed vertical chart on the back wall: a brain in sagittal view with a few leader lines to small
  label ticks, in the style of a Gray's plate. Below it a short caption rule.

### 5.4 Labels and triggers

Each station has a Gloria Hallelujah label at 1.9cqw beside it at ground level, right side, in ink tone.
When the figure comes within a station's radius, its label underlines and a small paper card appears above it
with one line of text and a link that scrolls the pad section into view after "back to the pad" (desk links
to Experience, library to Reading, gym to Running, kitchen to Cooking, chess to the chess.com profile,
corkboard to nothing, anatomy chart to nothing). The kitchen also plays its lid animation.

### 5.5 The figure

A drawn Joshua, hairline style, about 7cqw tall, recognisable by hair, glasses if he wears them, and a
plain hoodie. Built as a sprite sheet: four facing directions (down-left, down-right, up-left, up-right in
isometric terms) with four walk frames each and one idle frame each, 20 drawings total, in one SVG symbol
sheet. First version is allowed to be a code-animated single drawing (torso and head fixed, limbs swung in
code, as in the mockup) if the sprite sheet is not ready; the sprite sheet replaces it before ship.

Source for the sprite sheet, in order of preference: drawn with the anatomy skill from a written
description plus Joshua's headshot as reference; or an image model generates a four-view line sheet from
the headshot ("isometric hairline line drawing, four views, white background, no shading") which the builder
traces to SVG. Either way the result is committed as SVG, no raster.

Movement happens in floor space (section 5.1) and is projected by the parent transform; keyboard directions
map to floor axes (up = toward the back wall, which is up-right on screen). Idle, the figure walks a loop
through the stations in this order: desk, library, plants, kitchen, gym, chess, corkboard, anatomy chart,
with a 1.5 s pause at each. Desktop: arrow keys
or WASD move it at 9cqw per second in isometric-projected directions; any key press takes control and the
idle loop resumes 6 s after the last input. Phone: tap a point on the floor and the figure walks there.
It does not walk through station footprints (simple rectangles). It can leave the floor: when the figure
steps past the pad's edge, dotted-paper tiles (squares of 6 by 6 floor units) sketch themselves in under and
around it with a stroke draw-on, so the floor grows as it walks. Tiles start fading 4 s after the figure
last stood on or next to them. If the figure is standing on a tile that has fully faded, it falls: a short
tumble, it dissolves into a few ink dots, and it reappears at the desk after 1 s with the idle loop resumed.
The pad itself never fades. On a phone the tap target may be off the pad too. Z-order: the
figure is drawn in front of stations whose footprint top is above its feet and behind the others.

### 5.6 Phones

Below 820 px the margins are hidden, so the travelers have nothing to travel from, and the text column is
too tall to be a floor. Creative mode on a phone therefore uses a separate fixed-position stage: a blank
dotted sheet with the same 100 by 78 proportions, scaled to the viewport width and vertically centered,
which flips the same way while the page content fades out under it. The same station components and floor
coordinates are used unchanged, and the stations draw themselves on. The floor is pinch-free and fixed; the
figure is tap-driven. Target: 60 fps on an iPhone 12 class device; nothing in the scene should cause layout
work after the flip, only transforms and opacity.

## 6. Content Joshua supplies

- Resume (coming this week). Experience rows, logos per company and school (SVG or PNG, grayscale ok).
- Final headshot (candidate: `~/Downloads/yes.jpg`).
- Photos on white paper: chess king, Asics Novablast, the short library, the Dutch oven, the weighted vest.
- Forge screen recording, 10 to 20 s mp4, and one recording per picked project.
- One photo per job or school for the experience hover previews. LinkedIn screenshot for the contact preview.
- Four posters for the right margin. Book titles for the library.
- The intro paragraph, in his words.

Everything above has a stand-in so nothing blocks the build.

## 7. Left to the builder

- Component structure, state management for the two modes (my suggestion: one `mode` state in `App`,
  `data-mode` on the stage, all motion in CSS; station proximity and figure movement in one `rAF` loop).
- Exact traveler and station coordinates after the first screenshot.
- Which isometric skill produces the best desk after trying it on one station; then use it for all.
- Sprite sheet production route (5.5), as long as the result is SVG.
- Audio implementation (two short clips, Web Audio or `<audio>`), kept silent until a user gesture. The
  clips are not Garvit's files. Source CC0 clips (freesound.org, filtered to CC0) for a pencil scribble and a
  soft click, record the licence and author in `public/audio/SOURCES.md`. Silent until they land is fine.
- Fonts: Geist Mono is under the SIL Open Font License, so committing the woff2 to `public/fonts/` is fine.
  Gloria Hallelujah may be loaded from Google Fonts or self-hosted (also OFL); self-host if it is cheap.
- Hosting of mp4 demos (`public/` vs Vercel Blob) based on total size; under 25 MB total stays in `public/`.
- Whether to keep a tiny dev toggle for creative mode in the URL (`?mode=creative`) for screenshots.

## 8. Order of work (for the plan)

1. Drawing spike first, before any page code: install the skill, draw the desk and the gym to the section
   5.3 lists, screenshot at two widths, iterate until a viewer can name every item. This is the riskiest and
   most visible part, and it decides which skill to use.
2. Quiet page from the measurements in 4.1, with stand-in content, build passing.
3. Creative mode motion with the first two stations, then the remaining six.
4. Figure: code-animated first, sprite sheet second, controls third.
5. Content pass once the resume lands: Experience, logos, projects, previews, posters, book titles.
6. Review by Joshua. Then write the cutover steps (merge to `main`, Vercel check, redirects if any) as the
   last task of the plan, but do not run them: the cutover itself needs Joshua's explicit go in the moment.
