# Portfolio Website — CLAUDE.md

## First Things First (Read This After Every Compaction)
1. Re-read this file (CLAUDE.md)
2. Re-read the current TASK_CONTRACT.md (whichever contract number you're on)
3. Re-read any files you're about to modify before editing them
4. If you don't have a task plan yet, create one and show me before coding

## Project Overview
Personal portfolio website for Joshua Moorehead — ML Infrastructure & Agent Engineering.
Bento-grid layout with interactive features, scroll animations, and live data integrations.
Built with Vite + React. No Next.js. No CSS frameworks. Deployed on Vercel.

## Tech Stack
- Build: Vite 6.x
- UI: React 19.x
- Styling: CSS custom properties + inline styles (matching original component)
- Fonts: Google Fonts (DM Sans, Newsreader)
- Deployment: Vercel
- No Tailwind. No CSS-in-JS. No component libraries. No routing library.

## Task Flow (Follow This Every Time)
1. Read the current TASK_CONTRACT.md — understand what needs to be built
2. Create a step-by-step plan and show it to me — do NOT start coding until I approve
3. Implement in small increments, testing after each one
4. Run `npm run build` after each major step to verify no build errors
5. Run `npm run dev` and visually verify in the browser
6. Go through every acceptance criteria checkbox in the contract
7. Do NOT mark the task as complete until ALL checkboxes pass

## Architecture Rules
- All React components go in src/components/
- All custom hooks go in src/hooks/
- All utility functions go in src/utils/
- Global styles and CSS variables go in src/index.css
- Component-specific styles use inline styles (matching existing pattern) OR a co-located .css file
- No CSS modules. No styled-components. No Tailwind.

## Coding Rules
- Never implement stubs, placeholders, or TODO functions
- Always use functional components with hooks
- Use descriptive variable names
- Handle errors explicitly — fetch calls need try/catch with fallback UI
- Use semantic HTML where appropriate (section, nav, main, footer)
- All interactive elements need keyboard accessibility
- All images need alt text
- Respect prefers-reduced-motion for all animations

## Scaffolding Rules (CRITICAL)
- DO NOT use `npx create-next-app`, `npx create-react-app`, or any scaffolding CLI
- DO NOT use Next.js for anything
- If a directory already exists, DO NOT delete it and recreate — work with what's there
- If a command fails, STOP and report the error. Do NOT retry in /tmp or another directory
- If `npm create vite@latest` fails because directory exists, manually create package.json and vite.config.js

## CSS Variable Convention
All colors must use CSS custom properties defined in src/index.css.
Never hardcode colors like `#1a1a1a` in components — use `var(--text-primary)` etc.
The only exception is the Google Fonts `<style>` tag which stays as-is.

## What NOT To Do
- Don't install packages not listed in the current contract
- Don't add features not specified in the current contract
- Don't refactor working code unless the current contract asks for it
- Don't add TypeScript (plain JSX is fine)
- Don't add routing (single-page app)
- Don't add a backend or serverless functions (except where specified in Phase 5)
- Don't use emoji in code — use SVG icons
- Don't add console.log statements in production code

## File Naming Conventions
- Components: PascalCase.jsx (e.g., StatusBadge.jsx)
- Hooks: camelCase.js starting with "use" (e.g., useTheme.js)
- Utilities: camelCase.js (e.g., github.js)
- CSS files: camelCase.css matching component name

## When Confused
- Re-read the current TASK_CONTRACT.md
- Re-read this CLAUDE.md
- Ask me — don't guess or assume

## Browser Verification
After implementing visual changes, use Chrome to open http://localhost:5173 
and verify the result visually. Check both light and dark mode if applicable.
Check mobile viewport (375px width) for responsive layouts.