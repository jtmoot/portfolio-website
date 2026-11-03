# Pad feedback, round 8 (plan, awaiting approval)

Branch: `rebuild/personal-pad`. Same rules: TDD, screenshots in day and night on desktop and phone,
`npm test` and `npm run build` green before each commit. After this round the site goes live on
`main` (Joshua's call, Nov 3).

Measured on Nov 3 at 1440 x 900:
- The gap from the social links to the Experience heading is 114 px (100 px at 1280).
- Leadership starts 3,032 px down and Contact 3,276 px down, but the page only scrolls to 2,640 px.
  So their tops stop at 43% and 70% of the window. The index only marks a section whose top crosses
  20–30%, so those two can never be marked.

## Main page

### 1. The shelf icon
It's too small and sits on its own in the right margin. Three ways to show it:

- **A. Join the index (recommended).** The shelf is navigation, like the index, so it sits at the
  bottom of the left index under a hairline, in the same type, with the book drawing at text size:

  ```
    — Experience
    — Projects
    — Leadership
    — Contact
    ─────────
    ▥ Shelf  ↗
  ```

  The right margin is then empty, which keeps the page calm.

- **B. A real little bookcase.** The icon becomes a 56 px drawing of four spines in the shelf's actual
  colours, with "Shelf" always shown under it. It stays in the right margin, level with the index.
  Hovering pulls one spine out a few pixels.

- **C. Remove it.** The nav pill already has "Shelf".

### 2. The index never marks Leadership or Contact
The line that decides "current" moves down the window as you near the bottom of the page. It stays at
25% for most of the page and slides to 100% over the last screenful of scrolling. At the very bottom,
Contact is marked. Leadership is marked while it's the last section whose top has crossed the line.
This works for any page height and needs no special cases.
- Test: in a fake 3,540 px page, the marked section follows scrolling, and Leadership and Contact
  are each marked at some scroll position.

### 3. The gap above Experience
Cut from max(5cqw, 56px) to max(3cqw, 40px). That's 43 px at 1440 and 40 px on smaller screens. It
keeps the round 6 rule that it never closes up in a browser that draws the intro larger.

### 4. The intro, about what you enjoy
Three drafts. None of them goes beyond what the resumes claim. Highlights in **bold**:

- **A.** I work on **ML infrastructure** and **agentic systems**, and I'm most interested in the
  frontier: what large language models can do next, and the hardware and software that make it
  possible. I'm finishing an MS in Electrical and Computer Engineering at **Carnegie Mellon**,
  focused on AI/ML systems. Outside of work, I lift, run, cook, read history and play chess.
- **B. (recommended; keeps your current job in one clause).** I build **ML infrastructure** and
  **agentic systems**. What I enjoy most is the frontier: what LLMs can newly do, and the hardware
  and software underneath that make it possible. I'm finishing an MS in Electrical and Computer
  Engineering at **Carnegie Mellon** and interning at Core Natural Resources. Outside of work, I
  lift, run, cook, read history and play chess.
- **C. (shortest).** I'm interested in **ML infrastructure**, **agentic engineering**, and the
  hardware and software at the frontier of what LLMs can do. I'm finishing an MS in Electrical and
  Computer Engineering at **Carnegie Mellon**. Outside of work, I lift, run, cook, read history and
  play chess.

The "3,100 miners" detail stays in the Core bullets in Experience, where it belongs. The tests that
check the intro for "3,100" get updated.

## Creative mode

### 1. Walking through the plyo box and the reading chair
- **Chair:** the seat is left open on purpose so he can sit, which also lets him walk straight
  across it. The seat becomes a block like the others, and only his final step to sit down may
  enter it.
- **Plyo box (and any other strays):** a script projects every station drawing's floor-level parts
  (objects resting at z = 0) into floor units. A test then fails if any of them falls outside that
  station's footprint plus blocks. The gym's blocks grow to cover the box, and the test catches any
  other piece that's uncovered.
- Test: a walk across the room between every pair of stations never enters a block, except the seat
  when the target is the chair.

### 2. A greeting that catches the eye
- The wave starts only once the room has finished rising. Today part of it is spent during the
  1.5 s transition.
- **The gesture:** a small hop to get your attention (6 px up and back, once), then the arm goes up
  high and waves three times, larger than the current two-frame wave.
- **The bubble:** "Hello, Pittsburgh!" pops in with a small scale-up and stays for 5 s, up from 3 s.
  It then fades over 0.4 s rather than vanishing. It stays at least 2 s after he sets off walking,
  following his head.
- Reduced motion: no hop and no wave. The bubble shows for 5 s.

### 3. The station wording, plainer
Current copy, then a proposed replacement. Edit freely; I'll use your words.

| Station | Now | Proposed |
|---|---|---|
| Desk | Where the work happens. | My desk: two monitors, one laptop for work and one for school. |
| Library | The short library, mostly history. | A short bookcase, mostly history. |
| Plants | Two monsteras, a corn plant and a hosta. All thriving. | Two monsteras, a corn plant and a hosta, by the window. |
| Kitchen | Short ribs, low and slow. | Usually short ribs, braised in a Dutch oven. |
| Gym | Barbell, kettlebells, sprints, a weighted vest. | Where I train: barbell, kettlebells and sprints. |
| Chess | Rapid, as breakfast_enjoyer. | I play rapid on chess.com as breakfast_enjoyer. |
| Reading chair | The good chair, a lamp, and a cup of coffee. | Where I read, with a lamp and a coffee. |
| Corkboard | Pinned up: the podcasts on in the background. | The podcasts I listen to. |
| Brain chart | The brain, in sagittal section. | A chart of the brain, in cross-section. |

The buttons stay as they are: See experience, See the reading list, See my runs, Open chess.com,
See the shelf.

## Order
Main page 2 and 3 (bugs), then 4 and 1, then creative 1, 2 and 3. One commit each. Then the cutover
to `main`, following the original plan's Task 15.
