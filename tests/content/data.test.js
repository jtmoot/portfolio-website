import { existsSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { EXPERIENCE, INTRO, LEADERSHIP, PROJECTS, ROLE, SOCIALS } from "../../src/content/data.js";

// Vitest runs from the repo root.
const inPublic = (url) => existsSync(`public${url}`);

describe("socials", () => {
  it("previews LinkedIn with the profile screenshot, not a placeholder", () => {
    const linkedin = SOCIALS.find((s) => s.label === "LinkedIn");
    expect(linkedin.href).toBe("https://www.linkedin.com/in/joshua-moorehead");
    expect(linkedin.prev).toBe("/previews/linkedin.jpg");
    expect(linkedin.ph).toBeUndefined();
    expect(inPublic(linkedin.prev)).toBe(true);
  });
});

describe("leadership content", () => {
  it("names the CMU chapter PA-Theta and gives both chapters their logos", () => {
    const [advisor, president] = LEADERSHIP;
    expect(advisor.company).toBe("Sigma Phi Epsilon, PA-Theta");
    expect(advisor.logo).toBe("/logos/sigep-pa.png");
    expect(president.logo).toBe("/logos/sigep-sc.png");
    for (const row of LEADERSHIP) expect(inPublic(row.logo)).toBe(true);
  });

  it("links the president row to the LinkedIn post on the Ruck award and Hall of Fame, without tracking", () => {
    expect(LEADERSHIP[1].posts).toEqual([
      { label: "The award and Hall of Fame, on LinkedIn", href: "https://www.linkedin.com/posts/joshua-moorehead_proud-to-say-ive-been-recognized-with-two-share-7307454972512616451-z_Sr/" },
    ]);
  });

  it("carries the president row's GPA standing from the resume", () => {
    expect(LEADERSHIP[1].points.join(" ")).toContain("#1 GPA of 24 fraternities");
  });
});

describe("content from the Nov 2 resumes", () => {
  const text = (items) => JSON.stringify(items);
  const row = (id) => EXPERIENCE.find((x) => x.id === id);

  it("names both tracks in the role line and puts Core in the intro", () => {
    expect(ROLE).toBe("ML systems and AI engineer");
    const intro = INTRO.map((t) => t.text).join("");
    expect(intro).toContain("Core Natural Resources");
    expect(intro).toContain("3,100");
    expect(INTRO.find((t) => t.text === "Core Natural Resources").mark).toBe(true);
  });

  it("leads Experience with the Core internship, current, with its logo", () => {
    const core = EXPERIENCE[0];
    expect(core).toMatchObject({ id: "core", company: "Core Natural Resources", kind: "Internship", role: "Cloud & Data Engineering Intern", dates: "May 2026 — Present", place: "Canonsburg, PA", now: true, logo: "/logos/core.png" });
    expect(inPublic(core.logo)).toBe(true);
    for (const s of ["3,100", "payout engine", "Bedrock", "requisitions"]) expect(core.points.join(" ")).toContain(s);
    expect(core.stack).toEqual(["Lambda", "AppSync GraphQL", "Aurora PostgreSQL", "Step Functions", "Terraform", "Glue/Spark", "DMS", "Amazon Bedrock"]);
  });

  it("lists the resumes' CMU coursework", () => {
    expect(row("cmu").stack).toEqual([
      "10-714 Deep Learning Systems",
      "18-749 Building Reliable Distributed Systems",
      "18-763 Systems & Toolchains for AI Engineers",
      "18-661 Intro to ML for Engineers",
      "18-613 Foundations of Computer Systems",
    ]);
  });

  it("claims nothing the resumes no longer do", () => {
    const all = text({ EXPERIENCE, PROJECTS });
    for (const s of ["anomaly detection", "feature-ready", "improved accuracy by 20%", "100K", "production-grade", "zero dropped requests"]) expect(all).not.toContain(s);
    expect(row("baron").points.join(" ")).toContain("QuickBooks-to-Sage migration");
    expect(row("usc-reu").dates).toBe("May 2024 — Jun 2025");
    expect(row("usc-reu").points.join(" ")).toContain("DARTS");
  });

  it("adds the LoRA project fourth (a two-up slot, since the third card is wide and led by its video), in progress and without media, and the real details to Forge and LOTL", () => {
    expect(PROJECTS.map((p) => p.id).slice(0, 4)).toEqual(["forge", "lotl", "distsys", "lora"]);
    const lora = PROJECTS[3];
    expect(lora).toMatchObject({ title: "LoRA Fine-Tuning and Serving in Needle", badge: "In progress", video: null, poster: null });
    expect(PROJECTS[0].body).toContain("thread oversubscription");
    expect(PROJECTS[0].body).toContain("8 database-backed tools");
    expect(PROJECTS[1].body).toContain("Claude Code Action");
    expect(PROJECTS[1].stack).toContain("Playwright");
    expect(PROJECTS.find((p) => p.id === "distsys").tagline).toBe("A replicated service that fails over automatically when replicas crash");
  });
});

describe("experience and leadership as short, strong bullets", () => {
  const rows = [...EXPERIENCE, ...LEADERSHIP];

  it("gives every row 1 to 4 bullets in place of a paragraph", () => {
    for (const x of rows) {
      expect(x.blurb).toBeUndefined();
      expect(x.points.length).toBeGreaterThanOrEqual(1);
      expect(x.points.length).toBeLessThanOrEqual(4);
    }
  });

  it("keeps each bullet to about 12 words, verb or fact first, ending in a full stop", () => {
    for (const p of rows.flatMap((x) => x.points)) {
      expect(p.split(/\s+/).length).toBeLessThanOrEqual(12);
      expect(p).toMatch(/^[A-Z#0-9]/);
      expect(p).toMatch(/\.$/);
    }
  });
});
