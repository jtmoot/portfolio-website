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

## Order

1, 2, 4, 5, 3; then `npm test`, `npm run build`, screenshots of the entrance, exit and the room;
PR to `main` and merge (PR #3). Then 6, in a second PR (PR #5). Then 7, in a third.
