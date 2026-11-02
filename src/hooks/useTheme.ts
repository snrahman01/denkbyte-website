import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'denkbyte-theme'; // keep in sync with the inline script in index.html
const THEME_COLOR: Record<Theme, string> = {
  light: '#16213E',
  dark: '#0A0E17',
};

/* ------------------------------------------------------------------
   A tiny shared store: the navbar toggle and the hero terminal's `theme`
   command both read and write the same value, so they never disagree.
   The source of truth is <html data-theme>, set before first paint by the
   inline script in index.html.
   ------------------------------------------------------------------ */

const listeners = new Set<() => void>();

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null; // storage can be blocked (private mode, strict settings)
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** Writes the theme to <html data-theme> and the browser UI colour (mobile address bar). */
function apply(theme: Theme, animate: boolean) {
  const root = document.documentElement;

  if (animate) {
    // Short-lived class that fades colours between themes (see "theme-transition" in styles.css).
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 400);
  }

  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  listeners.forEach((listener) => listener());
}

/** Switch theme and remember the visitor's choice. */
function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore: the theme still switches for this visit */
  }
  apply(theme, true);
}

function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

if (typeof window !== 'undefined') {
  if (!document.documentElement.dataset.theme) apply(readStored() ?? systemTheme(), false);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (readStored() === null) apply(systemTheme(), true);
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light' as Theme);
  return { theme, toggle: toggleTheme, setTheme };
}
