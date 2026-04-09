import { useState } from "react";
import Card from "./Card.jsx";
import StatusBadge from "./StatusBadge.jsx";
import AnimatedCounter from "./AnimatedCounter.jsx";
import GitHubProjects from "./GitHubProjects.jsx";
import ScrollReveal from "./ScrollReveal.jsx";

const PROJECTS = [
  {
    name: "Forge",
    tagline: "ML Experimentation & Agent Ops Platform",
    description: "Full-stack platform for running, tracking, and analyzing ML experiments on financial data. Hardware-aware profiling, LangGraph analysis agent, Airflow orchestration.",
    tech: ["FastAPI", "Next.js", "PostgreSQL", "PyTorch", "LangGraph", "Airflow", "Docker"],
    link: "https://forgelab.up.railway.app",
    github: "https://github.com/joshuamoorehead/forge",
    status: "live",
  },
  {
    name: "Marcus",
    tagline: "Hierarchical AI Agent Swarm",
    description: "Multi-layer autonomous agent system with PARA memory architecture, Gmail integration, Discord webhooks, and subagent orchestration via Claude.",
    tech: ["Claude API", "OpenRouter", "GitHub Actions", "Docker", "Node.js"],
    github: "https://github.com/joshuamoorehead",
    status: "active",
  },
  {
    name: "Agent Eval Workbench",
    tagline: "Multi-Agent Evaluation & Reliability Platform",
    description: "Benchmark harness for measuring agent team performance — task completion, coordination overhead, cost tracking, and configuration comparison.",
    tech: ["Python", "Anthropic API", "FastAPI", "React"],
    status: "building",
  },
];

const SKILLS = [
  { category: "ML & AI", items: ["PyTorch", "scikit-learn", "XGBoost", "LangChain", "LangGraph", "Reinforcement Learning"] },
  { category: "Infrastructure", items: ["Docker", "Kubernetes", "Airflow", "AWS", "GitHub Actions", "PostgreSQL"] },
  { category: "Backend", items: ["FastAPI", "Python", "SQLAlchemy", "Alembic", "Node.js"] },
  { category: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "TypeScript"] },
];

const EXPERIENCE_ITEMS = [
  { role: "MS ECE", org: "Carnegie Mellon University", period: "2025 – 2027", detail: "ML/Data Infrastructure focus", icon: "🎓" },
  { role: "BE Computer Engineering", org: "University of South Carolina", period: "2021 – 2025", detail: "3.89 GPA · Sigma Phi Epsilon President", icon: "🎓" },
];

const RESEARCH = [
  { title: "Multimodal Emotion Recognition", detail: "PAtt-Lite + BERT, deployed on Raspberry Pi 5" },
  { title: "STM Image Analysis", detail: "Convolutional autoencoder, 92.7% structural similarity" },
  { title: "Enhanced SayCan Framework", detail: "Improved robotic control via deep learning" },
  { title: "Deep Learning Solver", detail: "200x speedup over traditional methods" },
];

export default function Portfolio({ ready = true }) {
  const [activeSkillCategory, setActiveSkillCategory] = useState(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          overflow: hidden;
        }

        .profile-card { grid-column: span 4; grid-row: span 2; }
        .stats-card { grid-column: span 4; }
        .focus-card { grid-column: span 4; }
        .project-card { grid-column: span 4; }
        .skills-card { grid-column: span 8; }
        .education-card { grid-column: span 4; }
        .research-card { grid-column: span 6; }
        .links-card { grid-column: span 6; }
        .github-card { grid-column: span 12; }

        .github-inner-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 900px) {
          .bento-grid { grid-template-columns: 1fr 1fr; }
          .profile-card, .stats-card, .focus-card, .project-card,
          .skills-card, .education-card, .research-card, .links-card,
          .github-card {
            grid-column: span 2;
          }
          .stats-card, .focus-card { grid-column: span 1; }
          .github-inner-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 580px) {
          .bento-grid { grid-template-columns: 1fr; gap: 12px; padding: 20px 16px 60px; }
          .profile-card, .stats-card, .focus-card, .project-card,
          .skills-card, .education-card, .research-card, .links-card,
          .github-card {
            grid-column: span 1;
          }
          .github-inner-grid { grid-template-columns: 1fr; }
        }

        .social-link {
          display: inline-flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--bg-tag); color: var(--text-secondary); text-decoration: none;
          transition: all 0.2s;
          font-size: 16px;
        }
        .social-link:hover { background: var(--bg-active-link); color: var(--text-active-link); transform: scale(1.08); }

        .tag {
          display: inline-block; padding: 4px 12px; border-radius: 8px;
          background: var(--bg-tag); color: var(--text-secondary); font-size: 12px;
          font-weight: 500; letter-spacing: 0.2px;
          font-family: 'DM Sans', sans-serif;
        }

        .skill-tab {
          padding: 6px 14px; border-radius: 10px; border: none;
          background: transparent; color: var(--text-muted); font-size: 13px;
          font-weight: 500; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .skill-tab:hover { color: var(--text-secondary); }
        .skill-tab.active { background: var(--bg-active-tab); color: var(--text-active-tab); }

        .project-link {
          display: inline-flex; align-items: center; gap: 5px;
          color: var(--text-primary); text-decoration: none; font-size: 12px;
          font-weight: 600; padding: 6px 12px; border-radius: 8px;
          background: var(--bg-tag); transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .project-link:hover { background: var(--bg-active-link); color: var(--text-active-link); }
      `}</style>

      <div className="bento-grid">
        {/* PROFILE CARD */}
        <ScrollReveal ready={ready} className="profile-card" direction="left" delay={0}>
          <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{
              width: 90, height: 90, borderRadius: 22,
              background: "linear-gradient(135deg, #333 0%, #555 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 32, fontWeight: 700,
              fontFamily: "'Newsreader', serif",
              marginBottom: 20,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}>
              JM
            </div>

            <h1 style={{
              fontSize: 26, fontWeight: 700, color: "var(--text-primary)",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.15, marginBottom: 4,
            }}>
              Joshua Moorehead
            </h1>

            <p style={{
              fontSize: 14, color: "var(--text-muted)", fontWeight: 400,
              lineHeight: 1.5, marginBottom: 16,
            }}>
              ML Infrastructure & Agent Engineering
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 13 }}>🎓</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Carnegie Mellon University · MS ECE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              <span style={{ fontSize: 13 }}>📍</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Pittsburgh, PA</span>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <a href="https://github.com/joshuamoorehead" target="_blank" className="social-link" title="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com/in/joshuamoorehead" target="_blank" className="social-link" title="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="mailto:jtmooreh@andrew.cmu.edu" className="social-link" title="Email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
              </a>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
              {["ML Systems", "Agent Engineering", "Inference Optimization", "Full-Stack"].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* STATS CARD */}
        <ScrollReveal ready={ready} className="stats-card" direction="bottom" delay={0.1}>
          <Card style={{ height: "100%" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-hint)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
              By the numbers
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { value: 3.89, label: "GPA", suffix: "" },
                { value: 10, label: "Projects", suffix: "+" },
                { value: 6, label: "ML Models", suffix: "" },
                { value: 25, label: "Companies Tracked", suffix: "+" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
                    {i === 0 ? "3.89" : <AnimatedCounter target={s.value} suffix={s.suffix} />}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-hint)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* CURRENT FOCUS CARD */}
        <ScrollReveal ready={ready} className="focus-card" direction="right" delay={0.2}>
          <Card style={{
            height: "100%",
            background: "var(--bg-dark-card)",
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-hint)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
              Currently
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { emoji: "🔬", text: "Robot Learning & RL at CMU" },
                { emoji: "🏗️", text: "Building Forge ML Platform" },
                { emoji: "🤖", text: "Multi-agent orchestration" },
                { emoji: "🔍", text: "ML Infra job search" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{ fontSize: 13, color: "var(--text-on-dark)", fontWeight: 400 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* PROJECT CARDS */}
        {PROJECTS.map((project, i) => (
          <ScrollReveal ready={ready} key={i} className="project-card" direction={i === 0 ? "left" : i === 2 ? "right" : "bottom"} delay={i * 0.1}>
            <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8, fontStyle: "italic", fontFamily: "'Newsreader', serif" }}>
                {project.tagline}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 14, flex: 1 }}>
                {project.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                {project.tech.slice(0, 5).map(t => (
                  <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>
                ))}
                {project.tech.length > 5 && (
                  <span className="tag" style={{ fontSize: 11 }}>+{project.tech.length - 5}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {project.link && (
                  <a href={project.link} target="_blank" className="project-link">
                    <span>↗</span> Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" className="project-link">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    Code
                  </a>
                )}
              </div>
            </Card>
          </ScrollReveal>
        ))}

        {/* GITHUB PROJECTS */}
        <ScrollReveal ready={ready} className="github-card" direction="bottom" delay={0}>
          <Card>
            <GitHubProjects />
          </Card>
        </ScrollReveal>

        {/* SKILLS CARD */}
        <ScrollReveal ready={ready} className="skills-card" direction="left" delay={0}>
          <Card style={{ height: "100%" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-hint)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
              Tech Stack
            </p>
            <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
              {SKILLS.map((s, i) => (
                <button
                  key={i}
                  className={`skill-tab ${activeSkillCategory === i ? "active" : ""}`}
                  onClick={() => setActiveSkillCategory(i)}
                >
                  {s.category}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SKILLS[activeSkillCategory].items.map(skill => (
                <span key={skill} style={{
                  padding: "8px 16px", borderRadius: 10,
                  background: "var(--bg-tag)", color: "var(--text-secondary)",
                  fontSize: 13, fontWeight: 500,
                  transition: "all 0.2s",
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* EDUCATION CARD */}
        <ScrollReveal ready={ready} className="education-card" direction="right" delay={0.1}>
          <Card style={{ height: "100%" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-hint)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
              Education
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {EXPERIENCE_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "var(--bg-tag)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{item.role}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.org}</div>
                    <div style={{ fontSize: 11, color: "var(--text-hint)", marginTop: 2 }}>{item.period} · {item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* RESEARCH CARD */}
        <ScrollReveal ready={ready} className="research-card" direction="left" delay={0}>
          <Card style={{ height: "100%" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-hint)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
              Research & Projects
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {RESEARCH.map((item, i) => (
                <div key={i} style={{
                  padding: "12px 16px", borderRadius: 12,
                  background: "var(--bg-research-item)",
                  borderLeft: "3px solid var(--text-primary)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{item.detail}</div>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* CONNECT CARD */}
        <ScrollReveal ready={ready} className="links-card" direction="right" delay={0.1}>
          <Card style={{
            height: "100%",
            background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-connect-end) 100%)",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            textAlign: "center",
          }}>
            <p style={{
              fontSize: 22, fontWeight: 700, color: "var(--text-primary)",
              fontFamily: "'Newsreader', serif",
              fontStyle: "italic",
              lineHeight: 1.4,
              marginBottom: 8,
              maxWidth: 320,
            }}>
              Building the infrastructure that makes AI agents reliable.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Open to ML Systems, Agent Engineering, and Infrastructure roles.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="mailto:jtmooreh@andrew.cmu.edu" className="project-link" style={{
                background: "var(--bg-active-link)", color: "var(--text-active-link)", padding: "10px 20px", borderRadius: 12,
                fontSize: 13,
              }}>
                Get in touch
              </a>
              <a href="https://github.com/joshuamoorehead" target="_blank" className="project-link" style={{
                padding: "10px 20px", borderRadius: 12, fontSize: 13,
              }}>
                View GitHub
              </a>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </>
  );
}
