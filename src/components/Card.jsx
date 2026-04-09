import { useState, useRef, useEffect, useCallback } from "react";

export default function Card({ children, style = {}, className = "", hover = true }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef(null);
  const tiltEnabled = useRef(true);

  useEffect(() => {
    const noHover = window.matchMedia("(hover: none)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tiltEnabled.current = !noHover && !reducedMotion;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!tiltEnabled.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({
      rotateX: -offsetY * 5,
      rotateY: offsetX * 5,
      glareX,
      glareY,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (hover) setHovered(true);
  }, [hover]);

  const handleMouseLeave = useCallback(() => {
    if (hover) setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  }, [hover]);

  const tiltActive = hovered && tiltEnabled.current;

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        background: "var(--bg-card)",
        borderRadius: 20,
        padding: 28,
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
        transition: hovered
          ? "box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          : "transform 0.4s ease-out, box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: tiltActive
          ? `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-3px)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)",
        boxShadow: hovered
          ? "var(--shadow-card-hover)"
          : "var(--shadow-card)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 20,
          pointerEvents: "none",
          background: tiltActive
            ? `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.07) 0%, transparent 60%)`
            : "transparent",
          opacity: tiltActive ? 1 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      />
      {children}
    </div>
  );
}
