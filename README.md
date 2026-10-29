# DenkByte — Company Website

A static company website built for the **Planspiel Web Engineering** course at
TU Chemnitz (WS 2026/27). DenkByte is a fictional company created for academic purposes.

> **Disclaimer:** This website does not belong to a real company. It is a Planspiel
> Web Engineering project at the University of Technology Chemnitz.

## Tech

- Plain **HTML + CSS + JavaScript** (no framework, no build step)
- Content loaded from static JSON in `frontend/data/`
- Contact form via **Netlify Forms**
- Hosted free on **Netlify**

## Project structure

```
denkbyte-website/
├── frontend/
│   ├── index.html          # the page
│   ├── styles.css          # theme + layout (CSS variables for easy theming)
│   ├── script.js           # loads data, renders team/services, nav, modals
│   ├── logo.png / logo.svg # brand logo
│   └── data/
│       ├── config.json     # company name, colors, contact, legal text
│       ├── team.json       # team members
│       └── services.json   # services offered
├── netlify.toml            # Netlify publish config (publishes frontend/)
├── NETLIFY_DEPLOY.md       # deployment steps
├── THEME_EXAMPLES.md       # alternative color palettes
└── DENKBYTE_PROFILE.md     # company/team profile reference
```

## Run locally

The page fetches JSON, so open it through a local web server (not `file://`):

```bash
cd frontend
python3 -m http.server 3000
# then open http://localhost:3000
```

## Edit content

All content is in `frontend/data/`:

- **Company name, tagline, colors, contact, legal** → `config.json`
  (colors apply automatically via CSS variables — see `THEME_EXAMPLES.md`)
- **Team members** → `team.json`
- **Services** → `services.json`

No rebuild needed — edit the JSON and refresh.

## Deploy

See **[NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)** — drag-and-drop the `frontend` folder to
Netlify, or connect the GitHub repo for auto-deploys.

## Course compliance

- ✅ Impressum (footer → Impressum)
- ✅ GDPR / Privacy Policy (footer → Privacy Policy)
- ✅ Fictional-company disclaimer (footer)
- ✅ Responsive + accessible (mobile nav, form labels, reduced-motion support)
