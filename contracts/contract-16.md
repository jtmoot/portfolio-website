## Contract 16: Agent Swarm 3D Visualizer

**Goal:** An interactive 3D node graph of the Marcus agent hierarchy using React Three Fiber.

**Prerequisite:** Contract 10 complete.

**Acceptance Criteria:**

- [ ] Install 3D packages:
  ```bash
  npm install three @react-three/fiber @react-three/drei
  ```
- [ ] `src/components/AgentSwarm3D.jsx`:
  - Lazy-loaded with `React.lazy()` and `<Suspense fallback={<AgentSwarmFallback />}>`
  - Fallback: a static SVG version of the node graph (simple, no 3D)
- [ ] 3D scene contents:
  - Central node: "Marcus" — larger sphere or rounded box, distinct color
  - 4 child nodes orbiting around Marcus:
    - Research Digest Agent
    - Job Scraper Agent
    - Code Review Agent
    - Daily Briefing Agent
  - Each node: `<Drei.Float>` for gentle bobbing
  - Connection lines between Marcus and each child: animated dashed lines
  - Small particles traveling along connections (tiny spheres with `useFrame` animation)
- [ ] Interactivity:
  - `<Drei.OrbitControls>` — user can rotate/orbit the graph (no zoom, constrained rotation)
  - Hover a node → node glows brighter, HTML tooltip appears (via `<Drei.Html>`) showing agent description:
    - Research: "Scrapes arXiv, summarizes papers, delivers via Gmail"
    - Scraper: "Monitors Greenhouse/Lever/Ashby APIs for ML roles"
    - Code Review: "Reviews PRs, suggests improvements via GitHub"
    - Briefing: "Morning summary: weather, news, papers via email"
  - Click node → tooltip stays visible until clicking elsewhere
- [ ] Performance:
  - `<Drei.useDetectGPU>` — if GPU is low-tier, render fallback SVG instead
  - Canvas only renders when section is in viewport (use `frameloop="demand"` or intersection observer to pause)
  - Total poly count kept low — spheres with `args={[1, 16, 16]}` not `args={[1, 64, 64]}`
- [ ] Grid placement: `grid-column: span 8`, after research card
- [ ] Section label: "Agent Architecture"
- [ ] Works in dark mode — adjust material colors based on theme
- [ ] `@media (prefers-reduced-motion: reduce)` — show static fallback, no 3D

**What NOT to do:**

- Don't use a graph visualization library — build the layout manually in R3F
- Don't add more than 5 nodes
- Don't add zoom or pan — just orbit rotation
- Don't make the canvas full-screen — it sits inside a bento card
- Don't add post-processing effects (bloom, DOF) — too heavy

**Verify:** Scroll to the agent section — 3D graph loads (may take a moment). Drag to orbit — graph rotates smoothly. Hover a node — tooltip appears with description. Test on a low-end device — should show SVG fallback. Dark mode — colors adapt. Check performance — no dropped frames during orbit.
