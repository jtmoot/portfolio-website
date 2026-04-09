import useScrollReveal from "../hooks/useScrollReveal.jsx";

const OFFSETS = {
  left: "translateX(-30px)",
  right: "translateX(30px)",
  bottom: "translateY(30px)",
};

export default function ScrollReveal({ children, direction = "bottom", delay = 0, className = "" }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : OFFSETS[direction],
        transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
