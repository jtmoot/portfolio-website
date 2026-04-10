## Contract 22: Visitor Globe Frontend (3D)

**Goal:** A slowly rotating 3D globe with glowing visitor dots, replacing the flat map concept.

**Prerequisite:** Contract 16 complete (R3F already installed), Contract 21 complete (Worker deployed).

**Acceptance Criteria:**

- [ ] `src/components/VisitorGlobe.jsx`:
  - Lazy-loaded with `React.lazy()` + `<Suspense>`
  - Fallback: total visitor count text only
  - 3D globe using React Three Fiber:
    - Sphere geometry with a earth-like wireframe or dot-pattern texture
    - Auto-rotates slowly on Y axis (`useFrame` with delta rotation)
    - Can be grabbed and spun (OrbitControls, rotation only, no zoom/pan)
  - Visitor dots:
    - Fetch from Worker `GET /api/visits/countries`
    - Convert country codes to lat/lng coordinates (static lookup table for ~30 major countries)
    - Place small glowing spheres on the globe surface at those coordinates
    - Glow: slightly emissive material with a point light
  - On mount: fire `POST /api/visit` to log this visitor (fire-and-forget)
- [ ] Grid placement: span 6, last row
- [ ] Section label: "Visitors" with count: "47 visitors from 12 countries"
- [ ] Performance: low-poly sphere (`args={[1, 32, 32]}`), limited point lights
- [ ] `useDetectGPU` — show text-only fallback on low-end devices
- [ ] Works in dark mode
- [ ] `@media (prefers-reduced-motion: reduce)` — globe visible but doesn't rotate

**What NOT to do:**

- Don't use a mapping library
- Don't add every country — 30 major ones is enough
- Don't show per-country counts — just highlight presence
- Don't use a high-res earth texture — keep it abstract/wireframe

**Verify:** Globe renders and slowly rotates. If Worker has data, dots appear on countries. Drag to spin — works. Dark mode — colors adapt. Low-end device — text fallback. Network tab — POST fires once.
