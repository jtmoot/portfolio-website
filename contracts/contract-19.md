## Contract 19: Now Playing + Audio Visualizer Widget

**Goal:** A card with a fake audio waveform bar visualizer showing current music taste.

**Prerequisite:** Phase 1 complete.

**Acceptance Criteria:**

- [ ] `src/components/NowPlaying.jsx`:
  - Bento grid card: span 4
  - Section label: "Now"
  - Rotating content (crossfade every 4 seconds):
    - Listening to: "Fred again.. — Actual Life 3" with waveform bars
    - Reading: "Designing Data-Intensive Applications"
    - Building: "Autonomous agent evaluation framework"
  - When "Listening" is shown: 12 small vertical bars animate at different heights/speeds
    - Bars: 3px wide, 8-24px tall, CSS animation with random duration (0.3-0.8s)
    - Color: accent color from theme
    - Animation: each bar bounces between a random min and max height
  - `@media (prefers-reduced-motion: reduce)` — bars static at random heights, no rotation
- [ ] Crossfade between items: 0.3s opacity transition
- [ ] Works in dark mode

**What NOT to do:**

- Don't use Web Audio API or play actual audio
- Don't integrate Spotify API
- Don't make items clickable
- Don't use more than 3 rotation items

**Verify:** Card shows rotating content with crossfade. When "Listening" shows, bars animate like an equalizer. Dark mode — colors adapt. Reduced motion — static display.
