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

## Admin panel (Neon + Netlify Functions)

The site has a password-protected editor at `/admin` — click the `©` in the
footer to reach it. It lets you add / replace / delete / reorder content for the
four sections: Projects Observatory, Missions, Gallery, and Technology
Constellation. Content is stored in **Neon Postgres** and served through
**Netlify Functions**; the site falls back to the bundled `src/data/*` when the
API is unreachable, so it still works as a plain static build.

### One-time setup

1. Create a free [Neon](https://neon.tech) project and copy the **pooled**
   connection string → `DATABASE_URL`.
2. Pick your admin password and generate its hash plus a JWT secret:

   ```bash
   node scripts/hash-password.mjs "your-secret-password"
   ```

3. Set three environment variables — in `.env` for local dev **and** in the
   Netlify UI (Site settings → Environment variables) for production:
   `DATABASE_URL`, `ADMIN_SECRET`, `ADMIN_PASSWORD_HASH`.
   `ADMIN_PASSWORD_HASH` is printed base64-encoded (a `$`-free form). Use that
   value as-is: raw `$2b$12$...` hashes also work, but some env-var editors
   mangle values at `$` and silently break login.
   The schema tables are created automatically on first function call — no
   manual migration.
4. Run locally with `npx netlify-cli dev` (the Vite dev server proxies
   `/.netlify/functions/*` to Netlify's local functions server on :8888).

### First login

Log in at `/admin`, then click **Import site content** to copy the current
bundled projects / missions / tech into the database. From then on the site
renders from the DB; every edit publishes instantly.

### Security notes

- The admin password is stored only as a bcrypt hash; sessions are short-lived
  JWTs signed with `ADMIN_SECRET`. Nothing secret is shipped to the client.
- Login is rate-limited per IP. Images uploaded via the editor are compressed
  client-side and stored as data URIs in the DB.

## Notes

- Secrets are never committed (`.env`, `.env.*` are git-ignored).
- The "Hallmark" audit artifacts (`.hallmark`, `skills/hallmark`) and IDE folders
  (`.idea`) are git-ignored.
