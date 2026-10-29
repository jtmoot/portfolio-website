# Drawing skill choice (Task 2)

- Chosen: `wheresryan22/anatomy`. Its kit draws solid parts with four-tone shading, lathe-turned round parts and tube routes, which is what the spec's quality bar (the Raptor test stand) needs; the desk and gym were built with it and read at a glance.
- Not used: the Kris Chase gist (`iso-skill-gist.md`) is a hairline-outline style, the same look as the take-13 drawings Joshua called "not great"; `MrBongoC/ai-iso-skill` would not install (`npx skills add` reports its SKILL.md has no valid name and description).
- Pipeline: `tools/stations/<id>.mjs` (kit in `tools/iso-kit/`, MIT) → `npm run stations` → `src/creative/stations/art/<id>.svg` + `meta.json`.
