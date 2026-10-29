import { useState } from "react";
import { STATIONS } from "./stations/index.js";
import "../styles/iso.css";

/** Dev page (?dev=stations): every station at 600 px and 160 px on pad paper, for screenshots. */
export default function StationHarness() {
  const [night, setNight] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const zoom = params.get("zoom");
  if (zoom) {
    const s = STATIONS.find((x) => x.id === zoom);
    const width = Number(params.get("w") || 2400);
    return (
      <div className="harness" style={{ width: width + 48 }}>
        <div style={{ width }}>{s ? <s.Component /> : null}</div>
        <style>{`.harness{padding:24px;background:#f4f3ee}.station-art svg{display:block;width:100%;height:auto}`}</style>
      </div>
    );
  }
  return (
    <div className="harness" data-night={night || undefined}>
      <button type="button" onClick={() => {
        const next = !night;
        setNight(next);
        document.documentElement.dataset.theme = next ? "night" : "day";
      }}>
        {night ? "day" : "night"}
      </button>
      {STATIONS.map((s) => (
        <section key={s.id} className="harness-row" data-id={s.id}>
          <div style={{ width: 600 }}><s.Component /></div>
          <div style={{ width: 160 }}><s.Component /></div>
          <p className="harness-label">{s.label}</p>
        </section>
      ))}
      <style>{`
        .harness{min-height:100vh;padding:24px;background:#f4f3ee radial-gradient(#c9c7bd .6px, transparent .7px) 0 0/16px 16px;font:13px ui-monospace,monospace;color:#2a2a28}
        .harness[data-night]{background:#17181a radial-gradient(#2c2d31 .6px, transparent .7px) 0 0/16px 16px;color:#d9d7cf}
        .harness-row{display:flex;align-items:flex-end;gap:32px;margin:24px 0 48px}
        .harness button{font:inherit;background:none;border:1px solid currentColor;color:inherit;padding:4px 10px;cursor:pointer}
        .station-art svg{display:block;width:100%;height:auto;overflow:visible}
      `}</style>
    </div>
  );
}
