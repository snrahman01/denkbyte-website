# DenkByte — Company Website

Company website for **DenkByte**, a software engineering team focused on AI, web and mobile solutions.
Live site: **https://denkbyte.netlify.app/**

> **Disclaimer:** This website does not belong to a real company. It is a Planspiel Web Engineering
> project at University of Technology Chemnitz.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for development and bundling
- [Tailwind CSS v4](https://tailwindcss.com/) for all styling (theme in `src/index.css`)
- [React Router 7](https://reactrouter.com/) for the pages
- [GSAP](https://gsap.com/) for the intro loader and the scroll intro
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
├── index.html               # HTML entry point (meta tags, inline intro loader for instant first paint)
├── netlify.toml             # Netlify build, caching and route config
├── public/                  # Static files: logo, favicon, touch icon, social image, QR codes
└── src/
    ├── main.tsx             # App bootstrap: brand colours, router, loader + scroll intro
    ├── router.tsx           # All routes (URL -> page)
    ├── index.css            # Tailwind import + design tokens (colours, fonts, animations)
    ├── types.ts             # Types for the JSON data
    ├── pages/               # One file per route: HomePage, AboutPage, ..., NotFoundPage
    ├── layouts/             # RootLayout: navbar + page + footer
    ├── components/
    │   ├── sections/        # Page content blocks: About, Vision, Services, Team, Contact, ...
    │   ├── ui/              # Small building blocks: Button, Card, Chip, Section, SectionHeader, ...
    │   └── *.tsx            # Navbar, Footer, Hero, Terminal, Logo, dialogs, icons
    ├── hooks/               # useInView (scroll animations), useTheme (light/dark)
    ├── lib/cn.ts            # Joins class names: cn('a', open && 'b')
    ├── utils/               # terminalCommands, introLoader, scrollIntro, qr helpers
    └── data/                # Site content + navigation links (see below)
```

## Pages and routes

| URL            | Page                         | File                           |
| -------------- | ---------------------------- | ------------------------------ |
| `/`            | Home (hero, highlights, CTA) | `src/pages/HomePage.tsx`       |
| `/about`       | About                        | `src/pages/AboutPage.tsx`      |
| `/vision`      | Vision & Mission             | `src/pages/VisionPage.tsx`     |
| `/services`    | Services                     | `src/pages/ServicesPage.tsx`   |
| `/team`        | Team                         | `src/pages/TeamPage.tsx`       |
| `/patch-notes` | Patch Notes (status updates) | `src/pages/PatchNotesPage.tsx` |
| `/contact`     | Contact                      | `src/pages/ContactPage.tsx`    |
| `/impressum`   | Impressum                    | `src/pages/ImpressumPage.tsx`  |
| `/privacy`     | Privacy Policy               | `src/pages/PrivacyPage.tsx`    |
| anything else  | 404 page                     | `src/pages/NotFoundPage.tsx`   |

**Adding a page:**

1. Create `src/pages/MyPage.tsx` (start with `<PageTitle title="..." />` and a `<Section>`).
2. Add the route in `src/router.tsx`.
3. Add the link in `src/data/navigation.ts` (navbar and footer read from there).
4. Add the path to `netlify.toml` so Netlify serves it with status 200 (otherwise it gets a 404 status).

Use `<Link to="/team">` (or `<Button to="/team">`) for links between pages, never `<a href>`, so the
page changes without a reload.

## Styling with Tailwind

Everything is styled with Tailwind classes directly in the components; there is no separate
stylesheet per component. `src/index.css` only defines the design tokens:

| Use               | Classes                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Brand colours     | `bg-primary`, `text-secondary`, `text-accent`, `bg-dark` (from `site.config.json`)                  |
| Theme colours     | `bg-page`, `bg-page-alt`, `bg-surface`, `text-heading`, `text-fg`, `text-muted`, `border-line`      |
| Brand backgrounds | `bg-band` (dark navy band), `bg-brand` (orange gradient), `bg-bar`, `bg-tint`, `bg-grid`, `bg-dots` |
| Text effect       | `text-gradient` (orange gradient text)                                                              |
| Animations        | `animate-fade-up`, `animate-blink`, `animate-pulse-dot`, `animate-heartbeat`                        |

- **Theme colours switch automatically** between light and dark mode, so most components need no
  `dark:` classes. Use `dark:` only for extras (e.g. a glow in dark mode).
- **Reuse the building blocks** in `src/components/ui/` before writing long class lists:
  `Button` (`variant="accent" | "ghost"`, `to` for pages, `href` for external links), `Card`,
  `Section`, `SectionHeader`, `Chip`, `IconTile`, `Backdrop`/`Glow`, `Container`.
- **Mobile first:** classes without a prefix apply to phones; `sm:` (640px), `md:` (768px),
  `lg:` (1024px, desktop navbar) and `xl:` (1280px) add the larger layouts.
- Install the VS Code extension **Tailwind CSS IntelliSense** for autocomplete. Prettier sorts the
  classes automatically (`prettier-plugin-tailwindcss`).

## Posting patch notes

The Planspiel rules ask for regular status updates; ours are the **Patch Notes**. Add an entry to
`src/data/patch-notes.json`:

```json
{
  "version": "1.2",
  "date": "2026-11-20",
  "tag": "Product",
  "title": "Short headline",
  "changes": ["What changed", "One short line each"]
}
```

It appears on `/patch-notes` and, if it is one of the two newest, on the homepage. Entries are sorted
by date automatically.

## Legal requirements (Planspiel)

- **Disclaimer:** the exact required sentence is `legal.disclaimer` in `site.config.json`. It is shown in
  the footer of every page and on the 404 page. Don't reword it.
- **Impressum / Privacy:** `legal.contact_person` must be a real team member with a working email (not
  the topic experts or VSR staff). If you add an external service (embedded map or video, web font,
  analytics, form service, CDN script ...), describe it in `src/pages/PrivacyPage.tsx` before it goes live.

## Editing content

All text content lives in `src/data/`. No component changes are needed for routine updates.

| File               | Contains                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `site.config.json` | Company name, tagline, brand colors, email, LinkedIn, Instagram (+ QR images), address, legal text |
| `team.json`        | Team members (name, role, bio, GitHub/GitLab/LinkedIn links)                                       |
| `services.json`    | Services (title, description, `icon`, `tags`)                                                      |

- `icon` in `services.json` must be one of: `ai`, `code`, `chart`, `cloud`, `speed`, `shield`.
- Brand colors are set in `site.config.json` under `branding.colors`. `src/main.tsx` copies them into
  CSS variables at startup, which become the Tailwind colours `primary`, `secondary`, `accent`, ...
  Small orange text on light backgrounds uses a darker shade (`text-accent-text`, `--accent-text` in
  `src/index.css`) to meet WCAG AA contrast. Check it if you change the secondary color.

### Dark mode

A sun/moon button in the navbar switches between light and dark. The first visit follows the
visitor's OS setting; after clicking the button the choice is saved in `localStorage`
(`denkbyte-theme`). A small inline script in `index.html` applies the theme before first paint,
so there is no light flash.

- Components use the theme colours (`bg-page`, `bg-surface`, `text-heading`, `text-muted`,
  `border-line`, ...). Their light values are in `:root` in `src/index.css`.
- The dark palette is the `:root[data-theme='dark']` block in `src/index.css`
  ("midnight terminal": ink-blue canvas, brand orange as the hot accent, cyan for icons, chips and
  glows). Change a color there and the whole dark theme follows.
- `public/logo-dark.svg` is the logo mark with the navy half lightened, shown only in dark mode.
  If you change `logo.svg`, regenerate it by replacing `#0F1B3D` with `#E3ECF8`.

### Interactive terminal

The terminal in the hero plays the `$ think --digitally` intro, then visitors can type commands
(`help`, `services 2`, `team 3`, `contact`, `goto team` (opens the page), `theme dark`, `neofetch`, plus a few hidden
easter eggs such as `sudo hire-us`). Arrow keys browse history, Tab completes, Ctrl+L clears, and
clickable "try:" chips cover touch devices.

- It is a **simulated** shell (`src/utils/terminalCommands.ts`): input is only matched against a
  command table and always rendered as plain text. Nothing is evaluated or sent anywhere.
- Answers come from `src/data/*.json`, so editing services, team or contact there updates the terminal.
- To add a command, add an entry to the `commands` array in `terminalCommands.ts`. Mark it
  `hidden: true` to keep it out of `help`.
- UI lives in `src/components/Terminal.tsx`.

### QR codes (Contact page)

The "Follow us" card lists the LinkedIn and Instagram links, with a **Show QR code** button underneath.
The button opens a dialog with a LinkedIn / Instagram switch, the QR code on a white card, the link,
and Open / Copy buttons. The images are only downloaded when someone hovers or opens the dialog.

- QR images live in `public/` and are set in `site.config.json` under `contact.qr`
  (`linkedin`, `instagram`). A profile without a `qr` image is left out of the dialog; with no
  images at all, the button is hidden.
- To replace a code, drop the new image into `public/` and update the path. Any aspect ratio works.
  For a sharp result use at least 600 px wide, with a white background and a quiet margin.
- The dialog reuses `Modal.tsx` (focus trap, Escape, scroll lock). Its code is `QrDialog.tsx`.

### Loader and scroll intro

Every page load starts with a 2.5 s loader (bulb, typed tagline, progress bar). Its markup and
first-paint styles are inline in `index.html` so it appears before any JavaScript loads; GSAP
animates it (`src/utils/introLoader.ts`). On the homepage a scroll-driven intro follows
(`src/utils/scrollIntro.ts`): "They say," → "People judge a webpage in 0.05 seconds." → "We built it
for that moment." → the site. One scroll / swipe / arrow key per step; a "Skip intro" button skips it.
It is skipped on other pages and for links to a section.

## Deployment

The site is deployed on Netlify from this repository. Build settings are in `netlify.toml`
(`npm run build`, publish directory `dist/`, Node 22), so no manual configuration is needed.

- Pushes to `main` deploy to production.
- Other branches and pull requests get a preview URL.
- To roll back, open an earlier deploy in the Netlify dashboard and choose **Publish deploy**.

The social preview tags in `index.html` (`og:url`, `og:image`, canonical link) use the absolute
production URL. Update them if the domain changes.

## Accessibility

Audited with axe-core against WCAG 2.1 A/AA with no violations on every page, in light and dark mode,
on desktop and phone sizes. Includes a skip link, semantic landmarks and heading order, visible
keyboard focus, `prefers-reduced-motion` support, and dialogs that trap focus, close with Escape and
restore focus. Re-run an audit after larger design changes.

- axe reports colour contrast over gradients and translucent backgrounds (hero, cards, navbar) as
  "needs review" because it cannot compute it. The main text colours were spot-checked by hand
  (WCAG AA); check them again if you change colours.
- Run audits on a settled page. For about 0.4 s after a theme switch colours are still cross-fading,
  and axe can report contrast failures for that moment only.

## Course requirements

- Impressum and Privacy Policy (GDPR) pages, linked from the footer
- Required Planspiel disclaimer in the footer of every page
- Responsive layout with a mobile navigation
