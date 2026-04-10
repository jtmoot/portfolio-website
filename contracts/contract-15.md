## Contract 15: CLI Easter Egg Terminal

**Goal:** Press backtick to open a terminal overlay with fun commands.

**Prerequisite:** Contract 10 complete.

**Acceptance Criteria:**

- [ ] `src/components/Terminal.jsx`:
  - Hidden by default, toggled by pressing ` (backtick) key
  - Slides down from top with GSAP: `gsap.from(el, { y: -300, duration: 0.4, ease: "back.out(1.5)" })`
  - Dark terminal: #0a0a0a background, green (#4ade80) text, monospace font
  - Max height: 300px, full width, z-index: 2000
  - Command input at bottom with blinking cursor: `joshua@portfolio:~$ `
  - Output area above (scrollable)
  - Press Esc or backtick again to close (GSAP exit animation)
- [ ] Supported commands:
  - `help` — lists available commands
  - `about` — prints a short bio
  - `projects` — lists projects, smooth-scrolls to projects section
  - `skills` — lists tech stack
  - `contact` — prints email + LinkedIn + GitHub
  - `music` — prints "Currently vibing to: Fred again.., Bicep, Disclosure"
  - `clear` — clears output
  - `sudo hire joshua` — triggers canvas-confetti + prints "Permission granted. Sending offer letter... ✓"
  - `ls` — prints section names
  - `forge status` — pings Forge deployment, shows "🟢 Live (142ms)" or "🔴 Offline"
  - Unknown: `command not found: {cmd}. Type 'help' for available commands.`
- [ ] Command history with up/down arrow keys
- [ ] Auto-focus input when terminal opens
- [ ] Only activates on backtick when no other input is focused
- [ ] `@media (prefers-reduced-motion: reduce)` — instant show/hide, no animation

**What NOT to do:**

- Don't add real shell execution
- Don't make terminal resizable or draggable
- Don't persist terminal state across sessions

**Verify:** Press `→ terminal slides down with bounce. Type`help`. Type `sudo hire joshua`→ confetti. Type`forge status` → pings real URL. Press Esc → terminal exits. Click in a text input → backtick types normally.
