import { SOCIALS } from "../content/data.js";

/** Ways to reach Joshua, each with a hover preview. */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h">
      <h2 id="contact-h">Contact</h2>
      <p>Feel free to message me on LinkedIn or send an email!</p>
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
            data-icon={s.icon}
            data-cap={s.cap}
          >
            {s.label}
          </a>
        ))}
      </p>
    </section>
  );
}
