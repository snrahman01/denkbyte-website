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
├── public/                  # Static files: logo, favicon, touch icon, social image, QR codes
└── src/
    ├── main.tsx             # App bootstrap, applies theme colors
    ├── App.tsx              # Page layout and legal dialogs
    ├── styles.css           # All styling
    ├── types.ts             # Types for the JSON data
    ├── components/          # One file per page section, plus Modal, Reveal and icons
    ├── hooks/               # useInView (scroll animations), useTheme (light/dark)
    ├── utils/               # smoothScroll (in-page link scrolling), terminalCommands (hero terminal)
    └── data/                # Site content (see below)
```

## Editing content

All text content lives in `src/data/`. No component changes are needed for routine updates.

| File               | Contains                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `site.config.json` | Company name, tagline, brand colors, email, LinkedIn, Instagram (+ QR images), address, legal text |
| `team.json`        | Team members (name, role, bio, GitHub/GitLab/LinkedIn links)                                       |
| `services.json`    | Services (title, description, `icon`, `tags`)                                                      |

- `icon` in `services.json` must be one of: `ai`, `code`, `chart`, `cloud`, `speed`, `shield`.
- Brand colors are set in `site.config.json` under `branding.colors`. `src/main.tsx` copies them into
  CSS variables at startup. Small orange text on light backgrounds uses a darker shade,
  `--color-secondary-text` in `src/styles.css`, to meet WCAG AA contrast. Check it if you change the
  secondary color.

### Dark mode

A sun/moon button in the navbar switches between light and dark. The first visit follows the
visitor's OS setting; after clicking the button the choice is saved in `localStorage`
(`denkbyte-theme`). A small inline script in `index.html` applies the theme before first paint,
so there is no light flash.

- Components use semantic tokens (`--bg`, `--surface`, `--heading`, `--fg-muted`, `--border`, ...)
  defined in `:root` in `src/styles.css`. Light values are derived from the brand colors above.
- The dark palette is the `:root[data-theme='dark']` block at the end of `src/styles.css`
  ("midnight terminal": ink-blue canvas, brand orange as the hot accent, cyan for icons, chips and
  glows). Change a color there and the whole dark theme follows.
- `public/logo-dark.svg` is the logo mark with the navy half lightened, shown only in dark mode.
  If you change `logo.svg`, regenerate it by replacing `#0F1B3D` with `#E3ECF8`.

### Interactive terminal

The terminal in the hero plays the `$ think --digitally` intro, then visitors can type commands
(`help`, `services 2`, `team 3`, `contact`, `goto team`, `theme dark`, `neofetch`, plus a few hidden
easter eggs such as `sudo hire-us`). Arrow keys browse history, Tab completes, Ctrl+L clears, and
clickable "try:" chips cover touch devices.

- It is a **simulated** shell (`src/utils/terminalCommands.ts`): input is only matched against a
  command table and always rendered as plain text. Nothing is evaluated or sent anywhere.
- Answers come from `src/data/*.json`, so editing services, team or contact there updates the terminal.
- To add a command, add an entry to the `commands` array in `terminalCommands.ts`. Mark it
  `hidden: true` to keep it out of `help`.
- UI lives in `src/components/Terminal.tsx`; its styles are in the hero section of `src/styles.css`.

### QR codes (Contact section)

The "Follow us" card lists the LinkedIn and Instagram links, with a **Show QR code** button underneath.
The button opens a dialog with a LinkedIn / Instagram switch, the QR code on a white card, the link,
and Open / Copy buttons. The images are only downloaded when someone hovers or opens the dialog.

- QR images live in `public/` and are set in `site.config.json` under `contact.qr`
  (`linkedin`, `instagram`). A profile without a `qr` image is left out of the dialog; with no
  images at all, the button is hidden.
- To replace a code, drop the new image into `public/` and update the path. Any aspect ratio works.
  For a sharp result use at least 600 px wide, with a white background and a quiet margin.
- The dialog reuses `Modal.tsx` (focus trap, Escape, scroll lock). Its code is `QrDialog.tsx`, with
  styles in the "QR dialog" block of `src/styles.css`.

## Deployment

The site is deployed on Netlify from this repository. Build settings are in `netlify.toml`
(`npm run build`, publish directory `dist/`, Node 22), so no manual configuration is needed.

- Pushes to `main` deploy to production.
- Other branches and pull requests get a preview URL.
- To roll back, open an earlier deploy in the Netlify dashboard and choose **Publish deploy**.

The social preview tags in `index.html` (`og:url`, `og:image`, canonical link) use the absolute
production URL. Update them if the domain changes.

## Accessibility

Audited with axe-core 4.14 against WCAG 2.1 A/AA with no violations, in light and dark mode, with the
QR and legal dialogs open. Includes a skip link, semantic landmarks and heading order, visible
keyboard focus, `prefers-reduced-motion` support, and dialogs that trap focus, close with Escape and
restore focus. Re-run an audit after larger design changes.

- axe reports colour contrast over gradients and translucent backgrounds (hero, cards, navbar) as
  "needs review" because it cannot compute it. The main text colours were spot-checked by hand
  (WCAG AA); check them again if you change colours.
- Run audits on a settled page. For about 0.4 s after a theme switch colours are still cross-fading,
  and axe can report contrast failures for that moment only.

## Course requirements

- Impressum and Privacy Policy (GDPR), opened from the footer
- Fictional-company disclaimer in the footer
- Responsive layout with a mobile navigation
