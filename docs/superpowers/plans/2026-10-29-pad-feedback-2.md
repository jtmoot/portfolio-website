# Pad feedback, round 2 (plan, awaiting approval)

Branch: `rebuild/personal-pad`. Same rules as round 1: TDD, screenshots of every step in day and night on
desktop and phone, `npm test` and `npm run build` green before each commit, nothing pushed.

## Answers so far

- **Chess card:** unchanged (it opens chess.com).
- **Headshot:** `~/Downloads/IMG_9136.jpg`, cropped to the face (preview sent). Awaiting a yes.
- **Pencil sound:** `~/Downloads/376706__fthgurdy__writing-with-pencil-energetic.wav`, CC0 on Freesound
  (fthgurdy). It's 23.7 s of stereo audio at 44.1 kHz. I'll trim it, take out the noise, make it loop
  cleanly, match its loudness and encode it small. Credit goes in `public/audio/SOURCES.md` anyway.
- **Cursor:** keep the dot. Over anything clickable it shrinks to a small solid orange point while a thin
  orange ring springs open around it. Pressing tightens the ring. Shrinking is a fine signal on its own
  terms, but the colour and the ring make it readable.
- **Library:** the list below. It goes on `/shelf`.
- **Podcasts:** a card at the corkboard in creative mode, with tiles pinned on the board.

## A. Main page

1. **Experience, Garvit style.** Experience stays above projects.
   - Layout:
     - One rounded card with a washi tape corner.
     - A small "tap a line to unfold" note in the hand font.
   - Each row:
     - Left: a logo tile, then the company in bold sans with a type chip (experience, internship, research),
       and the role underneath.
     - Right: the dates and a pin with the place, then a chevron.
   - Unfolding a row (tap or Enter) shows a short paragraph and tech chips. It animates its height and
     respects reduced motion.
   - Copy: I'll draft it from your latest resume (`Joshua_Moorehead_CMU_ML-4.pdf`) for you to edit.
2. **Projects, Garvit style.**
   - The section is titled "things i've built & shipped".
   - Each card has:
     - A browser-window frame (dots and a URL bar) around the demo video, with play/pause and mute.
     - A line with the number and category, and a badge (LIVE, SYSTEMS, RESEARCH).
     - The name in bold sans and a subtitle in the hand font.
     - The description and tech chips.
     - A dashed-rule footer with "launch live", "github" and, where one exists, "post & video".
   - Layout: two cards per row, then one wide card with the video on the left, repeating. Each card gets its
     own tape colour.
3. **Livelier stickers.**
   - Each one floats on its own loop: 5 to 7 s, up 8 to 11 px, a 1.5 to 2.5 degree tilt, staggered.
   - On hover it grows to 1.1 with a springy curve and a deeper shadow. On press it shrinks to 0.95.
   - A tap plays a wobble.
   - Everything is still under reduced motion.
4. **Shrinking nav.** About 40 px of scroll turns the bar into a narrower floating pill:
   - At most 540 px wide.
   - 80% paper background with a blur.
   - A hairline border and a soft shadow.
   - Tighter padding.
   - The change takes 0.65 s, and scrolling back up restores it.
5. **Replay and mute.**
   - Two small faded icon buttons at the end of the intro: a curled-arrow replay and a speaker.
   - Replay retypes the intro with sound. Mute is remembered across visits.
   - The first-click retype from round 1 stays.
6. **Portrait.**
   - The card gets about 18% bigger and the "pittsburgh 2026" caption goes.
   - The dots get finer and closer so it reads more like a photo.
   - The new headshot is in question 2.
7. **Cursor.** The dot shrinks to an orange point and an orange ring opens around it (see Answers).

## B. Creative mode

8. **Room smaller.** The view fits the whole room, walls included, below the nav with a margin, so nothing
   runs into the top. The camera only follows him when the room can't fit, which in practice means phones.
9. **Speed, without gliding.**
   - The walk animation steps every 120 ms however fast he moves. At 2x his legs can't keep up, so he looks
     like he's gliding. The drawings aren't the limit.
   - Fix:
     - Today's 2x becomes the default speed.
     - The wheel runs from 0.5x to 2x of that, so the top is 4x today's.
     - The walk animation advances with distance walked, so his legs match the ground at any speed.
     - Up to about 1.5x, the walk just gets a quicker step.
     - Above that, he switches to a jog: 4 new frames per facing with a longer stride, bent arms, a
       slight forward lean and a small bounce. That adds about 150 KB of drawing.
10. **Reading list as its own page** at `/shelf`, like Garvit's, in four sections: reading now, up next,
    read, and textbooks.
    - A back link, a "currently reading" title, and a card with a "/shelf · N books" header.
    - Each book: cover, hand-font title, author, topic chips, and a Goodreads link.
    - Margin doodles and the site footer.
    - It uses no router: it checks the path once, plus a Vercel rewrite.
    - The "my shelf" sticker and the library card's "see the reading list" go there.
11. **Chess card:** no change.
12. **Gym.** The box-jump box moves left, away from the rack. He gets a clear patch of floor in front of
    the rack for the kettlebell.
13. **Always-on ambient motion.** The kitchen steam and the plant sway run all the time, not only when he's
    there.

## C. Station actions

14. **Plants: watering.** He walks up with a watering can, tips it over the pots, and a few drops fall.
    These are new poses plus a small drop effect.
15. **Chess: the queen mates.**
    - He stands on the far side of the board, facing you, so you see him and his arm.
    - He reaches, and the queen glides to the mating square. The board is set so it's a real mate.
    - The enemy king tips over.
    - The board resets after he leaves.
    - The six-move replay goes away.
16. **Kitchen: redone.** He turns so you see the pot, holds the shaker above it and shakes it in a clear
    arc. A few flakes fall into the pot, and the steam puffs.
17. **Gym: room to swing.** He uses the cleared floor in front of the rack. The kettlebell poses get a
    longer, clearer arc: from between the knees up to chest height.
18. Code and book actions stay as they are.

## D. Library and podcasts

Spellings and authors are corrected. Lines marked "(check)" need you to confirm.

- **Reading now**
  - Same as Ever, Morgan Housel
  - The Socrates Express, Eric Weiner
  - How Not to Be Wrong, Jordan Ellenberg
- **Up next**
  - Zen Flesh, Zen Bones, Paul Reps and Nyogen Senzaki
  - How the World Really Works, Vaclav Smil
  - At the Existentialist Café, Sarah Bakewell
  - How to Live: A Life of Montaigne, Sarah Bakewell
  - The Laws of Human Nature, Robert Greene
  - The Creative Act, Rick Rubin
  - Why Machines Learn, Anil Ananthaswamy
  - Courage Is Calling, Ryan Holiday
  - The Body, Bill Bryson
- **Read**
  - Meditations, Marcus Aurelius
  - Principles for Dealing with the Changing World Order, Ray Dalio
  - Deep Work, Cal Newport
  - The Black Swan, Nassim Nicholas Taleb
  - Zero: The Biography of a Dangerous Idea, Charles Seife
  - A Thousand Brains, Jeff Hawkins
  - Infinite Powers, Steven Strogatz
  - How Children Succeed, Paul Tough
  - Man's Search for Meaning, Viktor Frankl
  - The Righteous Mind, Jonathan Haidt
  - Bubble or Revolution?, Detroja (check the full title and author)
  - Can't Hurt Me, David Goggins
  - How Adam Smith Can Change Your Life, Russ Roberts
  - Chip War, Chris Miller
  - AI Snake Oil, Arvind Narayanan and Sayash Kapoor
  - Thinking, Fast and Slow, Daniel Kahneman (marked "partway")
  - Outliers, Malcolm Gladwell
  - The Tipping Point, Malcolm Gladwell
- **Textbooks**
  - Designing Data-Intensive Applications, Martin Kleppmann
  - Machine Learning Systems (check: Chip Huyen's *Designing Machine Learning Systems*, or the Harvard
    *Machine Learning Systems* by Vijay Janapa Reddi?)
  - AI Engineering, Chip Huyen
- **Podcasts** (corkboard)
  - How to Take Over the World, Ben Wilson
  - Founders, David Senra
  - Maxinomics, Morning Brew (check the name)
  - The AI Daily Brief, Nathaniel Whittemore (on Spotify)

  Each gets a Spotify link. The board gets four small pinned tiles, and the corkboard card lists them.

## Order

A4, A5, A3, A6 → A1, A2 → B8, B9, B13 → B12 + C17 → C14, C15, C16 → B10 + D → A7.

## Not changing

The intro copy, the posters, the README and the room layout apart from the gym box.
