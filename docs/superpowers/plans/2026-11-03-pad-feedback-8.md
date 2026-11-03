# Pad feedback, round 8 (plan, decisions settled Nov 3)

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

- **A. Join the index (chosen).** The shelf is navigation, like the index, so it sits at the
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

### 4. The intro
Settled after several drafts: it leads with the direction (serving and production agents) and stays
within the resumes. Highlights in **bold**:

> I enjoy building the **systems around models**: inference that runs faster and cheaper, and
> **agents** that hold up in production. I'm finishing an MS in Electrical and Computer Engineering
> at **Carnegie Mellon** and interning at Core Natural Resources. Outside of work, I lift, run,
> cook, read history and play chess.

- The role line stays "ML systems and AI engineer".
- "3,100 miners" stays in the Core bullets; the intro tests change to match.

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
- **The gesture (no hop):** the arm comes up high and holds for a beat, then gives a few broad,
  unhurried waves. A new raised-arm frame joins the two wave frames.
- **The bubble:** "Hello, Pittsburgh!" pops in with a small scale-up, stays for 5 s (up from 3 s),
  then fades over 0.4 s. It follows his head if he sets off before it's gone.
- Reduced motion: no wave; the bubble shows for 5 s.

### 3. The station wording (Joshua's lines)

| Station | Line |
|---|---|
| Desk | Building, one day at a time. |
| Library | A short bookcase, mostly contained within my Kindle now. |
| Plants | All thriving: monsteras, a dracaena, a hosta and a money tree. |
| Kitchen | Short ribs, braised in my Dutch oven. |
| Gym | Functional fitness, always. |
| Chess | A Caro-Kann type of guy. |
| Reading chair | Coffee usually. Tea sometimes. Bone broth occasionally. |
| Corkboard | Highly recommended! |
| Brain chart | No card. |

The buttons stay as they are: See experience, See the reading list, See my runs, Open chess.com,
See the shelf.

### 4. A money tree in the plants corner
- A braided-trunk money tree (Pachira) in its own pot by the window, drawn in the plants station
  with the same detail as the monsteras.
- Its floor footprint is added to the plants' blocks, and the collision test from item 1 covers it.

## Order
Main page 2 and 3 (bugs), then 4 and 1, then creative 1, 2, 3 and 4. One commit each. Then the cutover
to `main`, following the original plan's Task 15.
