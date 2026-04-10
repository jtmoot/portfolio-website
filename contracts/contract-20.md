## Contract 20: Film Grain + Visual Polish Pass

**Goal:** Add subtle film grain texture, final animation polish, and performance audit.

**Prerequisite:** All previous contracts complete.

**Acceptance Criteria:**

- [ ] Film grain overlay:
  - CSS-only noise texture: a small noise PNG (or CSS generated) at `opacity: 0.03` in light mode, `0.05` in dark
  - `position: fixed`, `pointer-events: none`, `z-index: 9999`
  - Covers entire viewport
  - Subtle CSS animation: shifts background-position slightly every frame for a "living" noise feel
  - `@media (prefers-reduced-motion: reduce)` — static grain, no animation
- [ ] Performance audit:
  - Run Lighthouse in Chrome DevTools
  - Ensure Performance score > 85
  - Ensure all images/3D content is lazy-loaded
  - Ensure no layout shift (CLS < 0.1)
  - Fix any render-blocking resources
- [ ] Animation polish:
  - Ensure all GSAP ScrollTrigger animations clean up on unmount
  - Ensure Lenis doesn't conflict with horizontal scroll pin
  - Test the full scroll journey top to bottom — no jank, no glitches
  - Ensure dark mode toggle doesn't break any GSAP animations
- [ ] Accessibility:
  - All interactive elements keyboard-accessible
  - All animations respect `prefers-reduced-motion`
  - Alt text on all visual elements
  - Focus indicators visible in both themes

**What NOT to do:**

- Don't add new features
- Don't change layouts or content
- Don't spend time on IE/Safari edge cases beyond reasonable effort

**Verify:** Full scroll journey from top to bottom is smooth. Lighthouse > 85 performance. Film grain barely visible — you have to look for it. Dark mode toggle works cleanly. Tab through the page — focus indicators visible.
