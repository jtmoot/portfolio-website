# Pad feedback round 1: plan

Status: approved by Joshua 2026-10-29.
Branch: `rebuild/personal-pad` (keep working here, new commits on top of 686b85c).
Source: Joshua's 11-point feedback, 2026-10-29.

## What was found while reading the code

- **No sound on the main page.** The intro types itself on page load, before any click or key.
  Browsers block audio until a gesture, so `src/lib/audio.js` stays silent by design. The pencil
  only plays on "replay", and the tick only on the mode toggle. No setting can make sound play on
  load without a click, on any site.
- **The "see ..." card vanishes.** The card shows while the pointer is over a station or the figure
  is near it. Moving the pointer onto the card leaves the station, and the figure has already
  walked on (it pauses 1.5 s per station), so the card closes before the click lands.
- **Walking to the corkboard clips the counter.** The corkboard stop sits right beside the kitchen
  counter, and the path between kitchen and corkboard hugs it. The drawn counter is wider than its
  walk-blocking box. The room is too tight for that corner.

## Tasks, in build order

### A. Quick fixes (small)
1. **Cards stay put.** Hovering or focusing a card keeps it open and freezes the tour. Clicking a
   station also freezes it. The tour resumes 2 s after the pointer leaves. Station pause goes to
   4 s (it also needs time for the actions in task C2).
2. **Sound, Garvit style.** No toggle. The first click or key press anywhere on the pad
   restarts the typed intro from the top, this time with the pencil sound. It happens once per
   visit; later replays use the existing replay control. Reduced motion stays silent and does not
   retype.
3. **Speed wheel.** A small dial in the creative-mode corner sets walk speed from 0.5x to 2x.
   Drag, scroll or arrow keys turn it. The choice is remembered per browser.

### B. Margins (small to medium)
4. **Left stickers, Garvit style.** Replace the whole-library sticker with a drawn open book,
   tagged "my shelf" (links to the reading list). The brain loses its label. The shoe becomes a
   link to Strava (https://www.strava.com/athletes/121070736), tagged "my runs". The king is
   tagged "my rating" and links to chess.com.
5. **Posters.** Each poster gets its own tilt (between about -4 and +3 degrees), a second piece of
   tape at a different corner, slight paper curl shadow, matched to Garvit's right margin.

### C. The room (large, the main work)
6. **Bigger room, view follows you (option 2).** Floor goes from 100 x 78 units (5 x 3.9 m) to
   about 130 x 100 (6.5 x 5 m), drawn at today's on-screen size. Kitchen moves to the left wall
   with a clear aisle; corkboard moves off the kitchen corner. Every walk-blocking box is
   re-measured from the drawing so nothing clips.
   - The view eases after the figure with a dead zone in the middle of the screen, so it only
     moves when he nears an edge. It stops at the room's edges, except past the open front edges,
     where it keeps following him onto the walk-off tiles.
   - The flip lands on the starting view, framed on the desk, so the stickers still visibly
     travel to their stations. Stations off screen get a small handwritten arrow at the screen
     edge pointing toward them; clicking it walks him there.
   - Phones keep the same follow view with tap-to-walk.
   - Reduced motion: no easing; the view jumps when he crosses the dead zone.
7. **Ambient motion in every station.**
   - Chess: pieces replay a short real game on loop, one move every 4 s, captured pieces lifted off.
   - Kitchen: a low steam wisp always rises; the big lid-lift stays for visits.
   - Desk: the monitors show slowly scrolling code and a terminal cursor.
   - Plants: leaves sway a degree or two, staggered.
   - Gym: the agility ladder's rungs and the kettlebell handle catch a slow light sweep. (Small.)
   - All motion stops under reduced motion and when the tab is hidden.
8. **Small actions at stations.** When he reaches a station he does one thing, then walks on.
   - Library: pulls a book, opens it, puts it back.
   - Chess: reaches over and moves a piece (ties into the replay in task 7).
   - Kitchen: lifts the lid and shakes in seasoning, with spice specks and a steam burst.
   - Desk: types for a few seconds. Gym: one kettlebell swing.
   Cost: each action needs 3 to 4 new drawn poses, only in the one direction he faces at that
   station. That is about 18 new sprite poses on top of today's 20. Held props (book, shaker,
   piece) are separate small drawings that move with the hand.
9. **Wave and hello.** On entering creative mode he turns to the screen and waves (3 new poses),
   with a handwritten speech bubble: "Hello, Pittsburgh!"
   - How the city is found: Vercel already sends the visitor's city with each request. A tiny
     Vercel function reads that header and returns only the city name. Nothing is stored, logged
     or sent to a third party. Locally, and if the lookup fails, it guesses from the browser's
     time zone ("Hello, New York!"), and failing that says "Hello there!"
   - The bubble only names a city, never a street or IP address.

### D. You, redrawn (medium, needs a photo)
10. **Figure likeness.** Rebuild the figure at 183 cm with broad shoulders and an 82 kg frame.
    Dirty-blonde to light-brown hair with a loose middle part. Clothes: a fitted quarter-zip
    pullover and tapered joggers in the Vuori style, Novablasts on his feet. No hoodie.
    A full-body photo plus a side view would make the hair and build much closer.

### E. GitHub README (small, separate repo)
11. A profile README in the pad style: a dotted-paper SVG banner with your name in Gloria
    Hallelujah, a typed-intro line, three small halftone stickers, and links. It's written so the
    font and the lowercase styling are each one swap away when you change them later. The fonts
    are turned into outlines inside the SVG, because GitHub won't load web fonts in images.
    Delivered as files in `docs/github-readme/` for the joshuamoorehead profile repo (the account
    this site's repo lives in). Nothing is
    pushed.

## Order and checks
A, then B, then C6, C7, D, C8, C9, then E. The figure is redrawn before the actions so the new
poses are only drawn once. Every behaviour change gets a failing test first. Every station and
margin change gets screenshots at 1512 and 390 wide, in day and night, in
`docs/superpowers/reference/screens/`. `npm test` and `npm run build` pass before each commit.

## Decisions (2026-10-29)
- Photo: received; likeness notes are in docs/superpowers/reference/figure-brief.md. Task D is unblocked.
- Hello: Vercel city header, time-zone fallback, as written in task 9.
- Room: option 2, the view follows the figure, for a world feeling.
- README: joshuamoorehead account.
