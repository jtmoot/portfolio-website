// Synthesizes the two UI sounds as small mono WAV files (no third-party audio, no licence).
// pencil.wav: five short scribble strokes of band-limited noise. tick.wav: a 40 ms soft click.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../../public/audio");
const RATE = 22050;

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, i * 2));
  const head = Buffer.alloc(44);
  head.write("RIFF", 0); head.writeUInt32LE(36 + data.length, 4); head.write("WAVE", 8);
  head.write("fmt ", 12); head.writeUInt32LE(16, 16); head.writeUInt16LE(1, 20); head.writeUInt16LE(1, 22);
  head.writeUInt32LE(RATE, 24); head.writeUInt32LE(RATE * 2, 28); head.writeUInt16LE(2, 32); head.writeUInt16LE(16, 34);
  head.write("data", 36); head.writeUInt32LE(data.length, 40);
  return Buffer.concat([head, data]);
}

let seed = 42;
const noise = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

// Pencil: strokes of high-passed noise with a grainy amplitude flutter.
const pencil = new Float32Array(Math.round(RATE * 1.7));
const strokes = [[0.02, 0.26], [0.33, 0.22], [0.6, 0.3], [0.98, 0.2], [1.25, 0.34]];
let prev = 0, lp = 0;
for (let i = 0; i < pencil.length; i++) {
  const t = i / RATE;
  const n = noise();
  const hp = n - prev; prev = n; // first difference: tilts the noise toward the highs
  lp += (hp - lp) * 0.55; // and soften the very top
  let env = 0;
  for (const [s, d] of strokes) {
    if (t >= s && t <= s + d) {
      const u = (t - s) / d;
      env = Math.max(env, Math.sin(Math.PI * u) ** 0.6 * (0.75 + 0.25 * Math.sin(t * 2 * Math.PI * 23)));
    }
  }
  pencil[i] = lp * env * 0.32;
}

// Tick: a decaying 1.8 kHz blip with a touch of noise.
const tick = new Float32Array(Math.round(RATE * 0.04));
for (let i = 0; i < tick.length; i++) {
  const t = i / RATE;
  tick[i] = (Math.sin(2 * Math.PI * 1800 * t) * 0.5 + noise() * 0.15) * Math.exp(-t * 140) * 0.5;
}

writeFileSync(join(OUT, "pencil.wav"), wav(pencil));
writeFileSync(join(OUT, "tick.wav"), wav(tick));
console.log("wrote pencil.wav and tick.wav");
