# DenkByte — Company Website

Company website for **DenkByte**, a software engineering team focused on AI, web and mobile solutions.
Live site: **https://denkbyte.netlify.app/**

> **Disclaimer:** This website represents a fictional company created for educational purposes as part
> of the Planspiel Web Engineering course at Technische Universität Chemnitz (WS 2026/27). Any
> resemblance to real companies or organizations is purely coincidental.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for development and bundling
- Plain CSS (one stylesheet, theme via CSS variables), no UI framework
- Hosted on [Netlify](https://www.netlify.com/)

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (includes npm) and Git.

```bash
git clone https://github.com/snrahman01/denkbyte-website.git
cd denkbyte-website
npm install
npm run dev
```

Open http://localhost:5173. The page reloads automatically when you edit a file.

### Scripts

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload                  |
| `npm run typecheck` | Type-check the project without building               |
| `npm run build`     | Type-check, then create a production build in `dist/` |
| `npm run preview`   | Serve the production build locally                    |

## Project structure

```
├── index.html               # HTML entry point (meta tags, favicon, social preview)
├── netlify.toml             # Netlify build + caching config
├── public/                  # Static files: logo, favicon, touch icon, social image
└── src/
    ├── main.tsx             # App bootstrap, applies theme colors
    ├── App.tsx              # Page layout and legal dialogs
    ├── styles.css           # All styling
    ├── types.ts             # Types for the JSON data
    ├── components/          # One file per page section, plus Modal, Reveal and icons
    ├── hooks/               # useInView (scroll-triggered animations)
    ├── utils/               # smoothScroll (in-page link scrolling)
    └── data/                # Site content (see below)
```

## Editing content

All text content lives in `src/data/`. No component changes are needed for routine updates.

| File               | Contains                                                                  |
| ------------------ | ------------------------------------------------------------------------- |
| `site.config.json` | Company name, tagline, brand colors, email, LinkedIn, address, legal text |
| `team.json`        | Team members (name, role, bio, GitHub/GitLab/LinkedIn links)              |
| `services.json`    | Services (title, description, `icon`, `tags`)                             |

- `icon` in `services.json` must be one of: `ai`, `code`, `chart`, `cloud`, `speed`, `shield`.
- Brand colors are set in `site.config.json` under `branding.colors`. `src/main.tsx` copies them into
  CSS variables at startup. Small orange text on light backgrounds uses a darker shade,
  `--color-secondary-text` in `src/styles.css`, to meet WCAG AA contrast. Check it if you change the
  secondary color.

## Deployment

The site is deployed on Netlify from this repository. Build settings are in `netlify.toml`
(`npm run build`, publish directory `dist/`, Node 22), so no manual configuration is needed.

- Pushes to `main` deploy to production.
- Other branches and pull requests get a preview URL.
- To roll back, open an earlier deploy in the Netlify dashboard and choose **Publish deploy**.

The social preview tags in `index.html` (`og:url`, `og:image`, canonical link) use the absolute
production URL. Update them if the domain changes.

## Accessibility

Audited with axe-core against WCAG 2.1 A/AA with no violations. Includes a skip link, semantic
landmarks and heading order, visible keyboard focus, `prefers-reduced-motion` support, and dialogs
that trap focus, close with Escape and restore focus. Re-run an audit after larger design changes.

## Course requirements

- Impressum and Privacy Policy (GDPR), opened from the footer
- Fictional-company disclaimer in the footer
- Responsive layout with a mobile navigation
