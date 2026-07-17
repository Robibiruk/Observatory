# Public assets to add before going live

This folder is served at the site root. The app references these paths — drop
real files in and they'll appear automatically (each has a graceful fallback if
missing, so the build won't break without them).

## Required for SEO (index.html references them)
- `favicon.ico`  — site icon (copy from your old PW2/favicon.ico)
- `og-image.png`  — 1200x630 social-share preview image

## Project imagery (src/data/projects.ts → image field)
Drop screenshots here with these exact names (or update projects.ts):
- `projects/nira.webp`
- `projects/eventhub.webp`
- `projects/medreminder.webp`

If a file is missing, the card simply hides the broken image — no crash.

## Optional
- `profile.webp` — your portrait for the About section. If absent, a branded
  monogram (your initials) is shown instead.
- `cv.pdf` — enables the "Download CV" affordance (not currently wired to a
  button; referenced by site.ts cvUrl for future use).
