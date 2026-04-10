## Contract 9: Career Timeline Section

**Goal:** A horizontal timeline section that builds as you scroll, showing the journey from USC to CMU to future.

**Prerequisite:** Contract 8 complete (uses scroll reveal hook).

**Acceptance Criteria:**

- [ ] `src/components/CareerTimeline.jsx`:
  - New section added to the bento grid (span 12, placed after education card)
  - Horizontal timeline line with nodes at each milestone
  - Timeline data:
    ```
    2021: Started at USC — Computer Engineering
    2022: Sigma Phi Epsilon President
    2023: Multimodal Emotion Recognition Research
    2024: STM Image Analysis · Enhanced SayCan Framework
    2025: Graduated USC (3.89 GPA) · Started CMU MS ECE
    2026: Building Forge · Marcus Agent Swarm · Job Search
    2027+: ML Systems Engineer → Tech Lead → ???
    ```
  - Each node: circle on the timeline, label above/below (alternating), short description
  - Future nodes (2027+) styled differently: dashed line, muted colors, "?" icon
- [ ] Scroll-driven reveal:
  - Timeline line draws from left to right as user scrolls (CSS stroke-dashoffset animation triggered by IntersectionObserver)
  - Each node fades in sequentially as the line reaches it
  - Use the useScrollReveal hook with lower threshold for progressive reveal
- [ ] Current year (2026) node highlighted with accent color and subtle pulse
- [ ] Responsive:
  - Desktop: horizontal timeline
  - Mobile (<580px): switches to vertical timeline (nodes stacked)
- [ ] Works in both light and dark mode
- [ ] `@media (prefers-reduced-motion: reduce)` — all nodes visible immediately, line fully drawn

**What NOT to do:**

- Don't use D3 or any charting library — pure CSS + SVG
- Don't make nodes clickable (no navigation)
- Don't add photos or logos to nodes
- Don't make the timeline draggable or horizontally scrollable

**Verify:** Scroll to timeline section — line draws across, nodes appear sequentially. Current year pulses. Switch to mobile — vertical layout. Toggle dark mode — colors adapt.
