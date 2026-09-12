import { useRef } from "react";
import { useReveal } from "../hooks/useReveal.js";

export default function Hero() {
  const ref = useRef(null);
  useReveal(ref, { immediate: true, delay: 0.35 });

  return (
    <section className="section hero" id="top" ref={ref}>
      <div className="section__inner">
        <p className="eyebrow" data-reveal>
          Joshua Moorehead — ML infrastructure
        </p>
        <h1 className="display" data-reveal>
          Building the glue between <em>models</em> and the hardware they run on.
        </h1>
        <div className="hero__row">
          <p className="lede" data-reveal>
            MS ECE at Carnegie Mellon, AI/ML Systems. Experiment tracking, data lakes,
            agent orchestration — and a growing obsession with serving and distributed
            training.
          </p>
          <p className="hero__scroll" data-reveal>
            Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}
