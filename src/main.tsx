import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { config } from './data';
import { router } from './router';
import { runIntroLoader } from './utils/introLoader';
import { createScrollIntro, shouldPlayIntro } from './utils/scrollIntro';
import './index.css';

// Brand colours from site.config.json -> Tailwind colours (bg-primary, text-secondary, ...)
const { colors } = config.branding;
const root = document.documentElement;
root.style.setProperty('--color-primary', colors.primary);
root.style.setProperty('--color-secondary', colors.secondary);
root.style.setProperty('--color-accent', colors.accent);
root.style.setProperty('--color-dark', colors.dark);
root.style.setProperty('--color-light', colors.light);
root.style.setProperty('--color-text', colors.text);
root.style.setProperty('--color-text-light', colors.text_light);

// Links in Netlify Identity emails (invite, password reset) point to the homepage: hand them to /admin.
const AUTH_LINK = /^#(invite|recovery|confirmation|email_change)_token=/;
if (AUTH_LINK.test(window.location.hash) && window.location.pathname !== '/admin') {
  window.location.replace(`/admin${window.location.hash}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

root.setAttribute('data-booted', ''); // tells the failsafe in index.html that the app is running

// 1. Loader (markup + first-paint styles live in index.html), animated with GSAP.
// 2. On the homepage, the scroll-driven intro takes over once the loader has fully finished.
// The admin page skips both: editors shouldn't wait 2.5 s every time.
if (window.location.pathname.startsWith('/admin')) {
  document.getElementById('preloader')?.remove();
  root.classList.remove('is-loading');
} else {
  const intro = shouldPlayIntro() ? createScrollIntro() : null;
  runIntroLoader({ holdPage: intro !== null, onDone: () => intro?.start() });
}
