# Observatory — 2nd Redesigned Portfolio

A second, fully redesigned version of my personal portfolio site. The Observatory
reframes my work as a space mission: you scroll through an expedition of milestones,
open exhibit-style project cards, and explore a constellation of the technologies I
use. It is a single-page React app with a dark, glassy, motion-rich UI.

> This is the **2nd redesign** of the portfolio — rebuilt from the ground up with a
> new visual language (space / observatory theme), a different content structure
> (timeline expedition + project exhibits + tech constellation), and a cleaner
> component architecture.

## Tech stack

- **React 18 + TypeScript + Vite** — fast SPA build, strict type checking.
- **Tailwind CSS** — utility-first styling, custom space theme tokens.
- **Framer Motion** — entrance animations and the project detail modal.
- **GSAP** — scroll-driven timeline effects (scanner / HUD).
- **Canvas** — the custom electric-border effect around the timeline (no extra deps).
- **Netlify Forms** — contact form captured at the edge, no backend or env vars.

## Features

- **Mission Timeline (Expedition)** — a scroll-driven journey of milestones
  (Mission 001–006). Each milestone is a holographic "mission card" with a progress
  rail, a current-chapter planet, and a cursor-following scanner HUD. Wrapped in a
  self-contained electric border drawn on a `<canvas>` (respects
  `prefers-reduced-motion`).
- **Projects Observatory** — a bento grid of shipped and in-flight work. Featured
  projects get large tiles; clicking any exhibit opens an in-page detail panel
  (overview, architecture, features, lessons). Only real links are rendered — nothing
  is invented.
- **Technology Constellation** — a graph derived from the *same* project data, so it
  can never drift out of sync. Shows which techs power which projects.
- **Contact** — a Netlify Forms contact form (name, email, message) with no server or
  secrets required.
- **Museum marquee** — an animated strip of extra / in-development projects.
- **Accessibility & motion** — `prefers-reduced-motion` is a hard requirement: every
  animated component static-frames when reduced motion is requested.

## Contents

The site is data-driven. All copy lives in `src/data/`:

- `src/data/projects.ts` — single source of truth for projects (used by the bento grid
  and the constellation). Includes Nira AI, MedReminder, and EventHub, plus museum-only
  extras (menstrual/period tracker, Clean City, Data Analysis with Python).
- `src/data/timeline.ts` — the expedition milestones (001–006), including the PLP
  MERN certificate and MedReminder (built while enrolled in the PLP hackathon).
- `src/data/site.ts` — global site config (name, links, CV URL).

## Getting started

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
npm run build      # type-checked production build to dist/
npm run preview    # preview the production build
```

## Deploy

Configured for **Netlify**:

- `netlify.toml` sets the build command and publish directory.
- `public/_redirects` provides the SPA fallback (`/* /index.html 200`).
- The contact form posts to Netlify Forms — no environment variables needed.

## Notes

- Secrets are never committed (`.env`, `.env.*` are git-ignored).
- The "Hallmark" audit artifacts (`.hallmark`, `skills/hallmark`) and IDE folders
  (`.idea`) are git-ignored.
