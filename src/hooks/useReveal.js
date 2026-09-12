import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const REVEAL_FROM = { opacity: 0, y: 60, filter: "blur(10px)" };
const REVEAL_TO = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  duration: 1.1,
  ease: "power3.out",
};

/**
 * Blur + slide reveal for every `[data-reveal]` inside `ref`, triggered on
 * scroll. Pass `immediate` to play on mount instead (hero).
 */
export function useReveal(ref, { immediate = false, stagger = 0.13, delay = 0 } = {}) {
  useGSAP(
    () => {
      const targets = ref.current.querySelectorAll("[data-reveal]");
      if (!targets.length) return;
      gsap.fromTo(targets, REVEAL_FROM, {
        ...REVEAL_TO,
        stagger,
        delay,
        scrollTrigger: immediate
          ? undefined
          : { trigger: ref.current, start: "top 78%", once: true },
      });
    },
    { scope: ref },
  );
}
