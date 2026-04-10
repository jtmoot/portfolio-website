## Contract 13: Pinned Horizontal Project Gallery

**Goal:** Transform the three project cards into a horizontal scroll gallery that pins to the viewport.

**Prerequisite:** Contract 12 complete.

**Acceptance Criteria:**

- [ ] Create `src/components/ProjectGallery.jsx`:
  - A full-width section that replaces the three individual `.project-card` divs in the grid
  - Grid placement: `grid-column: span 12`
  - Section header: "Projects" with same label styling as other sections
- [ ] GSAP ScrollTrigger horizontal pin:
  - Section pins to viewport while user scrolls vertically
  - Vertical scroll progress maps to horizontal translation of project cards
  - Cards slide from right to left as you scroll down
  - `pin: true`, `scrub: 1`, `snap: 1 / (numProjects - 1)` for section snapping
  - Scroll distance: approximately 1 viewport height per project card
- [ ] Each project card:
  - Takes up ~80% of viewport width, centered
  - Uses the existing Card component with Atropos depth layers
  - Includes all existing content: name, tagline, description, tech tags, status badge, links
- [ ] Navigation indicators:
  - Small dots at the bottom showing which card is active
  - Current dot is filled, others are outlined
  - Dots update as you scroll through
- [ ] Entry/exit transitions:
  - Cards entering from the right have slight scale-up (0.95 → 1.0) and opacity fade
  - Cards exiting to the left scale down slightly and fade
- [ ] Responsive:
  - Desktop: horizontal pin gallery
  - Mobile (<768px): fall back to vertical stacked cards (no pinning — ScrollTrigger pin breaks on mobile)
- [ ] Works in both light and dark mode

**What NOT to do:**

- Don't use a carousel library — this is pure GSAP ScrollTrigger
- Don't change the project data or content
- Don't make cards draggable
- Don't add swipe gestures (keep it scroll-driven)

**Verify:** Scroll to the projects section — viewport pins. Continue scrolling — projects slide horizontally. Dots update. Stop scrolling — everything freezes in place. Scroll past the last card — section unpins and normal scroll resumes. Test on mobile — should be vertical stack.
