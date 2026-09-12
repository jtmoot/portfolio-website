import { useRef } from "react";
import { useReveal } from "../hooks/useReveal.js";

const FACTS = [
  ["Now", "MS ECE, Carnegie Mellon — AI/ML Systems"],
  ["Focus", "Serving, distributed training, data infrastructure"],
  ["Stack", "Python · PyTorch · CUDA · Docker · AWS · Terraform"],
  ["Before", "Data engineering at Baron Filtration; autoencoder research at USC"],
  ["Off-hours", "Chess, strength training, cooking"],
];

export default function About() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="section__inner">
        <p className="eyebrow" data-reveal>
          About
        </p>
        <div className="about__grid">
          <h2 className="display" data-reveal>
            I care about the unglamorous layer — the part that decides whether a model
            ever <em>ships</em>.
          </h2>
          <dl className="about__facts" data-reveal>
            {FACTS.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
