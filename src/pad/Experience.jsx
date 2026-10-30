import Rows from "./Rows.jsx";
import { EXPERIENCE } from "../content/data.js";

/** Where Joshua has worked and studied. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-h">
      <h2 id="experience-h">Experience</h2>
      <Rows items={EXPERIENCE} />
    </section>
  );
}
