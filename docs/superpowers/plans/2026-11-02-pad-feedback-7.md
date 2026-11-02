# Pad feedback, round 7 (plan, awaiting approval)

Branch: `rebuild/personal-pad`. Same rules: TDD, screenshots in day and night on desktop and phone,
`npm test` and `npm run build` green before each commit, nothing pushed.

What Garvit's site does, checked on Nov 2:
- **Opening:** only the name is written out. The paragraphs then appear whole, the highlights fill in
  one after another, and the social links come in last. Ours types all ~330 characters of the intro
  one by one, so the lines reflow as they fill. That's why his reads smoother.
- **Card texture:** a fine dot grid (about 6 px apart, very faint) printed on the cream card, with
  dashed dividers between rows.

## 1. The name, more like typing
- The name types letter by letter in hard steps, with no fades. The rhythm is slightly uneven, like a
  person typing (a seeded jitter, so every load has the same rhythm).
- A thin caret runs ahead of the letters and keeps blinking after the name (1.06 s period, steps, not
  a fade). The intro's own caret goes, so there is only one.
- The typing sound plays only for the name, as now.
- Reduced motion shows the name and a static caret.

## 2. A smoother opening (Garvit's order)
1. The name types (about 0.9 s).
2. The role line fades in.
3. The intro appears as a whole paragraph, rising 4 px over 0.5 s.
4. The three highlights draw in one after another, 150 ms apart.
5. The social links fade in last.

The whole opening takes about 2.2 s. The first-click replay reruns the same sequence, so the
letter-by-letter typing of the intro is removed.

## 3. The portrait: settle, don't bounce
- My recommendation is against a continuous bounce, which reads as a toy. On a page meant to be
  serious it would be the one thing that moves forever.
- Instead:
  - On load the polaroid drops 6 px into place with one small overshoot (0.6 s).
  - On hover it lifts 2 px and turns 1° with a softer shadow.
  - Nothing moves while you're reading.
- Option B, if you'd still like something constant: a 2 px float over 7 s that is barely visible.
  Off by default.

## 4. Experience and Leadership as short, strong bullets
Each row's paragraph becomes 2 to 4 bullets, each under about 12 words, verb first, with numbers
kept. The data gets `points: string[]` in place of `blurb`. The drafts below are from the Nov 2
resumes, for you to edit:

- **Core Natural Resources**
  - Co-built a serverless AWS payroll platform for 3,100 miners.
  - Own the payout engine: idempotent reruns, source-to-payout lineage.
  - Built cited Bedrock Q&A over SEC filings and earnings calls.
  - Building an LLM agent that drafts Oracle requisitions for human approval.
- **Carnegie Mellon**
  - MS ECE, AI/ML systems concentration, graduating Dec 2027.
  - Building LoRA serving in Needle, a from-scratch DL framework.
  - Built a fault-tolerant replicated service with automatic failover.
- **Baron Filtration**
  - Built Python/SQL ETL from Sage Intacct into S3 (10K+ records).
  - Restored reporting after a QuickBooks-to-Sage migration.
  - Shipped the company's first operational dashboard.
- **University of South Carolina**
  - Trained a PyTorch autoencoder on simulated STM images: 0.93 SSIM.
  - Benchmarked a dual-decoder model tuned by DARTS on an HPC cluster.
- **SigEp PA-Theta, advisor**
  - Advise the executive board of CMU's largest fraternity (100+ members).
- **SigEp SC-Alpha, president**
  - Led a 200-member chapter to the #1 GPA of 24 fraternities.
  - National Frank J. Ruck Leadership Award; USC Greek Hall of Fame.

## 5. Card texture
- Experience and Leadership cards get Garvit's fine dot grid: one CSS radial-gradient, about 6 px
  apart, ink at 7% in day and paper at 6% at night. Row dividers become dashed.
- Project cards stay plain, so the two kinds of card read differently.

## 6. Filling the sides: an experiment behind `?sides=`
My view:
- Drifting project cards would bring back the problem we removed in round 5. They'd add motion and
  clutter next to the content, and they'd repeat the Projects section.
- The margins should earn their space with real, quiet information.

Two variants behind a URL flag, so you can compare them on the real page, as with `?font=`. Both apply
only at 1280 px and wider, and the phone layout is untouched.
- **`?sides=rail` (recommended)**
  - Left: a slim section index (Experience, Projects, Leadership, Contact) that marks where you are as
    you scroll.
  - Right: a small "Now" card listing:
    - reading (the first "now" book from the shelf, with its cover);
    - building (LoRA in Needle);
    - training (the Strava link);
    - chess (the chess.com link).
  - It's static, sticky, and in the same type as the page.
- **`?sides=float`: your idea, built well.**
  - Five project thumbnails (the posters), scattered at small angles in the margins.
  - They drift a few pixels on slow, independent loops and stop under reduced motion.
  - Hovering one shows its preview; clicking scrolls to its card.
- Without the flag, nothing changes until you pick one.

Built Nov 2, approved: `?sides=rail` and `?sides=float` (commit 85d86ca).

## 7. Book suggestions, fast for the sake of it
- Now: about 2.7 s per keystroke search, because every search is a round trip to Open Library.
- Target: under 5 ms from keystroke to list for the books people actually recommend, with a live
  readout of the time beside the field ("1.8 ms") to show it off.
- **Build-time index** (data-pipeline work, which is the point):
  - Pull Open Library's monthly works and ratings dumps.
  - Keep the 50,000 most-read works (by ratings count and edition count), with title, first author,
    work key and cover id.
  - Write a compact prefix index: normalised tokens (lowercase, no accents or punctuation) in a sorted
    array with offsets into the book table, packed into one binary file. Expected around 1 to 1.5 MB
    with brotli.
  - A Node script, `tools/books/build-index.mjs`, with tests for ranking and normalisation.
- **In the browser:**
  - The index loads in a Web Worker when the Book field is focused, so nothing loads until then.
  - Each keystroke is a binary search over the token array plus a prefix intersection across words,
    ranked by popularity: well under 1 ms.
  - No debounce for local results.
- **The long tail:** a title not in the index falls back to Open Library through an edge-cached
  `/api/books?q=` (cached for a day at the edge), after a 250 ms pause, with results merged in.
- Tests:
  - Normalisation, so "Café" matches "cafe".
  - Ranking, so "dune" ranks Herbert first.
  - The worker protocol.
  - A benchmark test that asserts p99 is under 5 ms over 1,000 sample queries on the built index.

## 8. The API locally
- "Hello, {city}!" still exists. It only shows on Vercel, because the city comes from a header Vercel
  adds; local dev has no `/api`, so it says "Hello there!".
- Fix: a small Vite dev plugin that serves `api/*.js` from the dev server. Locally, `/api/hello`
  reports `DEV_CITY` (default "Pittsburgh"), and `/api/recommend` runs against Doppler's dev database
  when started with `doppler run -- npm run dev`.

## Order
1, 2 and 3 (the opening, together), then 4 and 5, then 6. One commit each.
