import { useEffect, useState } from "react";
import CanvasLayer from "./canvas/CanvasLayer.jsx";
import Nav from "./content/Nav.jsx";
import Hero from "./content/Hero.jsx";
import About from "./content/About.jsx";
import Projects from "./content/Projects.jsx";
import Timeline from "./content/Timeline.jsx";
import Contact from "./content/Contact.jsx";
import SceneToggle from "./content/SceneToggle.jsx";
import { useBeats } from "./content/useBeats.js";
import { startSmoothScroll } from "./lib/smoothScroll.js";
import { hasWebGL, readSceneParam, writeSceneParam } from "./lib/scene.js";
import { scroll } from "./lib/scroll.js";

export default function App() {
  const [scene, setScene] = useState(readSceneParam);
  const [webgl] = useState(hasWebGL);

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    const onMove = (event) => {
      scroll.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      scroll.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useBeats();

  const changeScene = (name) => {
    writeSceneParam(name);
    setScene(name);
  };

  return (
    <>
      {webgl ? <CanvasLayer scene={scene} /> : <div className="no-webgl" aria-hidden />}
      <div className="grain" aria-hidden />
      <Nav />
      <main className="content">
        <Hero />
        <About />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      {webgl && <SceneToggle scene={scene} onChange={changeScene} />}
    </>
  );
}
