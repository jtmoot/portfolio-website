import { SOCIALS } from "../content/data.js";

/** Ways to reach Joshua, each with a hover preview. */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h">
      <h2 id="contact-h">say hello</h2>
      <p>the fastest way is email. i read everything.</p>
      <p className="contact-links">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            className="pill"
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noreferrer" : undefined}
            data-c="ring"
            data-prev={s.prev}
            data-ph={s.ph}
            data-cap={s.cap}
          >
            {s.label}
          </a>
        ))}
      </p>
    </section>
  );
}
