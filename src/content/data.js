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
    tagline: "An MLOps platform for training, profiling and shipping models",
    body: "End-to-end ML lifecycle on financial time series: Airflow ingestion into Postgres and pgvector, PyTorch and XGBoost training tracked in W&B, hardware-aware latency and memory profiling with an efficiency frontier, a staged model registry on S3, Prometheus and Grafana monitoring, and a LangGraph agent that answers questions about your runs with tool calls and RAG.",
    tag: "mlops, fastapi, langgraph",
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
    tagline: "The full digital stack for a 300-member golf league",
    body: "Production platform for a women's golf league that booked over $60k this season: Bookwhen registration and booking, Google Workspace, stories with comments, events and merch. A live tee sheet parses Bookwhen booking emails in a Cloudflare Email Worker into D1. Automated fixes via GitHub Actions and issues, so the owner can change the site herself.",
    tag: "astro, cloudflare workers, d1, claude code",
    video: "/media/lotl",
    poster: "/media/lotl-poster.jpg",
    links: [
      { label: "live", href: "https://ladiesonthelinksgolf.com" },
      { label: "github", href: "https://github.com/jtmoot/lotl-site" },
    ],
  },
  {
    id: "distsys",
    title: "Fault-Tolerant Replicated Service",
    tagline: "A production-grade distributed system with automatic failover and zero dropped requests",
    body: "Python over raw sockets: local heartbeat detectors feed a global membership service, active or primary-backup replication with checkpointing to bring backups up to date, and request-number deduplication so each client gets exactly one reply. Kill a replica mid-traffic and clients never notice. CMU 18-749 team project.",
    tag: "python, sockets, replication",
    video: "/media/distsys",
    poster: "/media/distsys-poster.jpg",
    links: [{ label: "github", href: "https://github.com/C3viche/distributed-system" }],
  },
  {
    id: "robots",
    title: "Robot Learning",
    tagline: "LLM task planning for a robot arm, and RL agents that learn to drive",
    body: "SayCan-Extended: GPT-3.5 breaks natural-language instructions into steps, ViLD open-vocabulary detection grounds them in the scene, and the arm executes them in PyBullet, with batched and cached LLM calls to cut latency and cost. Plus PPO vs SAC vs model-based RL on CarRacing-v3 from pixels, peaking at 685 reward.",
    tag: "llm planning, rl, pybullet",
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
