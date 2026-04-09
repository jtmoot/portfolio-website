import { useState, useEffect } from "react";
import { fetchRepos } from "../utils/github.js";
import LANGUAGE_COLORS from "../utils/languageColors.js";

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Updated ${days}d ago`;
  const months = Math.floor(days / 30);
  return `Updated ${months}mo ago`;
}

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ForkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
    <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" /><path d="M12 12v3" />
  </svg>
);

function SkeletonCard() {
  return (
    <div style={{
      background: "var(--bg-tag)",
      borderRadius: 12,
      padding: 20,
      animation: "pulse 1.5s infinite",
    }}>
      <div style={{ height: 16, width: "60%", background: "var(--bg-card)", borderRadius: 6, marginBottom: 10 }} />
      <div style={{ height: 12, width: "100%", background: "var(--bg-card)", borderRadius: 6, marginBottom: 6 }} />
      <div style={{ height: 12, width: "80%", background: "var(--bg-card)", borderRadius: 6, marginBottom: 14 }} />
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ height: 12, width: 50, background: "var(--bg-card)", borderRadius: 6 }} />
        <div style={{ height: 12, width: 30, background: "var(--bg-card)", borderRadius: 6 }} />
        <div style={{ height: 12, width: 30, background: "var(--bg-card)", borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function GitHubProjects() {
  const [repos, setRepos] = useState(null);

  useEffect(() => {
    fetchRepos().then(setRepos);
  }, []);

  const loading = repos === null;
  const filtered = repos ? repos.filter((r) => !r.fork).slice(0, 6) : [];
  const empty = repos && filtered.length === 0;

  return (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 600, color: "var(--text-hint)",
        letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16,
      }}>
        Open Source
      </p>

      {loading && (
        <div className="github-inner-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {empty && (
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Check out my repos on{" "}
          <a href="https://github.com/joshuamoorehead" target="_blank"
            style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "none" }}>
            GitHub →
          </a>
        </p>
      )}

      {!loading && !empty && (
        <>
          <div className="github-inner-grid">
            {filtered.map((repo) => (
              <div key={repo.name} style={{
                background: "var(--bg-tag)",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                flexDirection: "column",
              }}>
                <a href={repo.html_url} target="_blank" style={{
                  fontSize: 14, fontWeight: 700, color: "var(--text-primary)",
                  textDecoration: "none", marginBottom: 6,
                  display: "block",
                }}>
                  {repo.name}
                </a>

                <p style={{
                  fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5,
                  marginBottom: 12, flex: 1,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {repo.description || "No description"}
                </p>

                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  fontSize: 11, color: "var(--text-hint)", flexWrap: "wrap",
                }}>
                  {repo.language && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: LANGUAGE_COLORS[repo.language] || "var(--text-muted)",
                        display: "inline-block", flexShrink: 0,
                      }} />
                      {repo.language}
                    </span>
                  )}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <StarIcon /> {repo.stargazers_count}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <ForkIcon /> {repo.forks_count}
                  </span>
                  <span>{relativeTime(repo.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, textAlign: "right" }}>
            <a href="https://github.com/joshuamoorehead" target="_blank" style={{
              fontSize: 12, fontWeight: 600, color: "var(--text-primary)",
              textDecoration: "none",
            }}>
              View all on GitHub →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
