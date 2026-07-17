# Design System — The Observatory

> Locked design system for this project (Hallmark `design.md`).
> Source of truth for genre, tokens, typography, spacing, motion, CTA voice.
> Future Hallmark runs on this repo defer to this file; diversification is
> *inverted* — pages share this system, they don't rotate away from it.

## Genre
**atmospheric** (dark-AI-tool school: dark mode, deep space, glow, calm motion)
— detected from brief signals: AI/LLM tooling, dark mode, generative themes.

## Macrostructure
Single-page scroll experience, bespoke (not a catalog macro). Section order is the
durable rhythm — do not rearrange without explicit confirmation:
Hero Observatory → About Island → Projects Observatory (bento) → Time Machine →
Technology Constellation → Museum → Contact / Mission Control.

## Theme
Custom-tuned to the Observatory brand (cool indigo/violet on near-black).
Three diversification axes (for reference, not rotation):
- Paper band: **dark** (L ≈ 4%)
- Display style: **grotesk-sans** (Space Grotesk, roman — never italic)
- Accent hue: **cool** (indigo #6C7CFF → violet #8D5BFF, cyan highlight #AEEBFF)

## Tokens

### Color
```
--color-background: #050816   /* page base */
--color-surface:     rgba(255,255,255,0.05)  /* glass surfaces */
--color-primary:     #6C7CFF   /* indigo */
--color-accent:      #8D5BFF   /* violet */
--color-highlight:   #AEEBFF   /* cyan */
--color-text:        #F7F8FC
--color-muted:       #A5AEC0
```
Note: in Tailwind config these live as `background / surface / primary / accent /
highlight / text / muted`. Reference by token name only — never inline raw hex in
component CSS (the only raw hex allowed is inside the WebGL starfield, which is
outside CSS by nature).

### Typography
```
--font-display: "Space Grotesk", system-ui, sans-serif   /* hero + headings, roman */
--font-body:    "Inter", system-ui, sans-serif           /* body */
--font-mono:    "JetBrains Mono", ui-monospace, monospace /* stats / eyebrows / numbers */
```
Loaded via Google Fonts (see index.html). Display + body + mono = 2+1 discipline.

### Shadow / glow
```
--shadow-glow:       0 0 40px rgba(109,124,255,0.25)
--shadow-glow-accent:0 0 50px rgba(141,91,255,0.30)
```

### Spacing
Tailwind default 4pt scale (shadowed via `section-pad` utility: `px-5 sm:px-8
lg:px-16 py-24 sm:py-32`). Keep section vertical rhythm consistent.

## Motion
- Library: Framer Motion (components) + GSAP (hero entrance, horizontal timeline) + Lenis (smooth scroll).
- Continuous background drift + starfield: **disabled under `prefers-reduced-motion`** (hard requirement).
- Magnetic buttons: desktop only, auto-disabled on touch / reduced motion.
- Easing: calm, no bounce/overshoot. Reduced-motion collapses to ≤150ms opacity crossfade.
- Rule: animate `transform`/`opacity` only.

## Components / voice
- Nav: floating glass pill (N5-class), scroll-spy active state, mobile sheet. Brand wordmark returns to top.
- Cards: gentle float/hover lift, glass frame, hover reveals links.
- CTA voice: "Transmit Signal" / "Transmit a signal" (space/comms metaphor). Keep this voice; don't switch to generic "Get Started".
- Status badges: Live / In progress / Prototype (color-coded dots).

## Anti-slop commitments (locked)
- No re-drawn fake chrome (browser bars, phone frames, code windows).
- No invented metrics, user counts, or testimonials.
- No italic display headers (emphasis via weight/color/underline only).
- All interactive elements: full keyboard + `:focus-visible` ring ≥3:1.
- `overflow-x: clip` (never `hidden`).

## Exports
See `skills/hallmark/references/export-formats.md` for canonical mappings.
Project uses Tailwind v3 + CSS custom properties (tokens already in
`tailwind.config.js` and `src/index.css` `:root`).
