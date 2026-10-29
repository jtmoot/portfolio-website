import ProjectCard from "./ProjectCard.jsx";
import { PROJECTS } from "../content/data.js";

/** Garvit's rhythm: two cards side by side, then one wide card, repeating. */
export const isWide = (i) => i % 3 === 2;

/** Things Joshua has built and shipped. */
export default function Work() {
  return (
    <section id="work" aria-labelledby="work-h">
      <h2 id="work-h">things i&apos;ve built &amp; shipped</h2>
      <div className="cards">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} n={i + 1} wide={isWide(i)} tape={i % 4} />
        ))}
      </div>
    </section>
  );
}
