## Contract 14: Magnetic CTA Buttons + Confetti

**Goal:** "Get in touch" and "View GitHub" buttons magnetically attract toward cursor, with confetti on CTA click.

**Prerequisite:** Contract 10 complete (GSAP + canvas-confetti installed).

**Acceptance Criteria:**

- [ ] `src/components/MagneticButton.jsx`:
  - Wraps any button/link element
  - On mousemove within 80px radius: button translates toward cursor position
  - Translation: proportional to distance, max 12px offset
  - Uses `gsap.to()` for smooth movement with `duration: 0.3, ease: "power2.out"`
  - On mouseleave: button snaps back to center with `gsap.to()` spring-like ease
  - `@media (hover: none)` — disabled on touch
- [ ] Apply MagneticButton to:
  - "Get in touch" button in the connect card
  - "View GitHub" button in the connect card
  - "Live Demo" links on project cards
- [ ] Confetti on "Get in touch" click:
  - Import canvas-confetti
  - On click: fire confetti burst from the button's position
  - Confetti config: `{ particleCount: 80, spread: 60, origin: { y: 0.8 } }`
  - Confetti fires BEFORE the mailto link opens (use a small setTimeout)
- [ ] Confetti does not fire on other buttons — only the "Get in touch" CTA
- [ ] Confetti respects `prefers-reduced-motion` — skip if reduced motion preferred
- [ ] Button still functions normally (link opens) after the magnetic + confetti effects

**What NOT to do:**

- Don't apply magnetic effect to every link on the page — just CTAs
- Don't add confetti to dark mode toggle or other buttons
- Don't make magnetic pull too strong — subtle is key
- Don't install any cursor library — this is just for buttons

**Verify:** Move cursor near "Get in touch" — button slides toward you. Click it — confetti bursts, then mailto opens. Move cursor away — button smoothly returns to center. Test "Live Demo" link — magnetic pull but no confetti.
