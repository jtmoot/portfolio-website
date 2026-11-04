import { memo, useEffect, useRef, useState } from "react";
import svg from "../creative/stations/art/bookcase.svg?raw";
import meta from "../creative/stations/art/meta.json";
import Cover from "./Cover.jsx";
import { PLACED, bookPose, projector } from "../lib/bookcase.js";
import { SHELF, goodreads } from "../content/shelf.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const HOVERED = 0.42;
const FOLLOW = 11; // per second
const FACES = ["top", "side", "spine"];

const stillPreferred = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const project = projector(meta.bookcase.anchor);
const placedById = new Map(PLACED.map((p) => [p.book.id, p]));
const statusOf = new Map(SHELF.flatMap((s) => s.books.map((b) => [b.id, s.title])));

const Drawing = memo(function Drawing() {
  return <div className="iso bookcase-art" dangerouslySetInnerHTML={{ __html: svg }} />;
});

const idOf = (target) => {
  const el = target.closest?.("[data-book], [data-hit], [data-front]");
  return el && (el.dataset.book || el.dataset.hit || el.dataset.front);
};

/** A tipped book's copy in the top layer, clipped to the part clear of the row. */
function makeFront(svgEl, id) {
  const clip = document.createElementNS(SVG_NS, "clipPath");
  clip.id = `bk-clip-${id}`;
  clip.append(document.createElementNS(SVG_NS, "path"));
  const group = document.createElementNS(SVG_NS, "g");
  group.dataset.front = id;
  group.setAttribute("clip-path", `url(#${clip.id})`);
  group.style.setProperty("--b", svgEl.querySelector(`[data-book="${id}"]`).style.getPropertyValue("--b"));
  group.append(clip);
  for (const face of FACES) {
    const wrap = document.createElementNS(SVG_NS, "g");
    wrap.dataset.frontFace = face;
    const use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", `#bk-${face}-${id}`);
    wrap.append(use);
    group.append(wrap);
  }
  return group;
}

/**
 * An isometric bookcase holding every book on the list. Hovering a spine eases the book partway
 * out; picking one tips it fully and shows its details alongside.
 */
export default function Bookcase() {
  const [picked, setPicked] = useState(PLACED.find((p) => p.book.id === SHELF[0].books[0].id).book.id);
  const [hovered, setHovered] = useState(null);
  const host = useRef(null);
  const motion = useRef({ t: new Map(), raf: 0, last: 0, svg: null, fronts: new Map() });

  // Draw one book at its current pose.
  const draw = (id, t) => {
    const m = motion.current;
    const el = m.svg.querySelector(`[data-book="${id}"]`);
    if (!el) return;
    const pose = bookPose(placedById.get(id), t, project);
    for (const face of FACES) el.querySelector(`[data-face="${face}"]`).setAttribute("transform", pose[face]);
    let front = m.fronts.get(id);
    if (t < 0.003) {
      front?.remove();
      m.fronts.delete(id);
      return;
    }
    if (!front) {
      front = makeFront(m.svg, id);
      m.fronts.set(id, front);
      // Far books first, so two tipped books overlap the way they stand.
      const layer = m.svg.querySelector(".bk-fronts");
      const y = placedById.get(id).y0;
      const after = [...layer.children].find((g) => placedById.get(g.dataset.front).y0 > y);
      layer.insertBefore(front, after ?? null);
    }
    front.querySelector("clipPath path").setAttribute("d", pose.clip);
    for (const face of FACES) front.querySelector(`[data-front-face="${face}"]`).setAttribute("transform", pose[face]);
  };

  useEffect(() => {
    motion.current.svg = host.current.querySelector("svg");
  }, []);

  useEffect(() => {
    const m = motion.current;
    const targetOf = (id) => (id === picked ? 1 : id === hovered ? HOVERED : 0);
    const still = stillPreferred();
    m.svg.querySelectorAll("[data-picked]").forEach((el) => el.removeAttribute("data-picked"));
    m.svg.querySelector(`[data-book="${picked}"]`).setAttribute("data-picked", "");
    for (const id of [picked, hovered]) if (id && !m.t.has(id)) m.t.set(id, 0);
    cancelAnimationFrame(m.raf);
    m.last = 0;
    const step = (now) => {
      const dt = m.last ? Math.min(0.05, (now - m.last) / 1000) : 1 / 60;
      m.last = now;
      let moving = false;
      for (const [id, t] of m.t) {
        const target = targetOf(id);
        const next = still ? target : Math.abs(target - t) < 0.002 ? target : t + (target - t) * (1 - Math.exp(-FOLLOW * dt));
        if (next !== target) moving = true;
        if (next !== t) draw(id, next);
        if (next === 0) m.t.delete(id);
        else m.t.set(id, next);
      }
      m.raf = moving ? requestAnimationFrame(step) : 0;
    };
    if (still) step(0);
    else m.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(m.raf);
    // draw only reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, hovered]);

  const pick = (e) => {
    const id = idOf(e.target);
    if (id) setPicked(id);
  };
  const onKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const id = idOf(e.target);
    if (!id) return;
    e.preventDefault();
    setPicked(id);
  };
  const onOver = (e) => setHovered(idOf(e.target));

  const book = placedById.get(picked).book;
  return (
    <section className="bookcase" aria-label="Bookcase">
      <div ref={host} onClick={pick} onKeyDown={onKeyDown} onPointerOver={onOver} onPointerLeave={() => setHovered(null)} onFocus={onOver} onBlur={() => setHovered(null)}>
        <Drawing />
      </div>
      <div className="book-panel" aria-live="polite">
        <Cover book={book} />
        <h2>{book.title}</h2>
        <p className="book-by">by {book.author}</p>
        <p className="book-status">
          {statusOf.get(book.id)}
          {book.note ? `, ${book.note.toLowerCase()}` : ""}
        </p>
        {book.topics.length > 0 && (
          <ul className="chips">
            {book.topics.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        )}
        <p className="book-links">
          <a href={goodreads(book)} target="_blank" rel="noreferrer" data-c="ring">
            Goodreads
          </a>
        </p>
      </div>
    </section>
  );
}
