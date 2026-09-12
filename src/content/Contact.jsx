import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReveal } from "../hooks/useReveal.js";
import { LINKS } from "./data.js";

export default function Contact() {
  const ref = useRef(null);
  const buttonRef = useRef(null);
  useReveal(ref);

  useGSAP(
    () => {
      const button = buttonRef.current;
      const move = (event) => {
        const rect = button.getBoundingClientRect();
        gsap.to(button, {
          x: (event.clientX - rect.left - rect.width / 2) * 0.3,
          y: (event.clientY - rect.top - rect.height / 2) * 0.4,
          duration: 0.4,
          ease: "power2.out",
        });
      };
      const leave = () => gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
      button.addEventListener("mousemove", move);
      button.addEventListener("mouseleave", leave);
      return () => {
        button.removeEventListener("mousemove", move);
        button.removeEventListener("mouseleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="section__inner">
        <p className="eyebrow" data-reveal>
          Contact
        </p>
        <h2 className="display" data-reveal>
          Let's build something that <em>runs</em>.
        </h2>
        <div data-reveal>
          <a className="magnetic" href={LINKS.email} ref={buttonRef}>
            Say hello →
          </a>
        </div>
        <div className="contact__links" data-reveal>
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={LINKS.email}>Email</a>
        </div>
      </div>
    </section>
  );
}
