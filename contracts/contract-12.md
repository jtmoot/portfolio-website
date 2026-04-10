## Contract 12: GSAP ScrollTrigger Scroll Enhancements

**Goal:** Upgrade scroll animations from basic IntersectionObserver to GSAP ScrollTrigger for smoother, scrubbed effects.

**Prerequisite:** Contract 10 complete.

**Acceptance Criteria:**

- [ ] Replace the custom `useScrollReveal` hook usage with GSAP ScrollTrigger animations using `useGSAP()` hook from `@gsap/react`
- [ ] Card entrance animations upgraded:
  - Use `gsap.from()` with `scrollTrigger` instead of IntersectionObserver
  - Add stagger within rows: `stagger: 0.08`
  - Use GSAP's ease: `ease: "power3.out"` for a smoother feel than CSS transitions
  - `start: "top 85%"` so cards trigger before fully in view
  - `once: true` — don't replay on scroll up
- [ ] Career timeline upgrade:
  - The timeline SVG line `stroke-dashoffset` is now scrubbed to scroll position via ScrollTrigger
  - `scrub: 1` — line draws smoothly tied to your exact scroll position
  - Nodes still pop in with stagger when the line reaches them
- [ ] Parallax background layer (if it exists from Contract 10):
  - Dot grid or subtle background element moves at 0.3x scroll speed via ScrollTrigger
- [ ] All ScrollTrigger instances cleaned up properly in useGSAP's cleanup
- [ ] Lenis and ScrollTrigger stay in sync (via the ticker integration from Contract 10)

**What NOT to do:**

- Don't add new sections or content
- Don't add horizontal scrolling yet (that's next)
- Don't import Motion yet for these — use GSAP for scroll, keep Motion for later

**Verify:** Open site in Chrome, scroll slowly. Cards should animate in more smoothly than before. Career timeline line should draw exactly with your scroll position — stop scrolling and the line stops. Scroll back up slightly and the line should retreat. No jank, 60fps.
