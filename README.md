# DenkByte — Company Website

A company website built for the **Planspiel Web Engineering** course at
TU Chemnitz (WS 2026/27). DenkByte is a fictional company created for academic purposes.

> **Disclaimer:** This website does not belong to a real company. It is a Planspiel
> Web Engineering project at the University of Technology Chemnitz.

## Tech

- **React 19 + TypeScript**, bundled with **Vite**
- Content lives in typed JSON files in `src/data/`
- Hosted free on **Netlify** (auto-deploys from `main`)

## Project structure

```
denkbyte-website/
├── index.html            # Vite entry point
├── src/
│   ├── main.tsx          # bootstraps React + applies theme colors
│   ├── App.tsx           # page layout + legal modals
│   ├── types.ts          # TypeScript types for the JSON data
│   ├── styles.css        # theme + layout (CSS variables for easy theming)
│   ├── components/       # Navbar, Hero, About, Vision, Services, Team, Contact, Footer, Modal, Legal
│   └── data/
│       ├── site.config.json # company name, colors, contact (email + address), legal text
│       ├── team.json        # team members
│       └── services.json    # services offered
├── public/               # static assets copied as-is (logo.png, logo.svg)
└── netlify.toml          # Netlify build config (npm run build -> dist/)
```

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev        # dev server with hot reload -> http://localhost:5173
```

Other commands:

```bash
npm run typecheck  # TypeScript type-check only
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Edit content

All content is in `src/data/`:

- **Company name, tagline, colors, contact, legal** → `site.config.json`
  (see [Theming](#theming))
- **Team members** → `team.json`
- **Services** → `services.json`

Commit and push — Netlify rebuilds the site automatically.

## Theming

Brand colors live in `branding.colors` in `src/data/site.config.json`. At startup, `src/main.tsx`
copies each one into a CSS variable that `src/styles.css` uses everywhere:

| Config key   | CSS variable         | Used for                       |
| ------------ | -------------------- | ------------------------------ |
| `primary`    | `--color-primary`    | headings, buttons, nav         |
| `secondary`  | `--color-secondary`  | accents, gradients, hover      |
| `accent`     | `--color-accent`     | highlights (footer disclaimer) |
| `dark`       | `--color-dark`       | footer background              |
| `light`      | `--color-light`      | page background                |
| `text`       | `--color-text`       | body text                      |
| `text_light` | `--color-text-light` | secondary text                 |

Keep enough contrast between text and background colors (WCAG AA).

## Deploy

The site is hosted on Netlify, which is connected to this GitHub repo. All build settings are in
`netlify.toml` (`npm run build`, publish `dist/`, Node 22), so there is nothing to configure by hand.

- **Production:** every push to `main` redeploys the live site.
- **Previews:** other branches and pull requests get their own preview URL, so check changes there
  before merging into `main`.
- **Rollback:** in Netlify → **Deploys**, open an earlier successful deploy and click
  **Publish deploy**.
- **Test the production build locally:** `npm run build` then `npm run preview`.

## Course compliance

- ✅ Impressum (footer → Impressum)
- ✅ GDPR / Privacy Policy (footer → Privacy Policy)
- ✅ Fictional-company disclaimer (footer)
- ✅ Responsive + accessible (mobile nav, keyboard-closable modals, reduced-motion support)
