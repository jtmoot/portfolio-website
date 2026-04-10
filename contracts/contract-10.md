## Contract 10: Install Core Animation Libraries

**Goal:** Add the animation library stack without breaking anything. No visual changes yet — just install and verify imports work.

**Prerequisite:** Contracts 0–9 complete.

**Acceptance Criteria:**

- [ ] Install these exact packages:
  ```bash
  npm install motion @motionone/utils gsap @gsap/react lenis @studio-freight/react-lenis split-type atropos canvas-confetti
  ```
- [ ] Create `src/lib/gsap.js` — GSAP setup file:
  - Import and register ScrollTrigger plugin
  - Export configured gsap instance
- [ ] Create `src/lib/lenis.js` — Lenis setup file:
  - Export a `LenisProvider` component that wraps children with smooth scroll
  - Integrate Lenis with GSAP's ticker so ScrollTrigger stays in sync
  - Respect `prefers-reduced-motion` — disable Lenis if user prefers reduced motion
- [ ] Wrap `<App>` with LenisProvider in `main.jsx`
- [ ] Verify: `npm run dev` starts without errors
- [ ] Verify: `npm run build` completes without errors
- [ ] Verify: smooth scrolling works in the browser (scroll feels buttery/inertial)
- [ ] Verify: all existing features still work (dark mode, card tilt, scroll reveals, timeline)

**What NOT to do:**

- Don't use any of the new libraries in components yet — just install and set up providers
- Don't change any existing animations
- Don't add Tailwind or any CSS framework
- Don't install React Three Fiber yet (that's a later contract)

**Verify:** Site works identically to before but scrolling feels smoother. `npm run build` succeeds. Check console for zero errors.
