import { useEffect } from "react";
import gsap from "gsap";
import { scroll } from "../lib/scroll.js";
import { isDesktop } from "../lib/scene.js";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * Computes `scroll.beat` and `scroll.dim` every tick from section positions.
 *
 * A section's beat runs from its top reaching `startAt` (a viewport fraction)
 * to its bottom reaching `endAt`. Evaluating geometry directly — instead of
 * relying on ScrollTrigger callbacks — means a scroll jump can never leave the
 * timeline stale.
 */
export function useBeats() {
  useEffect(() => {
    const pinned = isDesktop();
    const sections = [
      { el: document.querySelector("#top"), startAt: 0, endAt: 0.5 },
      { el: document.querySelector("#about"), startAt: 0.5, endAt: 0.5 },
      { el: document.querySelector("#projects"), startAt: pinned ? 0 : 0.5, endAt: pinned ? 1 : 0.5 },
      { el: document.querySelector("#timeline"), startAt: 0.5, endAt: 0.5 },
      { el: document.querySelector("#contact"), startAt: 0.5, endAt: 1 },
    ];
    const timeline = sections[3].el;
    const contact = sections[4].el;

    const update = () => {
      const H = window.innerHeight;
      let beat = 0;
      sections.forEach((section, i) => {
        const rect = section.el.getBoundingClientRect();
        const start = section.startAt * H;
        const end = section.endAt * H;
        const travelled = start - rect.top;
        const total = rect.height - (end - start);
        if (travelled >= 0) beat = i + clamp01(total > 0 ? travelled / total : 1);
      });
      scroll.beat = beat;

      const fadeIn = clamp01((H * 0.8 - timeline.getBoundingClientRect().top) / (H * 0.6));
      const fadeOut = clamp01((H * 0.8 - contact.getBoundingClientRect().top) / (H * 0.6));
      scroll.dim = fadeIn * (1 - fadeOut);
    };

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);
}
