/** The typed intro. Placeholder copy until Joshua writes his own; marked tokens get the highlighter. */
export const INTRO = [
  { text: "i build " },
  { text: "ml systems", mark: true },
  { text: " and the data plumbing under them. right now that means an ms in ece at " },
  { text: "carnegie mellon", mark: true },
  { text: ", an experiment tracker called " },
  { text: "forge", mark: true },
  { text: ", and too many games on " },
  { text: "chess.com", mark: true },
  { text: ". off the keyboard: barbells, sprints, short ribs, and history books." },
];

export const ROLE = "ml systems engineer";

export const SOCIALS = [
  { label: "github", href: "https://github.com/jtmoot", prev: "/previews/github.jpg", cap: "github, jtmoot" },
  { label: "linkedin", href: "https://www.linkedin.com/in/joshuamoorehead", ph: "linkedin screenshot goes here", cap: "linkedin" },
  { label: "email", href: "mailto:jtmoorehead1@gmail.com", ph: "jtmoorehead1@gmail.com", cap: "email" },
];

/** Featured projects, in the order of docs/project-rankings.md. Media lives in public/media. */
export const PROJECTS = [
  {
    id: "forge",
    title: "Forge",
    tagline: "ML experiment tracking with hardware-aware profiling",
    body: "Run, track and compare ML experiments on financial time series: Airflow-orchestrated ingestion, per-run GPU and CPU profiling, an efficiency frontier, a model registry, and a LangGraph agent that answers questions about your runs.",
    tag: "fastapi, airflow, pytorch",
    video: "/media/forge",
    poster: "/media/forge-poster.jpg",
    links: [
      { label: "live", href: "https://forgelab.up.railway.app" },
      { label: "github", href: "https://github.com/jtmoot/forge" },
    ],
  },
  {
    id: "lotl",
    title: "Ladies on the Links",
    tagline: "A golf league's site, maintained by an issue-to-PR pipeline",
    body: "Production site for a women's golf league. Members file an issue, Claude opens the pull request, it auto-merges; the tee sheet is Cloudflare-native and synced from Bookwhen.",
    tag: "cloudflare, workers",
    video: "/media/lotl",
    poster: "/media/lotl-poster.jpg",
    links: [
      { label: "live", href: "https://ladiesonthelinksgolf.com" },
      { label: "github", href: "https://github.com/jtmoot/lotl-site" },
    ],
  },
  {
    id: "distsys",
    title: "Distributed System",
    tagline: "A fault-tolerant replicated service",
    body: "Heartbeats, GFD and LFD membership, active and passive replication, checkpointing. Kill a backup and the detector notices, membership shrinks, and clients keep being served. CMU 18-749 team project.",
    tag: "replication, java",
    video: "/media/distsys",
    poster: "/media/distsys-poster.jpg",
    links: [{ label: "github", href: "https://github.com/C3viche/distributed-system" }],
  },
  {
    id: "robots",
    title: "Robot Learning",
    tagline: "PPO, SAC and model-based RL; LLM planning for a robot arm",
    body: "PPO against SAC against model-based RL on CarRacing-v3 (peak 685 at 960k steps), plus SayCan-Extended: GPT-3.5 planning, ViLD detection and direct PyBullet control with batching and caching.",
    tag: "rl, pybullet",
    video: "/media/carracing",
    poster: "/media/carracing-poster.jpg",
    links: [{ label: "github", href: "https://github.com/csce585-mlsystems/SayCan-Extended" }],
  },
  {
    id: "stm",
    title: "STM Autoencoders",
    tagline: "Denoising simulated microscope images",
    body: "Simulated scanning-tunnelling-microscope lattices and convolutional autoencoders that clean them, extended to a dual-decoder architecture search. Similarity about 0.93 on cubic lattices.",
    tag: "pytorch, research",
    video: "/media/stm",
    poster: "/media/stm-poster.jpg",
    links: [
      { label: "dualdec-stm", href: "https://github.com/jtmoot/DualDEC-STM" },
      { label: "reu", href: "https://github.com/jtmoot/ComputationalMicroscopyREU" },
    ],
  },
];

/** Experience rows. Stand-ins until the resume lands (Task 14); logos are initials until real files exist. */
export const EXPERIENCE = [
  { id: "cmu", company: "Carnegie Mellon University", role: "ms, electrical and computer engineering", dates: "2025 to now", now: true, initials: "cmu", logo: null, preview: null, ph: "a photo from cmu goes here" },
  { id: "baron", company: "Baron Filtration", role: "data engineering intern", dates: "2025", initials: "bf", logo: null, preview: null, ph: "a photo from baron goes here" },
  { id: "usc-reu", company: "University of South Carolina", role: "undergraduate research, computational microscopy", dates: "2024", initials: "usc", logo: null, preview: "/media/stm-reconstruction.jpg", ph: null },
];

/** Reading stack: placeholders until Joshua sends titles. */
export const READING = [
  { title: "a history book", note: "title to come" },
  { title: "a systems book", note: "title to come" },
  { title: "a philosophy book", note: "title to come" },
];

export const CHESS = { handle: "breakfast_enjoyer", href: "https://www.chess.com/member/breakfast_enjoyer" };
