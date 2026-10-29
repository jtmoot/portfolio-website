import { useEffect, useRef } from "react";

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

/**
 * A project in a window frame. The clip plays while at least half of it is in view.
 * @param {{ project: { id: string, title: string, tagline: string, tag: string, video: string | null, poster: string, links: { label: string, href: string }[] } }} props
 */
export default function ProjectCard({ project }) {
  const ref = useRef(null);
  const { title, tagline, tag, video, poster, links } = project;

  useEffect(() => {
    const v = ref.current;
    if (!v || still() || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? startPlayback(v) : v.pause()),
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <article className="card" data-c="ring">
      <div className="win">
        <div className="win-bar">
          <i />
          <i />
          <i />
          <span className="win-title">{project.id}</span>
          <span className="tag">{tag}</span>
        </div>
        {video ? (
          <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={`${title}, screen recording`}>
            <source src={`${video}.webm`} type="video/webm" />
            <source src={`${video}.mp4`} type="video/mp4" />
          </video>
        ) : (
          <img src={poster} alt={`${title}, screenshot`} loading="lazy" />
        )}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-line">{tagline}</p>
      <p className="card-links">
        {links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
      </p>
    </article>
  );
}
