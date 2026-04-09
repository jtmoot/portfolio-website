export default function StatusBadge({ status }) {
  const config = {
    live: { label: "Live", bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    active: { label: "Active", bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    building: { label: "Building", bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  };
  const c = config[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot,
        boxShadow: status === "live" ? `0 0 6px ${c.dot}` : "none",
        animation: status === "live" ? "pulse 2s infinite" : "none",
      }} />
      {c.label}
    </span>
  );
}
