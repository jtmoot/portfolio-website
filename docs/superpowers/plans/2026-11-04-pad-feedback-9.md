# Pad feedback, round 9 (approved Nov 4)

Joshua's review of the live site, Nov 3 and 4 2026, measured on the dev build at 1440 by 900 in
headless Chrome. His decisions: keep the anatomy kit for every drawing and push it harder (he saw
the hairline "iso figure" and AI raster alternatives side by side and chose the kit); fix the
motion; land it on `main` by PR.

## Creative mode

### 1. The first entry pops

- **Problem:** `Floor` mounts only when the mode turns creative, and by the time the lazy import
  commits, `flipped` is already true, so the layer is born with `data-on`. Its CSS transitions never
  run: on a fresh page every drawing appears at once at 0.4 to 0.7 s, on a sheet that is still almost
  flat, and then rides the tipping paper mis-registered until it lands. Only a second entry in the
  same page load gets the staged sketch-in.
- **Fix:** the layer turns `data-on` one animation frame after it is in the DOM with `flipped`
  true, so the browser has its resting style (opacity 0, clipped) before the transition starts.
- **Test:** `Floor` rendered with `flipped` true has no `data-on` on its first commit and gains it
  after two frames.

### 2. The way back

- **Problem:** the exit was the entrance in reverse with the drawings removed first: labels and
  drawings fade 0 to 0.45 s, walls to 0.75 s, then a blank tilted sheet sits until 1.2 s, then the
  paper whips upright (a 0.5 s delay plus the time-reversed curve, which is flat for its first half),
  the writing returns 1.1 to 2.0 s and the body column 1.8 to 2.3 s. The page-flip clip (1.04 s,
  its loud land at 0.85 s) played at the click, so it had finished before the paper visibly moved.
- **Fix:** one 1.5 s motion on the entrance's own curve, starting at the click. The drawings sink
  into the paper (clip from the top, latest drawn first) over the first 0.6 s while it is already
  tipping; the walls go last. The backdrop fades 0.5 to 1.4 s, the writing returns 0.6 to 1.5 s, the
  grown paper shrinks back 0.2 to 1.3 s and its edge fades as it lands, the travelers slide back for
  the whole 1.5 s and reappear in the second half, the body column fades in from 1.2 s. Done by 1.6 s.
- **Sound:** the flip plays from `Stage` when the paper starts to move, in both directions, delayed
  350 ms so the clip's land (0.85 s) meets the paper's landing (about 1.2 s). The nav button no
  longer carries `data-sound="flip"`; it is silent on click.
- **Test:** the exit's CSS has no delay on the paper's transform; `play` accepts a delay; `Stage`
  schedules the flip on both toggles.

### 3. Walking

- **Finding:** collisions hold (0 breaches in 1,774 key-driven frames into every piece, 0 depth
  flickers in a 48 s tour). What reads as walking through furniture is drawing order and overlap.
- **Gym in parts:** the gym is one picture with one depth, so beside the plyo box from behind he
  looks sunk into it, and beside the rack he is drawn over the plates. The build now writes the gym
  as three drawings (rack with bar, vest and feet; plyo box; floor: tiles, ladder, kettlebells,
  shoes), each a `floor-item` with its own paint box, sorted against him every frame like the
  reading chair's two layers. The floor part is always behind him.
- **Body margin:** `BODY` 2.4 to 3.2 units (16 cm), so his shoulders stop short of counters and the
  desk. Keep-out blocks where a tall piece would hide him from the waist down: behind the plyo box
  (its whole diagonal shadow), the kitchen counter's two ends, the desk's right end, the library's
  right end.
- **Contact shadow:** a soft ellipse under his feet in the figure layer, so where part of him is
  hidden he still reads as standing on the floor.
- **Tests:** the existing reachability, aisle and contact tests pass with the new margin and blocks;
  the gym's three parts carry footprints that together cover the old one.

## /shelf and the room's library

### 4. The bookcase, pushed

- The bookcase generator becomes a shared drawing (`tools/stations/bookcase-draw.mjs`) used by
  `bookcase` (the page, 35° camera, hit strips) and `library` (the room, 45° camera, static).
  Changes to the drawing: a wider spread of walnut tones, wood grain that fades out instead of
  stopping, bevelled edges, stronger back-board grooves, brass label holders moved to the bare end
  of each shelf and lit, a brass picture light with its pool of light on the top, a flat stack
  beside the king, head bands on the spines. Night tokens for the new walnut.
- The room's library station is this drawing at 45°, so the shelf in the room is a small twin of
  the page it opens. Its footprint and contacts come from the same halo.

### 5. /shelf shows it larger

- The bookcase column grows from 33 to 44 cqw; the plates at the bare end no longer hang over the
  books below.

## The two wall pieces (added Nov 4, after the first merge)

### 6. The anatomy chart and the corkboard, framed properly

- **Chart:** a dark moulded frame of four rails standing proud and mitred, a cream mat with a
  bevel line, the rails' shadow inside, two glints on the glass. Each leader starts at a dot on
  the part it names and ends where its two-line label begins; a title, a three-line caption and a
  plate number. The brain gains the central sulcus, the lateral fissure and the pons.
- **Corkboard:** an oak frame of four proud, mitred rails around a recessed cork with its shadow,
  speckle in two grades, push pins as round heads standing out of the wall (red and blue
  materials), and an index card pinned at a slant beside the covers.

## After he saw it live (Nov 4, afternoon)

### 7. Three more things in the room

- **The chart sat on the bookcase.** The new bookcase with its picture light reaches 127 cm; the
  chart hung from 122. It now hangs from 140 (top at 202).
- **He walked over the rack on the way from the kitchen to the gym.** His depth was a topological
  sort over every station's box with an approximate pairwise rule; a far box (the reading chair,
  seen from the kitchen) demanded an order that contradicted the near ones, and the fallback drew
  him over the rack he was walking behind. Now only boxes that can cover him on screen have a say
  (their footprint spans x + y within half his width of his feet), and his slot is the one that
  leaves the least of him wrongly covered, so a sliver of a table's corner gives way to the chair
  he is walking up to.
- **He walked through the reading chair.** The seat opens toward +x, away from the camera, so the
  chair's front hid his legs while he was still walking up, and he cut in over the near arm. The
  chair's front layer is marked `open: "+x"`: past that side he draws over it, and only once in the
  seat does he go behind the back and near arm. He also comes to the seat by way of an
  `approachAt` point in front of the chair, straight in along the seat's far half.
- **The station sayings:** Joshua will give new lines; `CARD_TEXT` in `StationCard.jsx`.

### 8. The tour, the chair again, the corkboard, speed, and a sticky note (Nov 4, evening)

- **The tour opens at the desk** he waves from (`idleIndex` 0), then the library and on round.
- **The chair faces the camera now.** Approaching its open side from the room could only read as
  walking into it, whatever the draw order. `reading.mjs` and `reading-front.mjs` mirror the
  chair in local y: the tall back, back cushion, seat, far arm and lamp draw behind him, the near
  arm and side table in front. He comes to a point in front of the chair (`approachAt` 3, 46),
  steps in between the arms and sits facing us (`ACTIONS.reading.facing` is `dl`, so the sprite
  sheet carries `f-dl-sit1`, `sit2`, `sip`). The chess table moved half a unit right to keep the
  30 cm aisle. Layout: footprint (the back) at x 20.2, seat at x 7.8, paint boxes y 32 to 45 and
  48 to 62.
- **The corkboard's card comes up:** its stand point is 6.2 from the wall, within the card's reach
  of 5 from the board.
- **Speed.** Measured in headless Chrome: the room runs at about 60 fps once open; the glitches
  were three stalls of 100 to 160 ms (the first open parsing 3.5 MB of drawings into 19,000 DOM
  nodes, a station card appearing, and the exit). The room now mounts hidden at idle 4 s after
  load, so the first click pays nothing; each drawing has `contain: layout style`, so a card or
  the figure moving relays out only its own box. After: worst frame 50 to 67 ms, longest task
  about 55 ms.
- **A sticky note on /shelf:** `src/pad/StickyNote.jsx`, yellow paper with a lifting corner, the
  line "Never stop the intellectual struggle..." in his hand, top right of the title.

### 9. The chair, properly; the note drawn in (Nov 4, night)

- **What was still wrong:** after 8 he walked into the seat standing, so his legs crossed the
  cushion's front; the lamp and the side table stood in front of the chair; and the card's reach
  (5 from the chair's back) missed the seat.
- **Sitting down.** The chair's `standAt` is where his hips end up (the seat's centre), its new
  `sitFrom` where he stands to sit (feet a hand's breadth in front of the cushion, 43 cm forward
  of the hips). Routes end at `walkPoint` (sitFrom when a station has one). On arrival the stop
  plays the action's `settle` frames first (`sitdown1`, `sitdown2`: the sit pose a third and two
  thirds of the way down, `sit` in figure.mjs now takes a fraction), each drawn with his hips that
  fraction of the way from sitFrom to standAt, so his feet stay planted and he lowers himself back
  onto the seat. Getting up plays them backwards before he leaves, and before he answers a steer
  or a tap (`seated`, `rising`, `pendingTap` in the state).
- **The chair's parts:** the lamp moved behind his far shoulder, the side table beside the near
  arm, level with the seat, so the floor in front of the chair is open; the back layer's paint box
  is the back and lamp only (x 15.5 to 23.5), the front layer's the near arm and table (y 48 to 64).
- **The card** reaches a chair's seat as well as its back (`nearestStation`), and the reach is 6.
- **The sticky note** is drawn on the bookcase top beside the picture light (both /shelf and the
  room's library), yellow paper with a lifting corner, the line in his hand set flat on it; the flat
  HTML note from 8 is gone.

## Order

1, 2, 4, 5, 3; then `npm test`, `npm run build`, screenshots of the entrance, exit and the room;
PR to `main` and merge (PR #3). Then 6, in a second PR (PR #5). Then 7, in a third (PR #7). Then
8, in a fourth (PR #11). Then 9, in a fifth.
