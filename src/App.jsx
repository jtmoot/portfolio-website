import StationHarness from "./creative/StationHarness.jsx";

export default function App() {
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("dev") === "stations") {
    return <StationHarness />;
  }
  return (
    <div className="stage" data-mode="pad">
      <main className="sheet" />
    </div>
  );
}
