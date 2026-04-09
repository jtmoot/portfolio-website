import { useState, useEffect } from "react";

export default function EntranceReveal({ onComplete }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setAnimating(true);
    });
  }, []);

  function handleTransitionEnd(e) {
    if (e.propertyName === "transform") {
      onComplete();
    }
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      pointerEvents: "none",
    }}>
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "#0a0a0a",
          transition: "transform 0.6s ease-in-out",
          transform: animating ? "translateX(-100%)" : "translateX(0)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: "#0a0a0a",
          transition: "transform 0.6s ease-in-out",
          transform: animating ? "translateX(100%)" : "translateX(0)",
        }}
      />
    </div>
  );
}
