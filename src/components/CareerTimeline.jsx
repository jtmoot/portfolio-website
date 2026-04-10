import { useState, useEffect, useRef } from "react";

const MILESTONES = [
  { year: "2021", label: "Started at USC", detail: "Computer Engineering", future: false },
  { year: "2022", label: "SigEp President", detail: "Sigma Phi Epsilon", future: false },
  { year: "2023", label: "Emotion Recognition", detail: "Multimodal Research", future: false },
  { year: "2024", label: "STM + SayCan", detail: "Image Analysis & Robotics", future: false },
  { year: "2025", label: "USC Grad · CMU", detail: "3.89 GPA · MS ECE", future: false },
  { year: "2026", label: "Forge · Marcus", detail: "Agent Swarm · Job Search", future: false, current: true },
  { year: "2027+", label: "ML Systems Engineer", detail: "Tech Lead · ???", future: true },
];

export default function CareerTimeline() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      setProgress(1);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgress(1);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <p style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--text-hint)",
        letterSpacing: 1.5,
        textTransform: "uppercase",
        marginBottom: 28,
      }}>
        Timeline
      </p>

      {/* Desktop: horizontal timeline */}
      <div className="timeline-horizontal" style={{
        position: "relative",
        padding: "40px 0 20px",
      }}>
        {/* SVG line */}
        <svg
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            width: "100%",
            height: 4,
            overflow: "visible",
          }}
          preserveAspectRatio="none"
        >
          {/* Background track */}
          <line
            x1="0"
            y1="2"
            x2="100%"
            y2="2"
            stroke="var(--bg-tag)"
            strokeWidth="2"
          />
          {/* Animated progress line */}
          <line
            x1="0"
            y1="2"
            x2="100%"
            y2="2"
            stroke="var(--accent-timeline)"
            strokeWidth="2"
            strokeDasharray="1000"
            strokeDashoffset={reducedMotion ? 0 : 1000 - (progress * 1000)}
            style={{
              transition: reducedMotion ? "none" : "stroke-dashoffset 1.5s ease-out",
            }}
          />
        </svg>

        {/* Nodes */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
        }}>
          {MILESTONES.map((m, i) => {
            const nodeProgress = progress;
            const nodeDelay = reducedMotion ? 0 : 0.3 + i * 0.18;
            const isVisible = nodeProgress === 1;

            return (
              <div
                key={m.year}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(10px)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.4s ease-out ${nodeDelay}s, transform 0.4s ease-out ${nodeDelay}s`,
                }}
              >
                {/* Label above (even index) or spacer */}
                {i % 2 === 0 ? (
                  <div style={{ textAlign: "center", marginBottom: 12, minHeight: 36 }}>
                    <div style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: m.current ? "var(--accent-timeline)" : m.future ? "var(--text-hint)" : "var(--text-primary)",
                    }}>
                      {m.label}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: m.future ? "var(--text-hint)" : "var(--text-muted)",
                      marginTop: 2,
                    }}>
                      {m.detail}
                    </div>
                  </div>
                ) : (
                  <div style={{ minHeight: 36 }} />
                )}

                {/* Node circle */}
                <div style={{
                  width: m.current ? 16 : 12,
                  height: m.current ? 16 : 12,
                  borderRadius: "50%",
                  background: m.future
                    ? "transparent"
                    : m.current
                    ? "var(--accent-timeline)"
                    : "var(--accent-timeline)",
                  border: m.future ? "2px dashed var(--text-hint)" : "2px solid var(--accent-timeline)",
                  position: "relative",
                  zIndex: 1,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: m.current && !reducedMotion
                    ? "timelinePulse 2s ease-in-out infinite"
                    : "none",
                  boxShadow: m.current
                    ? "0 0 0 4px var(--accent-timeline-pulse)"
                    : "none",
                }}>
                  {m.future && (
                    <span style={{
                      fontSize: 8,
                      fontWeight: 700,
                      color: "var(--text-hint)",
                      lineHeight: 1,
                    }}>?</span>
                  )}
                </div>

                {/* Year label always visible below node */}
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: m.current ? "var(--accent-timeline)" : m.future ? "var(--text-hint)" : "var(--text-secondary)",
                  marginTop: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {m.year}
                </div>

                {/* Label below (odd index) or spacer */}
                {i % 2 !== 0 ? (
                  <div style={{ textAlign: "center", marginTop: 4, minHeight: 36 }}>
                    <div style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: m.current ? "var(--accent-timeline)" : m.future ? "var(--text-hint)" : "var(--text-primary)",
                    }}>
                      {m.label}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: m.future ? "var(--text-hint)" : "var(--text-muted)",
                      marginTop: 2,
                    }}>
                      {m.detail}
                    </div>
                  </div>
                ) : (
                  <div style={{ minHeight: 36 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="timeline-vertical" style={{
        display: "none",
        position: "relative",
        paddingLeft: 28,
      }}>
        {/* Vertical SVG line */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 8,
            width: 4,
            height: "100%",
            overflow: "visible",
          }}
        >
          <line
            x1="2"
            y1="0"
            x2="2"
            y2="100%"
            stroke="var(--bg-tag)"
            strokeWidth="2"
          />
          <line
            x1="2"
            y1="0"
            x2="2"
            y2="100%"
            stroke="var(--accent-timeline)"
            strokeWidth="2"
            strokeDasharray="1000"
            strokeDashoffset={reducedMotion ? 0 : 1000 - (progress * 1000)}
            style={{
              transition: reducedMotion ? "none" : "stroke-dashoffset 1.5s ease-out",
            }}
          />
        </svg>

        {MILESTONES.map((m, i) => {
          const nodeDelay = reducedMotion ? 0 : 0.3 + i * 0.18;
          const isVisible = progress === 1;

          return (
            <div
              key={m.year}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                marginBottom: 24,
                position: "relative",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.4s ease-out ${nodeDelay}s, transform 0.4s ease-out ${nodeDelay}s`,
              }}
            >
              {/* Node circle (absolutely positioned on the line) */}
              <div style={{
                width: m.current ? 16 : 12,
                height: m.current ? 16 : 12,
                borderRadius: "50%",
                background: m.future
                  ? "transparent"
                  : "var(--accent-timeline)",
                border: m.future ? "2px dashed var(--text-hint)" : "2px solid var(--accent-timeline)",
                position: "absolute",
                left: m.current ? 0 : 2,
                top: 2,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: m.current && !reducedMotion
                  ? "timelinePulse 2s ease-in-out infinite"
                  : "none",
                boxShadow: m.current
                  ? "0 0 0 4px var(--accent-timeline-pulse)"
                  : "none",
              }}>
                {m.future && (
                  <span style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: "var(--text-hint)",
                    lineHeight: 1,
                  }}>?</span>
                )}
              </div>

              {/* Text content */}
              <div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: m.current ? "var(--accent-timeline)" : m.future ? "var(--text-hint)" : "var(--text-secondary)",
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 2,
                }}>
                  {m.year}
                </div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: m.current ? "var(--accent-timeline)" : m.future ? "var(--text-hint)" : "var(--text-primary)",
                }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: 12,
                  color: m.future ? "var(--text-hint)" : "var(--text-muted)",
                  marginTop: 2,
                }}>
                  {m.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
