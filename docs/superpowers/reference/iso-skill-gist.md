# isometric-objects: a free skill for drawing isometric figures with code

A skill file you drop into Claude Code, Cursor, or Codex. Ask for an object, get a clean isometric figure in the dark hairline "technical drawing" style, as SVG or canvas code. Ask for motion, get a seamless loop.

Everything in this gist was made with it. No hand-drawn lines.

## Install

**Claude Code** (personal, all projects):

```sh
mkdir -p ~/.claude/skills/isometric-objects
curl -sL https://gist.githubusercontent.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee/raw/01-SKILL.md -o ~/.claude/skills/isometric-objects/SKILL.md
```

Or use `.claude/skills/isometric-objects/SKILL.md` inside a repo to share it with a team. Then call it with `/isometric-objects ...` or just ask for an isometric figure.

**Cursor**: save `01-SKILL.md` as `.cursor/rules/isometric-objects.mdc` (or paste it into a rule).

**Codex / anything else**: paste `01-SKILL.md` into the chat or your `AGENTS.md`.

## Try these prompts

```
/isometric-objects an old desk computer with a CRT, a keyboard and a coiled cable. Screen glows orange.
/isometric-objects a server rack with blinking LEDs. Make it a 10 second seamless loop.
/isometric-objects exploded view of a film camera, parts separate on z with labels, then reassemble. Loop it.
/isometric-objects 3 small looping figures for my landing page that match my site's colors (read globals.css)
```

## What the skill does differently

- Models objects in 3D units and projects every point with one `iso()` function. No eyeballed angles.
- Three tones per material, three line weights, one accent color, glow only on the focal point.
- Clips details to their face so small parts never bleed across edges.
- Drives all motion from one loop phase `p` with integer cycles, so loops are actually seamless.
- Exposes `render(p)`, which means the same code plays live and records frame-exact video.

## Files

| file | what |
|---|---|
| `01-SKILL.md` | The skill. This is the part you need. |
| `hero.html` | 12 s launch loop: desk computer, exploded view, 7 more figures, grid, end card. Double-click to open. |
| `wave.html` | 12x12 columns on an interference wave. |
| `city.html` | Data-city block with LEDs, fans, packets. |
| `stairs.html` | Penrose stairs with a cube that climbs forever. |
| `iso.js` | Dependency-free helpers: projection, boxes, insets, vents, cylinders, helix, grids, depth sort, easing, seeded random. |
| `stage.js` | Canvas pen, figure frame, and player used by the demos. |
| `record.mjs` | Records any demo to mp4 with Playwright + ffmpeg, frame-exact. |
| `IsoShift.tsx`, `IsoFrame.tsx`, `iso.ts`, `useLoopPhase.ts` | A React/SVG version as used on krischase.com: themeable with CSS vars, pauses off-screen, respects reduced motion. |

HTML query params: `?w=1080&h=1350` size, `?p=0.3` freeze a frame, `?scale=2` pixel ratio.

Record a video:

```sh
npm i playwright && npx playwright install chromium
node record.mjs hero 1080 1350 hero.mp4      # put hero.html next to record.mjs
```

## Credit

The style and the idea of a dedicated isometric skill come from [@wheresryan22](https://x.com/wheresryan22/status/2106476722463900105), who showed his `/isometric-objects` skill on X. His file was not public when this was written, so this is an independent rewrite from studying his output. Go follow him; his version will be worth grabbing when it drops.

Made by [Kris Chase](https://krischase.com) ([@KrisRChase](https://x.com/KrisRChase)). Free to use, remix, and ship.
