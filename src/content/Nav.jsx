import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { scrollTo } from "../lib/smoothScroll.js";

const ITEMS = [
  ["About", "#about"],
  ["Work", "#projects"],
  ["Timeline", "#timeline"],
  ["Contact", "#contact"],
];

export default function Nav() {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(ref.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 });
    },
    { scope: ref },
  );

  const go = (event, target) => {
    event.preventDefault();
    scrollTo(target);
  };

  return (
    <nav className="nav" ref={ref}>
      <a className="nav__brand" href="#top" onClick={(e) => go(e, 0)}>
        JM
      </a>
      <ul className="nav__links">
        {ITEMS.map(([label, href]) => (
          <li key={href}>
            <a className="nav-link" href={href} onClick={(e) => go(e, href)}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
