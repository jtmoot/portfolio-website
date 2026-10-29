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

export const PROJECTS = [
  {
    id: "forge",
    index: "01",
    title: "Forge",
    tagline: "ML experiment tracking with hardware-aware profiling",
    body: "Full-stack platform for running, tracking, and analyzing ML experiments on financial time-series. Airflow-orchestrated ingestion, per-run GPU/CPU profiling, and a LangGraph agent that answers questions about your experiments in plain English.",
    stack: ["FastAPI", "Next.js", "Airflow", "PyTorch", "LangGraph", "Railway"],
    links: [
      { label: "Live", href: "https://forgelab.up.railway.app" },
      { label: "GitHub", href: "https://github.com/joshuamoorehead" },
    ],
  },
  {
    id: "lorier",
    index: "02",
    title: "Lorier Restock Monitor",
    tagline: "Zero-dependency watch-drop alerting",
    body: "Stdlib-only Python that polls Shopify product endpoints every five minutes on GitHub Actions and pushes an instant phone alert the moment a sold-out watch flips to in-stock. State is committed back to the repo, so it never double-fires.",
    stack: ["Python", "GitHub Actions", "ntfy.sh", "Shopify JSON"],
    links: [{ label: "GitHub", href: "https://github.com/jtmoot/lorier-restock-monitor" }],
  },
  {
    id: "baron",
    index: "03",
    title: "Baron Filtration Analytics",
    tagline: "Medallion data lake + demand forecasting",
    body: "Unified two ERPs (QuickBooks Desktop and Sage Intacct) into a bronze/silver/gold lake on S3, modeled with dbt, queried through Athena, surfaced in Metabase. Terraform-managed AWS with a forecasting layer for filter distribution operations.",
    stack: ["AWS", "Terraform", "dbt", "Athena", "Metabase", "Python"],
    links: [{ label: "Case study", href: "#contact" }],
  },
  {
    id: "marcus",
    index: "04",
    title: "Marcus",
    tagline: "Hierarchical multi-agent orchestration",
    body: "An orchestrator that spawns specialist subagents on demand, backed by a three-layer PARA memory, Docker sandboxing, scheduled GitHub Actions workflows, and Discord/Telegram integration. Built to learn where agent hierarchies actually pay off — and where they don't.",
    stack: ["OpenClaw", "Docker", "GitHub Actions", "Discord", "Telegram"],
    links: [{ label: "GitHub", href: "https://github.com/joshuamoorehead" }],
  },
];

export const TIMELINE = [
  {
    when: "2026 — 2027",
    what: "MS Electrical & Computer Engineering, AI/ML Systems",
    where: "Carnegie Mellon University · expected Dec 2027",
  },
  {
    when: "Summer 2026",
    what: "Agent infrastructure — Motus platform",
    where: "Lithos AI",
  },
  {
    when: "2025",
    what: "Data Engineering Intern",
    where: "Baron Filtration · medallion lake, dbt, AWS",
  },
  {
    when: "2024 — 2025",
    what: "ML Research — autoencoders for crystallographic image reconstruction",
    where: "University of South Carolina",
  },
  {
    when: "2021 — 2025",
    what: "BS, led a 200+ member chapter; now its advisor at CMU",
    where: "University of South Carolina",
  },
];

export const LINKS = {
  email: "mailto:jtmoorehead1@gmail.com",
  github: "https://github.com/joshuamoorehead",
  linkedin: "https://www.linkedin.com/in/joshuamoorehead",
};
