import { SCENES } from "../lib/scene.js";

export default function SceneToggle({ scene, onChange }) {
  return (
    <div className="scene-toggle" role="group" aria-label="Scene">
      {SCENES.map((name) => (
        <button
          key={name}
          type="button"
          className={name === scene ? "is-on" : ""}
          onClick={() => onChange(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
