# Gnaneswanth Bingi — Portfolio

## Overview
A personal portfolio site for Gnaneswanth Bingi, a Computer Science undergraduate
at Dayananda Sagar University interested in Software Engineering, Backend
Development, AI, and Distributed Systems.

The project is built on top of an open-source Astro portfolio template
(originally Antoine Wodniack's `public.wodniack.dev`), a heavily animated
single-page site using Astro, GSAP, and Lenis smooth-scroll. The template's
design, layout, and animations were preserved as-is; only content/branding was
customized.

## Tech stack
- Astro 5 (static site, component islands)
- GSAP + Lenis for scroll/animation
- SCSS (scoped per-component styles)
- Run with `npm run dev` (workflow: "Start application", port 5000)

## Structure
- `src/pages/index.astro` — page shell, meta tags, global intro animation
- `src/components/SiteHead.astro` — header/nav, social icons, availability blurb
- `src/components/SHero.astro` — hero: name, headline, resume button, socials
- `src/components/SAbout.astro` — About bio + Skills grid (repurposed from the
  original template's "Awards" grid to preserve its hand-tuned CSS layout)
- `src/components/SWork.astro` — Projects section (left as template placeholder
  content; user will add their own projects manually)
- `src/components/SCTA.astro` — full-screen "Let's Rock" contact CTA (email)
- `src/components/SiteFoot.astro` — footer: name, copyright, social links

## User preferences
- Do not change the overall design, layout, or animations of this template —
  only content/branding edits are wanted.
- The Projects ("Work") section must be left exactly as the template's
  placeholder content; the user will add their own projects manually.

## Known remaining item
- `public/images/qr-code.svg` still visually encodes the original template's
  QR code image (points to old contact info); regenerate it if a working
  QR code is wanted. All other contact links, resume, and copy are final.
