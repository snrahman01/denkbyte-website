# DenkByte — Company Website

A static company website built for the **Planspiel Web Engineering** course at
TU Chemnitz (WS 2026/27). DenkByte is a fictional company created for academic purposes.

> **Disclaimer:** This website does not belong to a real company. It is a Planspiel
> Web Engineering project at the University of Technology Chemnitz.

## Tech

- Plain **HTML + CSS + JavaScript** (no framework, no build step)
- Animations: **GSAP 3** + **ScrollTrigger** and **Lenis** smooth scroll, vendored in `vendor/`
  (5-second intro preloader plays once per session; skipped with reduced motion)
- Content loaded from static JSON in `data/`
- Contact form via **Netlify Forms**
- Hosted free on **Netlify**

## Project structure

```
denkbyte-website/
├── index.html          # the page (at repo root)
├── styles.css          # theme + layout (CSS variables for easy theming)
├── script.js           # loads data, renders team/services, nav, modals
├── logo.png           # brand logo (navbar, footer, intro)
├── favicon.png        # bulb icon cropped from logo.png
├── avatars.js         # inline-SVG cartoon avatars, one config per member
├── vendor/             # gsap.min.js, ScrollTrigger.min.js, lenis.min.js
├── data/
│   ├── config.json     # company name, colors, contact, legal text
│   ├── team.json       # team members ("avatar" key → drawing in avatars.js)
│   └── services.json   # services offered
├── netlify.toml        # Netlify publish config (publishes repo root)
├── NETLIFY_DEPLOY.md   # deployment steps
├── THEME_EXAMPLES.md   # alternative color palettes
└── DENKBYTE_PROFILE.md # company/team profile reference
```

## Run locally

The page fetches JSON, so open it through a local web server (not `file://`):

```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

## Edit content

All content is in `data/`:

- **Company name, tagline, colors, contact, legal** → `config.json`
  (colors apply automatically via CSS variables — see `THEME_EXAMPLES.md`)
- **Team members** → `team.json`
- **Services** → `services.json`
- **Replay the intro** → it plays once per browser tab; open a new tab or run `sessionStorage.clear()`

No rebuild needed — edit the JSON and refresh.

## Deploy

See **[NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)** — connect the GitHub repo for auto-deploys,
or drag-and-drop the whole project folder to Netlify.

## Course compliance

- ✅ Impressum (footer → Impressum)
- ✅ GDPR / Privacy Policy (footer → Privacy Policy)
- ✅ Fictional-company disclaimer (footer)
- ✅ Responsive + accessible (mobile nav, form labels, reduced-motion support)
