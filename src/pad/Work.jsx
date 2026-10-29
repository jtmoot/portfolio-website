import ProjectCard from "./ProjectCard.jsx";
import { PROJECTS } from "../content/data.js";

/** Things Joshua has built, two to a row. */
export default function Work() {
  return (
    <section id="work" aria-labelledby="work-h">
      <h2 id="work-h">things i&apos;ve built</h2>
      <div className="cards">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
