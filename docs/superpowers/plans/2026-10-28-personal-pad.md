# Personal Pad Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the r3f studio site with Joshua's "personal pad" page (Garvit-style dotted sheet, measured proportions) and a creative mode where the sheet falls flat into an isometric floor of hairline SVG drawings of his real rooms with a walkable figure.

**Architecture:** One Vite + React single page. A `sheet` element holds the pad content and the margin objects, scaled with `cqw` units. `App` owns one `mode` state (`"pad" | "creative"`), written to `data-mode` on the stage; all motion is CSS transitions keyed off that attribute. Pure logic (isometric projection, floor space, figure stepping, traveler map) lives in `src/lib/` and is unit-tested with Vitest; drawings are React SVG components in `src/creative/stations/`, verified by screenshot.

**Tech Stack:** Vite 6, React 19 (JSX, hooks only), CSS 3D transforms, inline SVG, Vitest + jsdom for unit tests, Playwright MCP for screenshots. No three.js, no GSAP, no Lenis.

**Spec:** `docs/superpowers/specs/2026-10-28-personal-pad-design.md`. Reference mockups in `docs/superpowers/reference/pad-mockups/` (`direction-v9.html` page, `direction-v13.html` motion). Read both before Task 1.

## Global Constraints

- Keep only `react`, `react-dom`, `vite`, `@vitejs/plugin-react` from the current `package.json`; remove `three`, `@react-three/fiber`, `@react-three/drei`, `@gltf-transform/cli`, `gsap`, `@gsap/react`, `lenis`.
- Fonts: Gloria Hallelujah for the name, section titles and creative-mode labels; Geist Mono for all other text. No third face. Both self-hosted in `public/fonts/` (OFL licensed).
- Tokens on `:root`: day paper `#f4f3ee`, dots `#c9c7bd`, ink `#2a2a28`, mid `#b8b6ad`, stage `#bcbcb4`; night paper `#17181a`, dots `#2c2d31`, text `#d9d7cf`, stage `#0f1012`. Night is `html[data-theme="night"]`.
- Every size inside the sheet is in `cqw` of the sheet (`container-type: inline-size`, max width 1512 px). Body text 0.926cqw, line-height 1.323cqw, nav links 0.794cqw, h1 and h2 1.984cqw.
- Creative mode is CSS transforms plus SVG illustration; no three.js, no perspective camera, no meshes. Drawings are ink (`--ink`) on paper (`--paper`) with a full grey tonal range, gradients, cast shadows and one warm accent per station where warranted; contour stroke 0.6 in a `viewBox 0 0 200 120`. Quality bar: the anatomy skill's gallery (Raptor engine test stand). Optional WebGL or canvas effect layers (steam, glow, haze) must degrade to the plain SVG when WebGL is unavailable.
- Floor space is a 100 by 78 rectangle, x right, y down, in cqw of the sheet. All station, traveler, footprint and figure coordinates are floor-space.
- Breakpoint: below 820 px margins hide and the phone stage (Task 13) is used.
- `prefers-reduced-motion: reduce`: no flip, 300 ms crossfade, no sounds, figure does not wander.
- No emoji in the UI. No `console.log`. Conventional commits. Never touch `main`. Run `npm run build` at the end of every task.
- Screenshots: use the Playwright MCP (`browser_resize` to 1512x1180 and 390x844, `browser_navigate` to the dev server, `browser_take_screenshot`), save under `docs/superpowers/reference/screens/<task>-<name>.jpg`.

## Review Focus

- Toggling creative mode twice within the 1.5 s transition: the stage must end in the state of the last click, scroll stays locked only while in creative mode. Pinned in Task 9 (`toggleMode` idempotence test and the scroll-lock cleanup test).
- Holding a movement key, then leaving creative mode: the rAF loop must stop and no keydown handler stays attached. Pinned in Task 11 (`useFigure` cleanup test).
- Hover preview on a link near the right or bottom edge of the viewport: the card stays fully on screen. Pinned in Task 7 (`clampPreview` test).
- Project video on a phone with autoplay blocked: the card still shows its poster frame and never throws. Pinned in Task 6 (`play()` rejection is caught; test asserts no unhandled rejection).
- Figure walks off the pad and the tab is backgrounded for a minute: on return, every tile it stood on has faded and it must fall once and respawn at the desk, not fall repeatedly or get stuck. Pinned in Task 11 (`stepFigure` with a large `dt` falls exactly once, then `control` is `"idle"` at the desk).

---

### Task 1: Reset the project to the new stack

**Files:**
- Modify: `package.json`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `CLAUDE.md`
- Delete: `src/scenes/`, `src/canvas/`, `src/hooks/`, `src/lib/scene.js`, `src/lib/scroll.js`, `src/lib/smoothScroll.js`, `src/content/{About,Hero,Nav,Projects,Timeline,Contact}.jsx`, `src/content/useBeats.js`, `public/assets/hdri/` (confirmed by Joshua's approval of the spec on 2026-10-28; everything is in git history and the `archive/bento-v1` tag line of history)
- Keep: `src/content/data.js` (project copy is reused in Task 6)
- Create: `vitest.config.js`, `tests/smoke.test.js`

**Interfaces:**
- Produces: `npm test` runs Vitest; `src/App.jsx` default-exports `App` rendering `<div className="stage" data-mode="pad">` with an empty `<main className="sheet">`.

- [ ] **Step 1: Commit the docs, then create the branch**

```bash
git add docs .gitignore
git commit -m "docs: personal pad design spec, plan and reference mockups"
git checkout -b rebuild/personal-pad
```

- [ ] **Step 2: Remove the old dependencies and add the test runner**

```bash
npm uninstall three @react-three/fiber @react-three/drei @gltf-transform/cli gsap @gsap/react lenis
npm install -D vitest jsdom
```

Add `"test": "vitest run"` and `"test:watch": "vitest"` to `scripts`.

- [ ] **Step 3: Write `vitest.config.js`** with `test.environment = "jsdom"` and `test.include = ["tests/**/*.test.js"]`.

- [ ] **Step 4: Write the failing smoke test** `tests/smoke.test.js`

```js
import { describe, it, expect } from "vitest";
import App from "../src/App.jsx";
describe("App", () => {
  it("exports a component", () => { expect(typeof App).toBe("function"); });
});
```

- [ ] **Step 5: Run `npm test`**. Expected: FAIL (App still imports deleted modules, or three is missing).

- [ ] **Step 6: Delete the studio code listed above with `git rm -r`**, rewrite `src/App.jsx` to the shell in Interfaces, `src/main.jsx` to render `<App />` into `#root`, and `src/index.css` to a reset plus `html, body { margin: 0; background: var(--stage) }` (tokens come in Task 4). Replace the Google Fonts link in `index.html` with nothing for now; set `<title>joshua moorehead</title>` and the description from the spec intent.

- [ ] **Step 7: Run `npm test` and `npm run build`**. Expected: test PASS, build succeeds with no warnings about missing modules.

- [ ] **Step 8: Rewrite `CLAUDE.md`** "Vision", "Tech Stack" and "Current Working State" to point at the spec and this plan; remove every mention of three.js, r3f, GSAP, Lenis and the studio scene. Keep the Workflow Rules and Commands sections verbatim.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: reset to personal-pad stack, remove studio scene and three.js"
```

### Task 2: Isometric helper, station harness, and the drawing spike (desk and gym)

**Files:**
- Create: `src/lib/iso.js`, `tests/lib/iso.test.js`, `src/creative/stations/Desk.jsx`, `src/creative/stations/Gym.jsx`, `src/creative/stations/index.js`, `src/creative/StationHarness.jsx`
- Modify: `src/App.jsx` (render `StationHarness` when `location.search` contains `dev=stations`)

**Interfaces:**
- Produces `src/lib/iso.js`:
  - `iso(x, y, z, { S = 1, OX = 0, OY = 0 } = {}) -> [sx, sy]` where `sx = OX + (x - y) * S * 0.866`, `sy = OY + (x + y) * S * 0.5 - z * S`.
  - `isoDrawer(S, OX, OY)` returning `{ box(x,y,z,w,d,h,tones), cyl(x,y,z,r,h,tones), line(a,b), rect(x,y,z,w,d,tone), path(points, tone) }`, each returning an SVG element description `{ tag, attrs }`; `tones = { top, left, right }` as `"paper" | "mid" | "ink"` mapping to CSS vars `--paper`, `--mid`, `--ink`.
  - `TONE = { paper: "var(--paper)", mid: "var(--mid)", ink: "var(--ink)" }`, `STROKE = 0.6`. Primitives are scaffolding for placement and footprints; the skill's own shaded output is the art and may use gradients, filters and any number of greys.
- Produces a station module contract, used by every station and by Tasks 10 and 11:
  ```js
  export const station = {
    id: "desk",            // spec 5.2 ids: desk, library, plants, kitchen, gym, chess, corkboard, anatomy
    label: "desk",         // Gloria label text
    pos: { x: 28, y: 4, w: 16 },      // floor space, cqw
    footprint: { x: 28, y: 4, w: 16, h: 8 },
    link: "#experience",   // or null
    Component,             // React component rendering <svg viewBox="0 0 200 120">, props: { active: boolean }
  };
  ```
- Produces `src/creative/stations/index.js`: `export const STATIONS = [...]` in idle-route order `desk, library, plants, kitchen, gym, chess, corkboard, anatomy` (Tasks 3 fills the rest; this task exports desk and gym and leaves the others as `null` placeholders filtered out).

- [ ] **Step 1: Install the drawing skills** (approved by Joshua 2026-10-28)

```bash
npx skills add wheresryan22/anatomy -g -a claude-code
npx skills add MrBongoC/ai-iso-skill -g -a claude-code
```

Fetch the Kris Chase gist (`https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee`) into `docs/superpowers/reference/iso-skill-gist.md`.

- [ ] **Step 2: Write the failing tests** `tests/lib/iso.test.js`

```js
import { describe, it, expect } from "vitest";
import { iso, isoDrawer, STROKE } from "../../src/lib/iso.js";
describe("iso", () => {
  it("origin maps to OX,OY", () => { expect(iso(0,0,0,{OX:100,OY:60})).toEqual([100,60]); });
  it("x axis goes down-right", () => {
    const [sx, sy] = iso(1,0,0,{S:10}); expect(sx).toBeCloseTo(8.66,2); expect(sy).toBeCloseTo(5,5);
  });
  it("y axis goes down-left", () => {
    const [sx, sy] = iso(0,1,0,{S:10}); expect(sx).toBeCloseTo(-8.66,2); expect(sy).toBeCloseTo(5,5);
  });
  it("z goes straight up", () => { expect(iso(0,0,1,{S:10})).toEqual([0,-10]); });
  it("box returns three faces with the three tones", () => {
    const d = isoDrawer(10, 100, 60);
    const faces = d.box(0,0,0,2,2,2,{top:"paper",left:"mid",right:"ink"});
    expect(faces).toHaveLength(3);
    expect(faces.every(f => f.attrs["stroke-width"] === STROKE)).toBe(true);
  });
});
```

- [ ] **Step 3: Run `npm test`**. Expected: FAIL, module not found.

- [ ] **Step 4: Implement `src/lib/iso.js`** per Interfaces. Port the math from `direction-v13.html` (`isoDrawer`), returning element descriptions instead of DOM nodes.

- [ ] **Step 5: Run `npm test`**. Expected: PASS.

- [ ] **Step 6: Build `StationHarness.jsx`**: a page that renders every non-null station from `STATIONS` twice, at 600 px and 160 px wide, on the day paper with the dotted pattern, label underneath, with a day/night button. Route it from `App` on `?dev=stations`.

- [ ] **Step 7: Draw `Desk.jsx`** using the anatomy skill first, at the detail and shading level of the skill's gallery (fully modelled objects, gradients, cast shadow on the floor, small hardware like cable ends and screws), to the spec 5.3 "Desk" list: standing desk on a T-frame, 3 by 2 bevelled black acoustic panels behind, two monitors each with a tethered laptop, two speakers, boom mic on the right, low keyboard and mouse. Screenshot the harness at 1512 wide; check every item is nameable. Iterate until it is. Then draw the same desk once with the ai-iso skill and once from the gist, compare the three screenshots, and record the winner in `docs/superpowers/reference/drawing-skill-choice.md` (three lines: which, why, what failed).

- [ ] **Step 8: Draw `Gym.jsx`** with the chosen skill to the spec "Gym corner" list: Rogue-style rack with holed uprights, pull-up bar, J-cups holding a barbell with a plate each side, two kettlebells of different sizes, plyo box, agility ladder, weighted vest hanging on an upright, Asics Novablast pair (thick rockered midsole, low collar). Screenshot at 1512 and 390. Iterate until every item is nameable.

- [ ] **Step 9: Run `npm test` and `npm run build`**. Expected: PASS, build succeeds.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: isometric drawing helper, station harness, desk and gym stations"
```

### Task 3: Remaining six stations

**Files:**
- Create: `src/creative/stations/Library.jsx`, `Plants.jsx`, `Kitchen.jsx`, `Chess.jsx`, `Corkboard.jsx`, `Anatomy.jsx`
- Modify: `src/creative/stations/index.js` (fill all eight), `tests/creative/stations.test.js` (create)

**Interfaces:**
- Consumes: station contract from Task 2.
- Produces: `STATIONS` with eight entries, these `pos` values (floor space): anatomy `{14,2,8}`, library `{10,8,14}`, desk `{28,4,16}`, plants `{46,6,10}`, corkboard `{58,2,14}`, kitchen `{88,14,16}`, chess `{30,44,12}`, gym `{60,46,15}`. Links: desk `#experience`, library `#reading`, gym `#running`, kitchen `#cooking`, chess `https://www.chess.com/member/breakfast_enjoyer`, plants / corkboard / anatomy `null`.
- Kitchen `Component` accepts `active` and, while true, runs the 2.5 s looping lid-lift, steam, spice animation with CSS keyframes inside the SVG (`<animate>` is not used; CSS on SVG groups is).

- [ ] **Step 1: Write the failing test** `tests/creative/stations.test.js`

```js
import { describe, it, expect } from "vitest";
import { STATIONS } from "../../src/creative/stations/index.js";
const FLOOR = { w: 100, h: 78 };
describe("STATIONS", () => {
  it("has the eight stations in idle-route order", () => {
    expect(STATIONS.map(s => s.id)).toEqual(["desk","library","plants","kitchen","gym","chess","corkboard","anatomy"]);
  });
  it("footprints lie inside the floor", () => {
    for (const s of STATIONS) {
      expect(s.footprint.x).toBeGreaterThanOrEqual(0);
      expect(s.footprint.y).toBeGreaterThanOrEqual(0);
      expect(s.footprint.x + s.footprint.w).toBeLessThanOrEqual(FLOOR.w);
      expect(s.footprint.y + s.footprint.h).toBeLessThanOrEqual(FLOOR.h);
    }
  });
  it("every station has a label and a component", () => {
    for (const s of STATIONS) { expect(s.label.length).toBeGreaterThan(0); expect(typeof s.Component).toBe("function"); }
  });
});
```

- [ ] **Step 2: Run `npm test`**. Expected: FAIL (six entries missing).

- [ ] **Step 3: Draw each station** with the chosen skill, one at a time, to its spec 5.3 list, screenshot in the harness at 1512 and 390, iterate until every item is nameable:
  - Library: waist-high, three shelves, varied books with title ticks, two flat on top, a few leaning.
  - Plants: four-pane window with sill; two monsteras with split leaves and a moss pole, a corn plant with cane trunk and strappy crown, a hosta with broad ribbed leaves; plain cylinder pots with saucers, knee to hip height.
  - Kitchen: counter with four-burner stovetop, Dutch oven with two side handles and domed knobbed lid, pepper mill, spice jar, wooden spoon in a crock, warm accent on the lit burner. Animation per Interfaces: lid lifts and tilts on the far side, steam rises and fades (SVG curves, or the skill's shader steam on a canvas layer behind the lid with the SVG curves as fallback when `canvas.getContext("webgl")` is null), a few spice dots fall, lid closes at the loop end.
  - Chess: square table, two chairs, 8 by 8 board in paper and mid squares, mid-game silhouettes with king and knight recognisable, a captured-piece pile.
  - Corkboard: wide cork rectangle with thin frame, four pinned sheets with curled corners, scribble stand-ins.
  - Anatomy: framed vertical chart, sagittal brain with leader lines to label ticks, caption rule below.

- [ ] **Step 4: Run `npm test` and `npm run build`**. Expected: PASS.

- [ ] **Step 5: Commit** `feat: draw library, plants, kitchen, chess, corkboard and anatomy stations`

### Task 4: Tokens, fonts, the sheet geometry, and the nav

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/sheet.css`, `src/pad/Nav.jsx`, `src/lib/theme.js`, `tests/lib/theme.test.js`, `public/fonts/GeistMono-Variable.woff2`, `public/fonts/GloriaHallelujah-Regular.woff2`, `public/fonts/LICENSES.md`
- Modify: `src/App.jsx`, `src/index.css`, `index.html`

**Interfaces:**
- Produces `src/lib/theme.js`: `getTheme() -> "day" | "night"`, `setTheme(t)` writes `data-theme` on `<html>` and `localStorage["theme"]`, `toggleTheme()`.
- Produces the DOM skeleton later tasks fill: `<div class="stage" data-mode><main class="sheet"><nav class="nav"/><section class="poster"><div class="margin margin-left"/><div class="hero"/><div class="margin margin-right"/></section><div class="body">…sections…</div></main></div>`.
- `.poster` is `height: 78cqw; position: relative`. `.body` starts at `top: 32cqw` of the poster visually, achieved with `margin-top: -46cqw` on `.body`, `left: 20.4cqw; width: 59.3cqw`.

- [ ] **Step 1: Write the failing test** `tests/lib/theme.test.js`: `toggleTheme()` flips `document.documentElement.dataset.theme` between `"day"` and `"night"` and persists to `localStorage`.

- [ ] **Step 2: Run `npm test`**. Expected: FAIL.

- [ ] **Step 3: Implement `theme.js`**, run tests. Expected: PASS.

- [ ] **Step 4: Download the two fonts** (Geist Mono variable woff2 from the Vercel Geist GitHub release; Gloria Hallelujah TTF from Google Fonts, converted to woff2 with `npx -y ttf2woff2` or served as TTF if conversion is unavailable). Write `LICENSES.md` with both OFL notices. Declare `@font-face` in `tokens.css` with `font-display: swap`.

- [ ] **Step 5: Write `tokens.css`** (Global Constraints palette, both themes, `--font-hand`, `--font-mono`) and `sheet.css` (sheet `max-width: 1512px; margin: 0 auto; container-type: inline-size`, dotted paper via `radial-gradient(var(--dots) 0.5px, transparent 0.6px)` at `1.6cqw` pitch, the `.poster` and `.body` geometry above, h1/h2 in `--font-hand` at 1.984cqw, body at 0.926cqw / 1.323cqw).

- [ ] **Step 6: Build `Nav.jsx`**: `left: 22.6cqw; top: 3.24cqw; width: 57.1cqw`, links `experience`, `work`, `reading`, `contact` at 0.794cqw, and on the right two mono buttons: theme (`day` / `night`) and `creative mode` (calls `onToggleMode` prop; wired in Task 9). Buttons have `aria-pressed`.

- [ ] **Step 7: Screenshot** at 1512 with placeholder h1 "hello, i'm joshua moorehead" at `left: 38.6cqw; top: 8cqw; width: 33.6cqw`. Compare against `pad-mockups/v9-pad.jpg`: nav x position and h1 position must match within 0.5cqw.

- [ ] **Step 8: `npm test`, `npm run build`, commit** `feat: tokens, fonts, sheet geometry and nav`

### Task 5: Hero, typed intro, dot-matrix portrait, audio

**Files:**
- Create: `src/pad/Hero.jsx`, `src/pad/TypedIntro.jsx`, `src/pad/DotPortrait.jsx`, `src/lib/audio.js`, `src/lib/typer.js`, `tests/lib/typer.test.js`, `tests/lib/audio.test.js`, `public/audio/SOURCES.md`, `public/headshot.jpg` (copy from `docs/superpowers/reference/pad-mockups/headshot.jpg`)
- Modify: `src/App.jsx`, `src/content/data.js` (add `INTRO` string with `<mark>` segments as `{ text, mark }` tokens)

**Interfaces:**
- `src/lib/typer.js`: `typeSchedule(tokens, cps = 28) -> Array<{ at: ms, html: string }>` pure; the component replays it with `setTimeout`.
- `src/lib/audio.js`: `unlock()` (call on first `pointerdown`/`keydown`), `play("pencil" | "tick")`; both no-ops before unlock, when `prefers-reduced-motion` matches, or when the file 404s.
- `DotPortrait` props: `{ src, width }` renders a canvas with one dot per 3 px of the source, dots within 60 px of the cursor pushed away and springing back; `<noscript>`/fallback `<img>`.

- [ ] **Step 1: Write failing tests**: `typeSchedule` returns monotonically increasing `at`, final `html` equals the joined text with `<mark>` around marked tokens; `play("tick")` before `unlock()` resolves without throwing and creates no `Audio`.
- [ ] **Step 2: Run `npm test`**. Expected: FAIL.
- [ ] **Step 3: Implement `typer.js` and `audio.js`**. Run tests. Expected: PASS.
- [ ] **Step 4: Source two CC0 clips** (freesound.org, licence filter CC0): a pencil scribble about 2 s and a soft click under 200 ms, save as `public/audio/pencil.mp3` and `public/audio/tick.mp3`, record author, URL and licence in `SOURCES.md`. If none is found in 15 minutes, leave the files absent; `audio.js` already tolerates that.
- [ ] **Step 5: Build `Hero.jsx`** (polaroid at `left: 29.7cqw; top: 13.6cqw; width: 7.2cqw`, white border, slight rotate, `DotPortrait` inside; intro at `left: 38.6cqw; top: 8cqw; width: 33.6cqw` with h1 and `TypedIntro`, a `replay` button that re-runs the schedule and plays `pencil`).
- [ ] **Step 6: Screenshot at 1512**, compare polaroid and text positions with `v9-pad.jpg`; move the cursor over the portrait and confirm the dots part.
- [ ] **Step 7: `npm test`, `npm run build`, commit** `feat: hero with typed intro, dot-matrix portrait and sounds`

### Task 6: Body sections with stand-in content

**Files:**
- Create: `src/pad/Experience.jsx`, `src/pad/Work.jsx`, `src/pad/ProjectCard.jsx`, `src/pad/Interests.jsx`, `src/pad/Contact.jsx`, `tests/pad/projectcard.test.jsx`
- Modify: `src/content/data.js` (add `EXPERIENCE`, `READING`, `LINKS`; fix Forge GitHub link to `https://github.com/jtmoot`), `src/App.jsx`

**Interfaces:**
- `EXPERIENCE: Array<{ id, company, role, dates, logo: "/logos/<id>.svg", preview: "/previews/<id>.jpg" }>`; `PROJECTS` gain `{ video: "/demos/<id>.mp4" | null, poster: "/previews/<id>.jpg", tag }`.
- Sections have ids `experience`, `work`, `reading`, `running`, `cooking`, `contact` (creative-mode links target these).
- `ProjectCard` plays its video on `mouseenter` (fine pointer) or when 50 percent in view (coarse pointer) via `IntersectionObserver`; `video.play()` rejections are caught.

- [ ] **Step 1: Write the failing test** `tests/pad/projectcard.test.jsx` (React testing via `react-dom/client` + `act`): rendering with `video: null` shows the poster `<img>`; with a video, calling the exported `startPlayback(videoEl)` when `play` returns a rejected promise does not throw (`await expect(startPlayback(fake)).resolves.toBeUndefined()`).
- [ ] **Step 2: Run `npm test`**. Expected: FAIL.
- [ ] **Step 3: Implement the five components and data**. Experience rows: logo 24 px grayscale, colour on hover; company, role, dates in mono; `data-prev`/`data-cap` attributes for Task 7. Work grid two across, cards with window chrome and the tag inside the chrome at `right: 16px; top: 14px`. Interests: reading stack list, chess link to `breakfast_enjoyer`, running line (Novablast), cooking line. Contact: email, `github.com/jtmoot`, LinkedIn, each with `data-prev`.
- [ ] **Step 4: Run `npm test`**. Expected: PASS.
- [ ] **Step 5: Screenshot at 1512 and 390**; at 390 the body must be full width with 16 px gutters and no horizontal scroll (`document.documentElement.scrollWidth === 390`).
- [ ] **Step 6: `npm run build`, commit** `feat: experience, work, interests and contact sections`

### Task 7: Hover preview card and custom cursor

**Files:**
- Create: `src/pad/HoverPreview.jsx`, `src/pad/Cursor.jsx`, `src/lib/preview.js`, `tests/lib/preview.test.js`
- Modify: `src/App.jsx`, `src/styles/sheet.css`

**Interfaces:**
- `src/lib/preview.js`: `clampPreview({ x, y }, { w, h }, viewport) -> { left, top }` keeps the card 12 px inside the viewport; default card size 240 by 150.
- Any element with `data-prev` (image URL), optional `data-ph` (placeholder colour) and `data-cap` shows the card after 120 ms fade; one global listener on `mouseover`/`mouseout` at the stage root.
- `Cursor` renders only when `matchMedia("(pointer: fine)")` matches; hides the native cursor via `html.has-cursor * { cursor: none }`; grows on elements with `data-c` or `a, button`.

- [ ] **Step 1: Write the failing test**: `clampPreview({x: 1500, y: 1100}, {w: 240, h: 150}, {w: 1512, h: 1180})` returns `left <= 1512 - 240 - 12` and `top <= 1180 - 150 - 12`; a pointer at `(10, 10)` returns `left >= 12`.
- [ ] **Step 2: Run `npm test`**. Expected: FAIL.
- [ ] **Step 3: Implement `preview.js`, `HoverPreview.jsx`, `Cursor.jsx`**; copy `docs/superpowers/reference/pad-mockups/github-preview.jpg` to `public/previews/github.jpg` for the contact link.
- [ ] **Step 4: Run `npm test`**. Expected: PASS.
- [ ] **Step 5: Screenshot** while hovering the GitHub link: card visible with image and caption. Hover an Experience row: card shows its placeholder colour when the preview is missing.
- [ ] **Step 6: `npm run build`, commit** `feat: hover preview cards and custom cursor`

### Task 8: Margin stickers and posters

**Files:**
- Create: `tools/halftone.html`, `src/lib/halftone.js`, `tests/lib/halftone.test.js`, `src/pad/Margins.jsx`, `src/lib/travelers.js`, `tests/lib/travelers.test.js`, `public/stickers/{brain,bookshelf,king,novablast}.png`, `public/posters/{history,tech,philosophy,finance}.jpg`
- Modify: `src/App.jsx`, `src/styles/sheet.css`

**Interfaces:**
- `src/lib/halftone.js`: `dotRadius(lum, cell) -> Math.max(0.35, (1 - lum) * cell * 0.72)`; `isNearWhite(r,g,b, t = 235)`.
- `tools/halftone.html`: standalone page (opened from the file system) importing nothing from `src`; file input, cell size slider, 6 px die-cut edge drawn by stamping the white mask 24 times around a circle, download button. Port from `direction-v9.html`.
- `src/lib/travelers.js`:
  ```js
  export const TRAVELERS = [
    { id: "brain",     kind: "sticker", from: { left: 1.9, top: 6,  width: 7.8 }, to: { x: 14, y: 2,  w: 8  }, station: "anatomy" },
    { id: "bookshelf", kind: "sticker", from: { left: 7.8, top: 20, width: 6.4 }, to: { x: 10, y: 8,  w: 14 }, station: "library" },
    { id: "king",      kind: "sticker", from: { left: 4,   top: 34, width: 4.8 }, to: { x: 30, y: 44, w: 12 }, station: "chess" },
    { id: "novablast", kind: "sticker", from: { left: 3,   top: 46, width: 5.6 }, to: { x: 60, y: 46, w: 15 }, station: "gym" },
    { id: "poster-history",    kind: "poster", from: { left: 86.2, top: 5.5,  width: 7.6 }, to: { x: 58, y: 2, w: 14 }, station: "corkboard" },
    { id: "poster-tech",       kind: "poster", from: { left: 87.5, top: 21.4, width: 6.8 }, to: { x: 58, y: 2, w: 14 }, station: "corkboard" },
    { id: "poster-philosophy", kind: "poster", from: { left: 87,   top: 37.4, width: 7.4 }, to: { x: 58, y: 2, w: 14 }, station: "corkboard" },
    { id: "poster-finance",    kind: "poster", from: { left: 86.7, top: 49.9, width: 9.8 }, to: { x: 58, y: 2, w: 14 }, station: "corkboard" },
    { id: "polaroid",  kind: "polaroid", from: { left: 29.7, top: 13.6, width: 7.2 }, to: { x: 44, y: 26, w: 7 }, station: "figure" },
  ];
  ```
- `Margins.jsx` renders every non-polaroid traveler as `<figure class="obj" data-id data-kind style="--from-left --from-top --from-width --to-x --to-y --to-w">` with the flat image inside `.flat`; the station drawing is added by Task 10.

- [ ] **Step 1: Write failing tests**: `dotRadius(1, 6) === 0.35`, `dotRadius(0, 6)` close to 4.32; every `TRAVELERS[i].station` is `"figure"` or an id in `STATIONS`; all four posters share the same `to`.
- [ ] **Step 2: Run `npm test`**. Expected: FAIL.
- [ ] **Step 3: Implement `halftone.js`, `travelers.js`, `tools/halftone.html`**. Run tests. Expected: PASS.
- [ ] **Step 4: Make the four stickers** with the tool from `pad-mockups/obj-brain.png`, `obj-king.png`, `obj-shoe.jpg` and a stand-in bookshelf photo (Wikimedia Commons, public domain, saved with its source URL in `public/stickers/SOURCES.md`); export at 360 px wide. Posters: four public-domain stand-ins (Commons) with sources recorded in `public/posters/SOURCES.md`.
- [ ] **Step 5: Build `Margins.jsx`** and the `.obj` CSS: position from the `--from-*` variables, posters with paper tint, 1 px ink border, small shadow, rotations -3, 2, -2, 3 degrees.
- [ ] **Step 6: Screenshot at 1512**, compare with `v9-pad.jpg`: four smaller stickers evenly spaced between top 6 and 50, posters in Garvit's positions.
- [ ] **Step 7: `npm run build`, commit** `feat: halftone sticker tool, margin stickers and posters`

### Task 9: Creative mode: the flip and the travelers

**Files:**
- Create: `src/styles/creative.css`, `src/lib/mode.js`, `tests/lib/mode.test.js`, `src/creative/Stage.jsx`
- Modify: `src/App.jsx`, `src/pad/Nav.jsx` (button label `creative mode` / `back to the pad`)

**Interfaces:**
- `src/lib/mode.js`: `createModeStore()` returns `{ get(), set(mode), toggle(), subscribe(fn) }`; `lockScroll()` / `unlockScroll()` set and remove `document.body.style.overflow = "hidden"` and are idempotent. `enterCreative()` scrolls to top (`scrollTo({top:0, behavior:"smooth"})` unless already `< 2px`), then locks scroll.
- CSS, keyed on `.stage[data-mode="creative"]`:
  - `.sheet { transform-style: preserve-3d; transform-origin: 50% 39cqw; transition: transform 1.5s cubic-bezier(.6,0,.25,1) }` and in creative `transform: translateY(6cqw) scale(0.62) rotateX(54.7deg) rotateZ(-45deg)`; `.poster { overflow: hidden }` in creative; `.body` hidden in creative; `.ink` (all pad text) `opacity: 0.18`.
  - `.obj { transform-origin: 50% 100%; transition: left 1.5s, top 1.5s, width 1.5s, transform 1.5s }`; in creative `left: calc(var(--to-x) * 1cqw); top: calc(var(--to-y) * 1cqw); width: calc(var(--to-w) * 1cqw); transform: rotateZ(45deg) rotateX(-54.7deg); background: transparent; box-shadow: none`.
  - `.obj .flat` fades out at delay 0.5 s; `.obj .iso` fades in at delay 0.9 s (Task 10 adds `.iso`).
  - Stage background `var(--stage)`; `@media (prefers-reduced-motion: reduce)` sets every transition here to `opacity 300ms` only and the sheet jumps to its landed transform.

- [ ] **Step 1: Write failing tests** `tests/lib/mode.test.js`: `toggle()` twice returns to `"pad"`; `lockScroll(); lockScroll(); unlockScroll()` leaves `document.body.style.overflow === ""`; `subscribe` fires once per change.
- [ ] **Step 2: Run `npm test`**. Expected: FAIL.
- [ ] **Step 3: Implement `mode.js`**. Run tests. Expected: PASS.
- [ ] **Step 4: Write `creative.css` and `Stage.jsx`** (wraps the sheet, reads the store, writes `data-mode`, calls `enterCreative`/`unlockScroll`). Wire the Nav button. Add `?mode=creative` support in `App` for screenshots.
- [ ] **Step 5: Screenshot** at 1512: `?mode=creative` after 2 s. Compare with `pad-mockups/v13-landed-c.jpg`: sheet lies as an isometric floor, text faint, all eight travelers sitting upright at their `to` positions (still as flat images, since drawings come in Task 10), posters stacked at the corkboard spot. Also capture a frame at 0.7 s to confirm one continuous motion.
- [ ] **Step 6: `npm test`, `npm run build`, commit** `feat: creative mode flip with travelers`

### Task 10: Stations on the floor, labels, proximity cards

**Files:**
- Create: `src/creative/Floor.jsx`, `src/creative/StationLabel.jsx`, `src/creative/StationCard.jsx`, `src/lib/floor.js`, `tests/lib/floor.test.js`
- Modify: `src/pad/Margins.jsx` (render the matching station `Component` inside each `.obj` as `.iso`), `src/styles/creative.css`

**Interfaces:**
- `src/lib/floor.js`: `FLOOR = { w: 100, h: 78 }`; `onPad(p) -> boolean`; `TILE = 6`; `tileKey(p) -> "cx,cy"` (tile column and row containing `p`, integers, negatives allowed); `tilesAround(p) -> string[]` (the 3 by 3 tile keys around `p`); `collides(p, footprint) -> boolean`; `resolveCollision(from, to, footprints) -> p` (returns `from` if `to` collides); `nearestStation(p, stations, radius = 6) -> station | null` measured to footprint center; `zIndexFor(footprintTopY, feetY) -> number` (`feetY > footprintTopY` ? in front : behind, as integer 10 or 1).
- `Floor.jsx` renders stations that have no traveler (desk, plants, kitchen) as `.obj.iso-only` at their `pos`, with a stroke-dashoffset draw-on from 0.9 s to 1.6 s in creative mode.
- `StationLabel`: Gloria 1.9cqw, `left: 100%; bottom: 0.3cqw; translate(1.2cqw, 0)`, ink; `active` adds an underline.
- `StationCard`: paper card above the station with one line and the station `link` (opens in a new tab if absolute; otherwise sets mode to `pad` then scrolls to the id). Kitchen receives `active` so its animation runs.

- [ ] **Step 1: Write failing tests** `tests/lib/floor.test.js`: `onPad({x:-5,y:90})` is false and `onPad({x:50,y:40})` true; `tileKey({x:-5,y:90})` equals `"-1,15"`; `tilesAround({x:3,y:3})` has 9 keys including `"-1,-1"` and `"1,1"`; `collides({x:30,y:46}, {x:28,y:44,w:12,h:6})` true, `{x:60,y:60}` false; `nearestStation({x:34,y:52}, STATIONS)` returns `chess`; `nearestStation({x:50,y:70}, STATIONS)` is `null`; `zIndexFor(44, 50) === 10`, `zIndexFor(44, 40) === 1`.
- [ ] **Step 2: Run `npm test`**. Expected: FAIL.
- [ ] **Step 3: Implement `floor.js`**. Run tests. Expected: PASS.
- [ ] **Step 4: Build `Floor.jsx`, `StationLabel.jsx`, `StationCard.jsx`**; mount station components inside travelers as `.iso` (width 210 percent of the `.obj`, anchored at the bottom center, per the mockup).
- [ ] **Step 5: Screenshot** `?mode=creative` at 1512 after 2 s and compare with `v13-landed-c.jpg`: eight hairline drawings with labels at ground level, no overlaps, chess and gym at the front, nothing off the paper. Adjust `pos` values if two stations overlap and record changes in `stations/index.js`.
- [ ] **Step 6: `npm test`, `npm run build`, commit** `feat: stations on the floor with labels and proximity cards`

### Task 11: The figure, first version: code-animated, controlled, wandering

**Files:**
- Create: `src/creative/Figure.jsx`, `src/creative/useFigure.js`, `src/lib/figure.js`, `tests/lib/figure.test.js`
- Modify: `src/creative/Floor.jsx`, `src/pad/Margins.jsx` (the polaroid traveler's `.iso` is the figure's start marker; the figure appears at `polaroid.to` at 0.9 s)

**Interfaces:**
- `src/lib/figure.js` (pure):
  - `SPEED = 9` (cqw per second), `IDLE_RESUME_MS = 6000`, `PAUSE_MS = 1500`.
  - `initialFigure(start) -> { pos, facing: "dl"|"dr"|"ul"|"ur", frame: 0, control: "idle"|"user", idleIndex: 0, pauseLeft: 0, sinceInput: 0, target: null }`.
  - `keyToDir(key) -> { dx, dy } | null`: `ArrowUp`/`w` `{0,-1}`, `ArrowDown`/`s` `{0,1}`, `ArrowLeft`/`a` `{-1,0}`, `ArrowRight`/`d` `{1,0}`; diagonals from two keys are normalized by the caller.
  - `TILE_FADE_MS = 4000`, `RESPAWN_MS = 1000`, `initialFigure` also holds `tiles: Map<key, lastSeenMs>`, `falling: false`, `fallLeft: 0`, `now: 0`.
  - `stepFigure(state, input: { dir: {dx,dy} | null, tapTarget: {x,y} | null, dt: seconds }, ctx: { stations, footprints }) -> state`: user input moves `SPEED * dt` along `dir`, sets `control: "user"`, resets `sinceInput`; `tapTarget` walks toward it; no input for `IDLE_RESUME_MS` returns to `control: "idle"`, which walks to `stations[idleIndex].footprint` edge, pauses `PAUSE_MS`, advances `idleIndex` modulo length. Every step applies `resolveCollision`. The figure may leave the pad: when `!onPad(pos)`, every key in `tilesAround(pos)` is set to `now` in `tiles`; tiles whose `lastSeen` is older than `TILE_FADE_MS` are removed; if `!onPad(pos)` and `tileKey(pos)` is not in `tiles`, `falling` becomes true for `RESPAWN_MS`, after which `pos` is the desk station's front edge, `control` is `"idle"`, `idleIndex` is 0 and `tiles` is empty. `frame` advances every 0.12 s while moving, resets to 0 when still. `facing` from the sign of movement.
  - Tile rendering (in `Floor.jsx`): each key in `state.tiles` is a 6 by 6 dotted-paper square at floor position `(cx*6, cy*6)` with a stroke draw-on when it appears and `opacity` falling from 1 to 0 over the last 1.5 s before `TILE_FADE_MS`. The falling figure plays a 1 s tumble and dissolve (CSS keyframes on the figure group: rotate, drop 6cqw, break into dots via `stroke-dasharray`).
- `useFigure(stationsRef, active)` runs the `rAF` loop only while `active`, attaches `keydown`/`keyup` on `window` and `pointerdown` on the floor, converts tap screen points to floor space by inverting the sheet transform (`getScreenCTM` on an SVG overlay the size of the floor), and tears everything down when `active` turns false.
- `Figure.jsx` props `{ state }`: 7cqw tall drawn figure (head, hoodie torso, limbs swung by `frame`), positioned with `left`/`top` from `state.pos`, `z-index` from `zIndexFor`.

- [ ] **Step 1: Write failing tests** `tests/lib/figure.test.js`:
  - right arrow for 1 s moves `pos.x` by 9 and sets `facing` to `"dr"`;
  - idle with no input for 6 s after a user input flips `control` back to `"idle"`;
  - a step from `{x: 99, y: 77}` with `dir {1,1}` leaves the pad and adds nine tiles to `state.tiles`;
  - standing off the pad and stepping with `dt: 60` (one minute) sets `falling` once, and a further step with `dt: 1.1` puts `pos` at the desk front edge with `control: "idle"` and `tiles.size === 0`;
  - a step into the chess footprint is refused (`pos` unchanged);
  - `keyToDir("w")` equals `{dx:0, dy:-1}`, `keyToDir("x")` is `null`.
- [ ] **Step 2: Run `npm test`**. Expected: FAIL.
- [ ] **Step 3: Implement `figure.js`**. Run tests. Expected: PASS.
- [ ] **Step 4: Write a hook test** `tests/creative/useFigure.test.jsx`: render a component using `useFigure` with `active: true`, then re-render with `active: false`; assert `window` has no `keydown` listener left (spy on `addEventListener`/`removeEventListener` counts match) and `cancelAnimationFrame` was called.
- [ ] **Step 5: Implement `useFigure.js` and `Figure.jsx`**; mount in `Floor.jsx`. Run tests. Expected: PASS.
- [ ] **Step 6: Screenshot** `?mode=creative` at 3 s and 8 s: figure visible, at a different station in each; press ArrowRight via Playwright for 1 s and screenshot: figure moved right along the floor axis (down-right on screen). Walk it to the kitchen: lid lifts, steam shows, card appears. Walk it off the bottom edge for 3 s: dotted tiles sketch in around it; stand still 5 s: tiles fade, it tumbles and reappears at the desk.
- [ ] **Step 7: `npm test`, `npm run build`, commit** `feat: walkable figure with idle route, keyboard and tap controls`

### Task 12: Sprite-sheet figure

**Files:**
- Create: `src/creative/figure-sprites.svg` (symbol sheet, 20 symbols: `f-{dl|dr|ul|ur}-{idle|w1|w2|w3|w4}`), `docs/superpowers/reference/figure-brief.md`
- Modify: `src/creative/Figure.jsx` (use `<use href>` by `facing` and `frame`), `tests/creative/figure-sprites.test.js` (create)

**Interfaces:**
- Consumes `state.facing` and `state.frame` from Task 11; `frame` 0 is idle, 1 to 4 are walk frames.

- [ ] **Step 1: Write the failing test**: parse `figure-sprites.svg` as text and assert all 20 symbol ids exist.
- [ ] **Step 2: Run `npm test`**. Expected: FAIL.
- [ ] **Step 3: Write `figure-brief.md`** from the spec 5.5 (hairline, hair, glasses if Joshua wears them, plain hoodie, four isometric facings) with `public/headshot.jpg` as the reference, then draw the 20 symbols with the chosen skill. If the skill cannot produce a consistent set, generate a four-view line sheet with an image model from the brief and trace it to SVG paths; the committed result is SVG either way.
- [ ] **Step 4: Switch `Figure.jsx` to the sprites**, keep the code-animated drawing behind a `FIGURE_SPRITES = true` constant for one commit only, then delete it in the same task.
- [ ] **Step 5: Screenshot** the figure walking in all four facings (drive with arrow keys). Each facing must look like the same person.
- [ ] **Step 6: `npm test`, `npm run build`, commit** `feat: sprite-sheet figure`

### Task 13: Phone stage and reduced motion

**Files:**
- Create: `src/creative/PhoneStage.jsx`
- Modify: `src/creative/Stage.jsx`, `src/styles/sheet.css` (`@media (max-width: 819px)` hides `.margin`, body full width with 16 px gutters), `src/styles/creative.css`

**Interfaces:**
- `PhoneStage` renders a fixed, viewport-centered blank dotted sheet with `aspect-ratio: 100 / 78`, `width: 100vw`, containing `Floor` with all eight stations (no travelers) and the figure, tap-driven; shown only when `matchMedia("(max-width: 819px)")` matches and mode is creative; page content fades to 0 under it.

- [ ] **Step 1: Implement `PhoneStage.jsx`** and the media queries.
- [ ] **Step 2: Screenshot** at 390x844: pad view has no margins and no horizontal scroll; `?mode=creative` shows the flipped blank sheet with stations drawn on and the figure; tapping the floor (Playwright `browser_click` at a floor point) moves the figure.
- [ ] **Step 3: Emulate reduced motion** (`browser_emulate_media` reducedMotion) and screenshot at 1512 `?mode=creative` at 0.4 s: already landed, no mid-flip frame. Confirm `audio.play` is a no-op by checking no `<audio>` element plays (`document.querySelectorAll("audio").length === 0`).
- [ ] **Step 4: `npm test`, `npm run build`, commit** `feat: phone creative stage and reduced-motion path`

### Task 14: Content pass (blocked on Joshua's resume and assets)

**Files:**
- Modify: `src/content/data.js`, `public/logos/`, `public/previews/`, `public/demos/`, `public/posters/`, `public/stickers/`, `public/headshot.jpg`

- [ ] **Step 1: Experience rows from the resume**, one logo per company and school as SVG or grayscale PNG in `public/logos/`, one photo per row in `public/previews/`.
- [ ] **Step 2: Projects**: Forge and the picked projects, mp4 demos 10 to 20 s in `public/demos/` (if total `public/` exceeds 25 MB, move demos to Vercel Blob and store URLs in `data.js`), poster frames in `public/previews/`.
- [ ] **Step 3: Replace stand-ins**: real sticker photos through `tools/halftone.html` (king, Novablast, library, Dutch oven if used), the four posters, book titles in `READING` and on the library station's top shelf, the intro paragraph in Joshua's words, final headshot.
- [ ] **Step 4: Screenshot the pad at 1512 and 390 and creative mode at 1512**; check every hover preview resolves (no 404 in the network log).
- [ ] **Step 5: `npm test`, `npm run build`, commit** `feat: real content from resume and assets`

### Task 15: Cutover steps (write, do not run)

**Files:**
- Create: `docs/superpowers/plans/2026-10-28-cutover.md`
- Modify: `CLAUDE.md` (final state)

- [ ] **Step 1: Write the cutover document**: open a PR from `rebuild/personal-pad` to `main` with the PR footer from the repo rules; Vercel preview check list (pad at 1512 and 390, creative mode, hover previews, sounds after a gesture, Lighthouse performance at or above 90 on mobile); merge; verify production; tag `release/personal-pad-v1`.
- [ ] **Step 2: Update `CLAUDE.md`** "Current Working State" to the shipped layout (`src/pad`, `src/creative`, `src/lib`) and the test command.
- [ ] **Step 3: Commit** `docs: cutover steps and final project state`. Stop here. The merge itself waits for Joshua's explicit go.
