// Builds every station drawing to src/creative/stations/art/<id>.svg plus meta.json.
// Run: node tools/stations/build.mjs [id ...]
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../src/creative/stations/art");
const IDS = ["desk", "library", "plants", "kitchen", "gym", "chess", "reading", "reading-front", "corkboard", "anatomy", "walls", "figure", "bookcase"];

mkdirSync(OUT, { recursive: true });
const metaPath = join(OUT, "meta.json");
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : IDS;

for (const id of wanted) {
  const file = join(HERE, `${id}.mjs`);
  if (!existsSync(file)) continue;
  const mod = await import(`${file}?t=${Date.now()}`);
  const { svg, meta: m, parts = {} } = mod.default.render();
  writeFileSync(join(OUT, `${id}.svg`), svg);
  // A station drawn in parts gets one file per part too (<id>-<part>.svg), in the same box.
  for (const [name, part] of Object.entries(parts)) writeFileSync(join(OUT, `${id}-${name}.svg`), part);
  meta[id] = m;
  const paths = (svg.match(/<path/g) || []).length;
  const partNote = m.parts ? `, parts: ${m.parts.join(", ")}` : "";
  process.stdout.write(`${id}: ${m.width}x${m.height}, ${paths} paths, ${(svg.length / 1024).toFixed(0)} KB${partNote}\n`);
}
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
