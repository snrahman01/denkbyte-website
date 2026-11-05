import { Outlet, ScrollRestoration } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/** Shared frame of every page: navbar, the page itself, footer. */
export default function RootLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-200 rounded-lg bg-primary px-4 py-2.5 text-sm text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-4 dark:border dark:border-line-strong"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {/* New page -> start at the top; Back button -> previous scroll position */}
      <ScrollRestoration />
    </>
  );
}
