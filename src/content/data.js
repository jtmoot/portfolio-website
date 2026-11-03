/** The typed intro; marked tokens get the highlighter. */
export const INTRO = [
  { text: "I build " },
  { text: "machine learning systems", mark: true },
  { text: " and the data infrastructure beneath them. I'm completing an MS in Electrical and Computer Engineering at " },
  { text: "Carnegie Mellon", mark: true },
  { text: ", focused on AI/ML systems, and interning at " },
  { text: "Core Natural Resources", mark: true },
  { text: ", where I co-built the AWS platform that pays shift incentives to 3,100 miners. Outside of work, I lift, run, cook, read history and play chess." },
];

export const ROLE = "ML systems and AI engineer";

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/jtmoot", prev: "/previews/github.jpg", cap: "GitHub, jtmoot" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/joshua-moorehead", prev: "/previews/linkedin.jpg", cap: "LinkedIn, joshua-moorehead" },
  { label: "Email", href: "mailto:josh.moorehead@outlook.com", ph: "josh.moorehead@outlook.com", cap: "Email" },
];

/** Featured projects, in the order of docs/project-rankings.md. Media lives in public/media. */
export const PROJECTS = [
  {
    id: "forge",
    title: "Forge",
    tagline: "An ML experimentation and serving platform",
    kind: "MLOps · model serving",
    badge: "Live product",
    url: "forgelab.up.railway.app",
    stack: ["PyTorch", "ONNX Runtime", "FastAPI", "Airflow", "pgvector", "LangGraph", "S3"],
    body: "End-to-end ML lifecycle on financial time series, through to serving: dynamic micro-batching and ONNX Runtime fp32/int8 backends behind an output-parity gate, load-tested at 20.3K req/s with 3.8 ms p99, 29x naive PyTorch. A production slowdown traced to thread oversubscription took latency from 100–400 ms to under 5 ms. Underneath: Airflow ingestion into Postgres and pgvector, PyTorch and XGBoost training tracked in W&B, hardware-aware profiling, a staged model registry on S3, and a LangGraph and Claude agent with 8 database-backed tools and pgvector search that answers plain-English questions over live benchmark data.",
    tag: "mlops, fastapi, langgraph",
    video: "/media/forge",
    poster: "/media/forge-poster.jpg",
    links: [
      { label: "live", href: "https://forgelab.up.railway.app" },
      { label: "serving", href: "https://forgelab.up.railway.app/serving" },
      { label: "github", href: "https://github.com/jtmoot/forge" },
    ],
  },
  {
    id: "lotl",
    title: "Ladies on the Links",
    tagline: "The full digital stack for a 300-member golf league",
    kind: "Web platform · small business",
    badge: "Live product",
    url: "ladiesonthelinksgolf.com",
    stack: ["Astro", "TypeScript", "Cloudflare Workers", "D1", "Email Workers", "GitHub Actions", "Playwright"],
    body: "I run the league's whole digital stack for a paying client, supporting over $60k in bookings: Bookwhen registration and booking, Google Workspace, stories with comments, events and merch. A live tee sheet parses Bookwhen booking emails in a Cloudflare Email Worker into D1. Site changes flow from a GitHub issue through a Claude Code Action, AI review and Playwright tests to auto-merge, so the owner can change the site herself.",
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
    tagline: "A replicated service that fails over automatically when replicas crash",
    kind: "Distributed systems · fault tolerance",
    badge: "Systems / Python",
    url: "github.com/C3viche/distributed-system",
    stack: ["Python", "Raw sockets", "Heartbeats", "Primary-backup", "Checkpointing"],
    body: "Python over TCP: two-tier failure detection, with local heartbeat detectors feeding a global membership service; active or primary-backup replication with checkpointing to bring backups up to date; and duplicate-reply suppression so each client gets exactly one answer. Kill a replica mid-traffic and the service fails over on its own. CMU 18-749 team project.",
    tag: "python, sockets, replication",
    video: "/media/distsys",
    poster: "/media/distsys-poster.jpg",
    links: [{ label: "github", href: "https://github.com/C3viche/distributed-system" }],
  },
  {
    id: "lora",
    title: "LoRA Fine-Tuning and Serving in Needle",
    tagline: "Serving LoRA fine-tuned transformers from a framework built from scratch",
    kind: "ML systems · CMU 10-714",
    badge: "In progress",
    url: "10-714 · needle",
    stack: ["Python", "C++", "CUDA", "Transformers", "LoRA", "KV cache"],
    body: "Inference for LoRA fine-tuned transformers in Needle, a deep learning framework written from scratch in Python, C++ and CUDA: an autoregressive generate loop, with merged and unmerged adapter weights. Now benchmarking latency, throughput and memory across adapter ranks and batch sizes, with multi-adapter batched serving and KV caching in progress.",
    tag: "needle, cuda, lora",
    video: null,
    poster: null,
    note: "In progress, Fall 2026",
    links: [],
  },
  {
    id: "robots",
    title: "Robot Learning",
    tagline: "LLM task planning for a robot arm, and RL agents that learn to drive",
    kind: "Robot learning · LLM planning",
    badge: "Research",
    url: "github.com/csce585-mlsystems/SayCan-Extended",
    stack: ["GPT-3.5", "ViLD", "PyBullet", "PPO", "SAC"],
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
    kind: "Computer vision · research",
    badge: "Research",
    url: "github.com/jtmoot/DualDEC-STM",
    stack: ["PyTorch", "Autoencoders", "Simulation"],
    body: "Simulated scanning-tunnelling-microscope lattices and convolutional autoencoders that clean them, extended to a dual-decoder architecture search. Similarity about 0.93 on cubic lattices.",
    tag: "pytorch, research",
    video: "/media/stm",
    poster: "/media/stm-poster.jpg",
    links: [
      { label: "DualDEC-STM", href: "https://github.com/jtmoot/DualDEC-STM" },
      { label: "REU", href: "https://github.com/jtmoot/ComputationalMicroscopyREU" },
    ],
  },
];

/** Experience rows, from the Nov 2026 resumes: 2 to 4 short bullets each. Logos live in public/logos. */
export const EXPERIENCE = [
  {
    id: "core",
    company: "Core Natural Resources",
    kind: "Internship",
    role: "Cloud & Data Engineering Intern",
    dates: "May 2026 — Present",
    place: "Canonsburg, PA",
    now: true,
    initials: "CORE",
    color: null,
    logo: "/logos/core.png",
    points: [
      "Co-built a serverless AWS payroll platform for 3,100 miners.",
      "Own the payout engine: idempotent reruns, source-to-payout lineage.",
      "Built cited Bedrock Q&A over SEC filings and earnings calls.",
      "Building an LLM agent that drafts Oracle requisitions for human approval.",
    ],
    stack: ["Lambda", "AppSync GraphQL", "Aurora PostgreSQL", "Step Functions", "Terraform", "Glue/Spark", "DMS", "Amazon Bedrock"],
    preview: null,
    ph: "A photo from Core goes here",
  },
  {
    id: "cmu",
    company: "Carnegie Mellon University",
    kind: "Graduate",
    role: "MS, Electrical and Computer Engineering · AI/ML Systems",
    dates: "2025 — Dec 2027",
    place: "Pittsburgh, PA",
    now: true,
    initials: "CMU",
    color: "#c41230",
    logo: "/logos/cmu.png",
    points: [
      "MS ECE, AI/ML systems concentration, graduating Dec 2027.",
      "Building LoRA serving in Needle, a from-scratch DL framework.",
      "Built a fault-tolerant replicated service with automatic failover.",
    ],
    stack: [
      "10-714 Deep Learning Systems",
      "18-749 Building Reliable Distributed Systems",
      "18-763 Systems & Toolchains for AI Engineers",
      "18-661 Intro to ML for Engineers",
      "18-613 Foundations of Computer Systems",
    ],
    preview: null,
    ph: "A photo from CMU goes here",
  },
  {
    id: "baron",
    company: "Baron Filtration",
    kind: "Internship",
    role: "Data Engineering Intern",
    dates: "Jun 2025 — Dec 2025",
    place: "Pittsburgh, PA",
    initials: "BF",
    color: null,
    logo: "/logos/baron.png",
    points: [
      "Built Python/SQL ETL from Sage Intacct into S3 (10K+ records).",
      "Restored reporting after a QuickBooks-to-Sage migration.",
      "Shipped the company's first operational dashboard.",
    ],
    stack: ["Python", "SQL", "AWS S3", "Sage Intacct", "Metabase"],
    preview: null,
    ph: "A photo from Baron goes here",
  },
  {
    id: "usc-reu",
    company: "University of South Carolina",
    kind: "Research",
    role: "Research Assistant, Department of Mathematics",
    dates: "May 2024 — Jun 2025",
    place: "Columbia, SC",
    initials: "USC",
    color: "#73000a",
    logo: "/logos/usc.png",
    points: [
      "Trained a PyTorch autoencoder on simulated STM images: 0.93 SSIM.",
      "Benchmarked a dual-decoder model tuned by DARTS on an HPC cluster.",
    ],
    stack: ["PyTorch", "Autoencoders", "Computer vision", "Simulation"],
    preview: "/media/stm-reconstruction.jpg",
    ph: null,
  },
];


export const CHESS = { handle: "breakfast_enjoyer", href: "https://www.chess.com/member/breakfast_enjoyer" };

export const RUNS = { href: "https://www.strava.com/athletes/121070736" };

/**
 * Leadership, from the resume. A bullet can link some of its words ({ text, link: { words, href } });
 * `posts` entries ({ label, href }) add links under the bullets.
 */
export const LEADERSHIP = [
  {
    id: "spe-advisor",
    company: "Sigma Phi Epsilon, PA-Theta",
    kind: "Advisor",
    role: "Chapter Advisor · Carnegie Mellon University",
    dates: "Jan 2026 — Present",
    place: "Pittsburgh, PA",
    now: true,
    initials: "ΣΦΕ",
    color: null,
    logo: "/logos/sigep-pa.png",
    points: [
      "Advise the executive board of CMU's largest fraternity (100+ members).",
    ],
    stack: [],
    posts: [],
  },
  {
    id: "spe-president",
    company: "Sigma Phi Epsilon, SC-Alpha",
    kind: "President",
    role: "Chapter President · University of South Carolina",
    dates: "Nov 2023 — Nov 2024",
    place: "Columbia, SC",
    initials: "ΣΦΕ",
    color: null,
    logo: "/logos/sigep-sc.png",
    points: [
      "Led a 200-member chapter to the #1 GPA of 24 fraternities.",
      {
        text: "National Frank J. Ruck Leadership Award; USC Greek Hall of Fame.",
        link: { words: "Frank J. Ruck Leadership Award", href: "https://www.linkedin.com/posts/joshua-moorehead_proud-to-say-ive-been-recognized-with-two-share-7307454972512616451-z_Sr/" },
      },
    ],
    stack: [],
    posts: [],
  },
];
