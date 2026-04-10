## Contract 11: Upgrade Card Tilt to Atropos 3D Layers

**Goal:** Replace the custom CSS tilt with Atropos for parallax depth-layered cards.

**Prerequisite:** Contract 10 complete.

**Acceptance Criteria:**

- [ ] Remove the custom tilt logic from `Card.jsx` (mousemove/perspective transforms)
- [ ] Wrap each project card content in `<Atropos>` component with configuration:
  - `shadow: false`
  - `highlight: false` (we'll add our own subtle light effect)
  - `rotateXMax: 5`, `rotateYMax: 5`
- [ ] Add depth layers to project cards using `data-atropos-offset`:
  - Background/card body: `data-atropos-offset="-2"` (pushes back)
  - Main text content: `data-atropos-offset="0"` (neutral)
  - Status badge: `data-atropos-offset="5"` (floats forward)
  - Tech tags: `data-atropos-offset="3"` (slight float)
  - Action links (Live Demo, Code): `data-atropos-offset="4"`
- [ ] Import Atropos CSS: `import 'atropos/css'`
- [ ] Non-project cards (stats, skills, education, etc.) keep simple Atropos tilt without depth layers — just basic `rotateXMax: 3`
- [ ] `@media (hover: none)` — Atropos disabled on touch devices
- [ ] `@media (prefers-reduced-motion: reduce)` — Atropos disabled
- [ ] All links and buttons inside cards remain clickable
- [ ] Dark mode: Atropos works correctly in both themes

**What NOT to do:**

- Don't add Atropos shadow or highlight — keep it clean
- Don't change card layout, content, or grid
- Don't add Atropos to the ThemeToggle

**Verify:** Open http://localhost:5173 in Chrome. Hover over a project card — the status badge should visibly float above the card surface as you tilt. Tech tags should separate slightly from the background. The effect should feel premium, like holding a physical card. Test dark mode.
