# Pad feedback, round 6 (plan, awaiting approval)

Branch: `rebuild/personal-pad`. Same rules as before: TDD, screenshots of every step in day and night on
desktop and phone, `npm test` and `npm run build` green before each commit, nothing pushed.

## A. Main page

1. **Links too close to Experience.**
   - Cause: `.hero` is absolutely positioned, and `.body` starts at a fixed `margin-top: -46cqw` whatever
     height the hero has. In Chrome everything scales with `cqw`, so the gap holds (114 px at 1440). In
     your Firefox the intro renders larger (zoom or a minimum font size), the hero grows, and Experience
     can't move down.
   - Fix: put the hero back in normal flow, at the same left offset and top. `.body` then follows it
     with a fixed gap of `max(5cqw, 56px)`, so the layout no longer depends on font size.
   - Check: gap ≥ 56 px at 820, 1100, 1440, 1512 and 1920, and again with the intro forced to 16 px to
     simulate your Firefox.
2. **SigEp logos.**
   - The crest (`~/Downloads/penn theta.jpg`) goes on the Carnegie Mellon advisor row, and the SigEp
     gamecock (`sc-alpha.jpg`) on the SC-Alpha president row.
   - Both become 96×96 PNG tiles like the other logos (`public/logos/sigep-pa.png`, `sigep-sc.png`), and
     the `logo` fields are set.
   - The chapter name is corrected from "PA-Eta" to "PA-Theta" (Joshua confirmed Penn Theta).
3. **LinkedIn hover preview.**
   - A 16:10 crop of your profile card from `~/Screenshots/Screenshot 2026-11-02 at 12.07.51 PM.png`:
     banner, photo, name, headline and the CMU badge. It's saved as `public/previews/linkedin.jpg` at
     1100×688, matching the GitHub one.
   - Left out: Analytics, "who viewed your profile", the Premium ad, browser chrome, and your
     owner-only buttons ("Open to", "Add section"…). The two edit pencils are painted out.
   - The LinkedIn pill's `ph` placeholder becomes `prev`.

## B. Shelf

4. **Shelf names too small.**
   - They render at about 6 px now, because the brass holders fit inside the 3-unit board.
   - They become clip-on label holders that hang below each board's front edge, as library shelf labels
     do. That makes them about 2.2× taller, with the text going from 1.28 to about 2.9 units: about
     13 px at 1440 and still above 10 px on a phone.
   - The holders stay centred, and the tipped-out book still clears them.
5. **Spine titles off to the sides.**
   - Cause:
     - The baseline is offset the wrong way (`mid - size*0.34`), so every title and surname sits off
       centre across the spine.
     - Titles are sized from a 0.5 em-per-letter guess, so some run past the spine top or into the
       surname ("SwanTaleb", "Can't Hurt Me").
   - Fix:
     - Centre each line on its cap height across the spine.
     - Cap the letter height at about 60% of the spine width.
     - Estimate widths conservatively, and set `textLength` (glyphs and spacing) whenever a title would
       come within 1 unit of the surname or the spine end.
   - Test: a new `tests/tools/bookcase-spines.test.js` reads the generated SVG and checks, for all 33
     books, that each text line is centred within ±0.15 units and that no title overlaps its surname.

## C. Recommend a book, stored in a database

6. **The form.** On `/shelf`, the mailto link becomes a small inline form:
   - Book: a search field with Open Library suggestions (`search.json`, 300 ms debounce, 5 results with
     cover, title, author), or free text with an author field.
   - Optional: "Why this one" (500 chars) and "Your name" (60).
   - Send, then "Thanks. It's on the list." Errors say what happened ("Too many sends from here today",
     "Couldn't reach the list, try again later").
   - It works from the keyboard and never opens email.
7. **The API.** `api/recommend.js` (POST only) sits next to `api/hello.js`:
   - Validates lengths and requires a title.
   - Drops anything that fills the hidden honeypot field.
   - Allows 5 sends per visitor per day, keyed by a salted hash of the IP. The raw IP is never stored.
   - Validation lives in a pure `src/lib/recommend.js`, unit-tested. The handler is tested with a fake
     database.
8. **The database: Postgres on your Railway Hobby plan** (decided Nov 2, replacing Neon).
   - Why Railway: the CLI is already installed and logged in on this machine, and Forge already runs
     there, so there's no new account.
   - Cost: an idle Postgres uses a small part of the $5 of usage the plan includes. I'll check the
     project's usage after a day and report it.
   - Setup: I create a Railway project `portfolio-recs` with the Postgres template (`railway add
     --database postgres`).
   - Connection: the Vercel function connects through Railway's public proxy URL
     (`DATABASE_PUBLIC_URL`) with the `postgres` driver over TLS, opening one connection per call. That's
     fine at this volume.
   - Table: `recommendations (id, title, author, ol_key, cover_id, note, from_name, ip_hash, status
     default 'new', created_at)`, created by `tools/recs/schema.sql`.
   - Secrets follow your Doppler rule:
     - `DATABASE_URL` (the public proxy URL) and `REC_SALT` live in a new Doppler project, synced to
       Vercel with Doppler's Vercel integration.
     - `.env.example` gets placeholders only.
     - Run locally with `doppler run -- vercel dev`.
   - Reading them: `npm run recs` lists the newest, and `npm run recs -- done <id>` marks one read.
     Railway's data tab works too.
   - Recommendations stay private: nothing shows publicly in this round.
   - What you'd do once:
     - `npm i -g vercel` and `vercel login`.
     - `doppler-init` in the repo.
     - Connect Doppler to Vercel in Doppler's dashboard.
     - I create the Railway database and wire the rest, never printing a secret.
   - Note: plain `npm run dev` shows the form but can't send (there's no API there). Sending works under
     `vercel dev` and on preview deploys.

## D. Sound

9. **Click sound.**
   - The current click has about 100 ms of hiss after the hit, with a noise floor of −35 dB. The typing
     under your name is clean (−64 dB), so I take "the clicks" to mean the button click.
   - Joshua picked **click cleaned** (Nov 2): the same avaol click, high-passed, denoised and gated, cut
     to 45 ms with a 25 ms fade. It replaces `public/audio/click.mp3` at the same loudness, and
     `public/audio/SOURCES.md` notes the processing.
10. **Creative-mode background.**
    - A quiet loop fades in over 2 s when creative mode opens and out over 1 s when it closes. Volume
      is about 0.12.
    - It respects mute and reduced motion, and only loads on first entering creative mode.
    - The loop seam is crossfaded into the file itself so `loop` is seamless.
    - The mute icon is hidden in creative mode (the hero fades), so a small sound toggle joins the nav
      there.
    - **Sound: a café with jazz** (Joshua's choice). It is two layers mixed into one file:
      - A CC0 café room recording, kept low: cups, spoons, an espresso machine and murmur, with no
        clear words. Candidates are
        [Northtown Coffee](https://freesound.org/people/CVLTIV8R/sounds/813868/) and
        [low chatter, barista](https://freesound.org/people/AwenAudio/sounds/403065/).
      - A quiet jazz track from [Pixabay Music](https://pixabay.com/music/search/cafe%20jazz/) (Pixabay
        Content License: free, no credit needed, though I'll credit it anyway). It is filtered and given
        a little room so it sounds like the café's speaker, not headphones.
    - About 3 minutes, so it rarely repeats: mono, 64 kbps, about 1.4 MB, fetched only on the first entry
      to creative mode.
    - First build step: two finished mixes on your Desktop for you to pick from before anything goes into
      the site.
    - Licences are checked on each page before download. A Freesound recording that is CC BY, or that has
      copyrighted music audible in the background, is rejected.

## E. Content from the two Nov 2 resumes

Sources: `~/Documents/Career/Resumes/Current/Joshua_Moorehead_ML_Systems.pdf` and `…_AI_Eng.pdf`. The
rule: the site may say more than a resume has room for, but never claim more than the resumes now do.
Everything is in `src/content/data.js`.

11. **Role line:** "ML systems engineer" becomes "ML systems and AI engineer", the two tracks the
    resumes target.
12. **Intro** (the typed paragraph; highlighted words in bold):
    > I build **machine learning systems** and the data infrastructure beneath them. I'm completing an MS
    > in Electrical and Computer Engineering at **Carnegie Mellon**, focused on AI/ML systems, and
    > interning at **Core Natural Resources**, where I co-built the AWS platform that pays shift
    > incentives to 3,100 miners. Outside of work, I lift, run, cook, read history and play chess.

    The Forge numbers move out of the intro; they stay on the Forge card, which is the first project.
13. **New Experience row, first in the list: Core Natural Resources** (`core.png` is already in
    `public/logos`).
    - Kind: Internship. Role: Cloud & Data Engineering Intern (the ML Systems resume's title; the AI Eng
      one says "AI/ML Engineering Intern, Cloud & Data", and the site should carry one).
    - May 2026 — Present, Canonsburg, PA, marked current.
    - Blurb:
      > Co-built, with one other engineer, a serverless AWS platform that automates shift-incentive
      > payroll for about 3,100 employees across nine underground mines and six prep plants. I own the
      > payout engine, with idempotent reruns and source-to-payout lineage. Also built a research tool
      > with cited Bedrock answers over SEC filings and earnings calls, and I'm now building an LLM agent
      > that drafts Oracle purchase requisitions from plain-English requests, with confidence-gated
      > abstention and human approval.
    - Chips: Lambda, AppSync GraphQL, Aurora PostgreSQL, Step Functions, Terraform, Glue/Spark, DMS,
      Amazon Bedrock.
    - Hover: the "A photo from Core goes here" placeholder.
14. **CMU row.**
    - Coursework chips change to the resumes' list: 10-714 Deep Learning Systems, 18-749 Building
      Reliable Distributed Systems, 18-763 Systems & Toolchains for AI Engineers, 18-661 Intro to ML for
      Engineers, and 18-613 Foundations of Computer Systems.
    - 17-745 ML in Production is dropped, since neither resume lists it.
    - The blurb is matched to that list.
15. **Baron row.**
    - Blurb:
      > Built Python and SQL ETL pipelines that pull Sage Intacct ERP data into customer, supplier and
      > sales datasets (10K+ records) in S3, after a QuickBooks-to-Sage migration had left the business
      > with no reporting, and delivered its first operational dashboard, with supplier lead-time
      > tracking and demand forecasting.
    - Dropped because the resumes no longer claim it: "anomaly detection" and "feature-ready".
16. **USC row.**
    - Dates become May 2024 — Jun 2025.
    - The blurb follows the resume: 0.93 SSIM on cubic lattices, then a comparison with a shared-encoder,
      dual-decoder model tuned by DARTS architecture search on an HPC cluster.
    - Dropped: "improved accuracy by 20%" and "100K images", which the resumes no longer claim.
17. **Projects.**
    - **Forge.** The tagline becomes "An ML experimentation and serving platform". The body adds two
      things:
      - The production fix: a slowdown traced to thread oversubscription, taking latency from
        100–400 ms to under 5 ms.
      - The agent: LangGraph and Claude, with 8 database-backed tools and pgvector search over live
        benchmark data.
    - **Ladies on the Links.** "Run the league's stack for a paying client". The automation line
      becomes the real pipeline: GitHub issue → Claude Code Action → AI review → Playwright tests →
      auto-merge. Playwright is added to the chips.
    - **New: LoRA Fine-Tuning and Serving in Needle** (CMU 10-714, Fall 2026). Badge: "In progress".
      Third in the list, after Ladies on the Links.
      - Body: inference for LoRA fine-tuned transformers in Needle, a from-scratch Python/C++/CUDA
        framework, with an autoregressive generate loop and merged vs. unmerged weights. Latency,
        throughput and memory are being benchmarked across adapter ranks and batch sizes, with
        multi-adapter batched serving and KV caching in progress.
      - There is no recording yet, so `ProjectCard` gets a no-media state: a quiet panel reading "In
        progress, Fall 2026" where the video would be. It's tested; a card with neither video nor
        poster renders no `<img>`.
      - I'll add it to `docs/project-rankings.md`.
    - **Fault-Tolerant Replicated Service.** The tagline loses "production-grade" and "zero dropped
      requests". It becomes "A replicated service that fails over automatically when replicas crash",
      matching the resume.
18. **Leadership.**
    - "PA-Eta" becomes "PA-Theta".
    - The president row adds "the #1 GPA of 24 fraternities". "USC Greek Hall of Fame" stays (it's on
      your earlier draft).
19. **Not added:** a resume download. Both PDFs carry your phone number. If you want one, I'd publish a
    copy without it.
20. **GitHub profile README** (`docs/github-readme/`; you paste it into the jtmoot/jtmoot repo
    yourself).
    - The "now" line reads "ms in ece at carnegie mellon, building forge". It becomes "ms in ece at
      carnegie mellon, cloud & data engineering intern at core natural resources", and "building forge"
      moves to the projects list.
    - The banner's role becomes "ml systems and ai engineer", and I regenerate it with
      `tools/readme/make_banner.py`.

## Decisions for you

All settled Nov 2: click cleaned, Railway Postgres, café jazz in creative mode, PA-Theta. Only approval
of the plan remains.

The click audition files, also in `~/Desktop/click-candidates/` (with `all in a row.mp3`), are in
`/private/tmp/claude-501/-Users-joshuamoorehead-Projects/b116acc4-0a1a-46a2-8835-46b4d5cf8299/scratchpad/sounds/`:

- `current-click.mp3`: what plays now.
- `a-pencil-tick.mp3` and `a2-pencil-tick.mp3`: a 70 ms pencil stroke cut from the pencil recording,
  denoised. **Recommended**, since you liked the pencil.
- `b-click-clean.mp3`: the same click with its noisy tail removed (45 ms).
- `c-synth-tock.mp3`: a generated wooden tock with no recording noise at all.
- `old-pencil-name.mp3` and `current-typing.mp3`: the old and new name sounds, for comparison.

Order: A1 → A3, then B4–B5, D9–D10, and C6–C8 last (it needs your accounts). One commit per item.
