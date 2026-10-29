import { useEffect, useRef, useState } from "react";

/**
 * Starts a video, ignoring autoplay refusals and missing elements.
 * @param {HTMLVideoElement | null} video
 * @returns {Promise<void>}
 */
export async function startPlayback(video) {
  if (!video?.play) return;
  try {
    await video.play();
  } catch {
    // Autoplay blocked or the file failed: the poster frame stays up.
  }
}

const still = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const ARROW = (
  <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/**
 * A project card, Garvit style: the demo in a browser window (with play and pause), a numbered
 * kind line with a badge, the name and a handwritten subtitle, the write-up, chips, and a footer
 * that leads with "launch live" and keeps the code link on the right. The clip plays while at
 * least half of it is in view.
 * @param {{ project: object, n?: number, wide?: boolean, tape?: number }} props
 */
export default function ProjectCard({ project, n = 1, wide = false, tape = 0 }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const { title, tagline, video, poster, links, kind, badge, url, body, stack = [] } = project;
  const live = links.find((l) => l.label === "live");
  const code = links.find((l) => l.label === "github");
  const rest = links.filter((l) => l !== live && l !== code);

  useEffect(() => {
    const v = ref.current;
    if (!v || still() || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting && !v.dataset.held ? startPlayback(v) : v.pause()),
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      delete v.dataset.held;
      startPlayback(v);
      setPaused(false);
    } else {
      v.dataset.held = "1";
      v.pause();
      setPaused(true);
    }
  };

  return (
    <article className="card" data-wide={wide || undefined}>
      <span className={`tape card-tape t${tape}`} aria-hidden="true" />
      <div className="win">
        <div className="win-bar">
          <i />
          <i />
          <i />
          <span className="win-title">{url || project.id}</span>
        </div>
        <div className="win-screen">
          {video ? (
            <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={`${title}, screen recording`}>
              <source src={`${video}.webm`} type="video/webm" />
              <source src={`${video}.mp4`} type="video/mp4" />
            </video>
          ) : (
            <img src={poster} alt={`${title}, screenshot`} loading="lazy" />
          )}
          {video && (
            <button type="button" className="vid-btn" onClick={toggle} aria-label={paused ? "Play video" : "Pause video"} data-c="ring">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="card-body">
        <p className="card-meta">
          <span className="hand">
            № {String(n).padStart(3, "0")}
            {kind && ` · ${kind}`}
          </span>
          {badge && <span className="badge">[{badge}]</span>}
        </p>
        <h3 className="card-title">{title}</h3>
        <p className="card-line hand">{tagline}</p>
        {body && <p className="card-text">{body}</p>}
        {stack.length > 0 && (
          <ul className="chips">
            {stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        )}
        <p className="card-foot">
          {live && (
            <a className="go-live" href={live.href} target="_blank" rel="noreferrer" data-c="ring">
              <svg className="globe" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              launch live{ARROW}
            </a>
          )}
          {rest.map((l) => (
            <a key={l.href} className="go-more" href={l.href} target="_blank" rel="noreferrer" data-c="ring">
              {l.label}
              {ARROW}
            </a>
          ))}
          {code && (
            <a className="go-code" href={code.href} target="_blank" rel="noreferrer" data-c="ring">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
              </svg>
              github
            </a>
          )}
        </p>
      </div>
    </article>
  );
}
