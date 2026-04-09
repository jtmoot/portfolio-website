import { useState, useEffect, useRef, useCallback } from "react";

const LINES = [
  { type: "text", content: "> initializing joshua.env..." },
  { type: "progress", content: "> loading neural_networks    ", label: "neural_networks" },
  { type: "progress", content: "> loading agent_swarm        ", label: "agent_swarm" },
  { type: "progress", content: "> loading signal_processing  ", label: "signal_processing" },
  { type: "text", content: "> establishing connections... done." },
  { type: "text", content: "> portfolio.render()" },
];

const CHAR_DELAY = 40;
const BAR_WIDTH = 16;
const PAUSE_AFTER = 500;

export default function BootSequence({ onComplete }) {
  const [displayLines, setDisplayLines] = useState([]);
  const [currentChar, setCurrentChar] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const completedRef = useRef(false);
  const animFrameRef = useRef(null);

  const skip = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (animFrameRef.current) clearTimeout(animFrameRef.current);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((v) => !v);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let barProgress = 0;
    let phase = "typing";

    function getFullText(line) {
      if (line.type === "text") return line.content;
      return line.content + "[" + "#".repeat(BAR_WIDTH) + "] 100%";
    }

    function tick() {
      if (completedRef.current) return;

      const line = LINES[lineIdx];
      if (!line) {
        animFrameRef.current = setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, PAUSE_AFTER);
        return;
      }

      if (line.type === "text") {
        if (charIdx <= line.content.length) {
          setCurrentChar(line.content.slice(0, charIdx));
          charIdx++;
          animFrameRef.current = setTimeout(tick, CHAR_DELAY);
        } else {
          setDisplayLines((prev) => [...prev, line.content]);
          setCurrentChar("");
          lineIdx++;
          charIdx = 0;
          animFrameRef.current = setTimeout(tick, 100);
        }
      } else if (line.type === "progress") {
        if (phase === "typing") {
          if (charIdx <= line.content.length) {
            setCurrentChar(line.content.slice(0, charIdx));
            charIdx++;
            animFrameRef.current = setTimeout(tick, CHAR_DELAY);
          } else {
            phase = "bar";
            barProgress = 0;
            animFrameRef.current = setTimeout(tick, 30);
          }
        } else if (phase === "bar") {
          if (barProgress <= BAR_WIDTH) {
            const filled = "#".repeat(barProgress);
            const empty = " ".repeat(BAR_WIDTH - barProgress);
            const pct = Math.round((barProgress / BAR_WIDTH) * 100);
            setCurrentChar(line.content + "[" + filled + empty + "] " + pct + "%");
            barProgress++;
            animFrameRef.current = setTimeout(tick, 40);
          } else {
            const fullLine = getFullText(line);
            setDisplayLines((prev) => [...prev, fullLine]);
            setCurrentChar("");
            lineIdx++;
            charIdx = 0;
            phase = "typing";
            animFrameRef.current = setTimeout(tick, 100);
          }
        }
      }
    }

    animFrameRef.current = setTimeout(tick, 300);

    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [onComplete]);

  return (
    <div
      onClick={skip}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: 14,
          lineHeight: 1.8,
          color: "#4ade80",
          maxWidth: 600,
          padding: 24,
          whiteSpace: "pre",
        }}
      >
        {displayLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {currentChar && (
          <div>
            {currentChar}
            <span style={{ opacity: showCursor ? 1 : 0 }}>_</span>
          </div>
        )}
        {!currentChar && displayLines.length < LINES.length && (
          <div>
            <span style={{ opacity: showCursor ? 1 : 0 }}>_</span>
          </div>
        )}
      </div>
    </div>
  );
}
