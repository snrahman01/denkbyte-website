import { useEffect } from 'react';
import { config } from '../data';
import { ArrowRightIcon } from './icons';
import Logo, { brandLabel } from './Logo';
import ThemeToggle from './ThemeToggle';

/** Shown for any path other than "/" (Netlify serves index.html with a 404 status, see netlify.toml). */
export default function NotFound() {
  const { name } = config.company;
  // Keep the terminal line short on very long or odd URLs.
  const rawPath = decodeURIComponent(window.location.pathname);
  const path = rawPath.length > 32 ? `${rawPath.slice(0, 31)}…` : rawPath;

  useEffect(() => {
    document.title = `404 · Page not found | ${name}`;

    // Search engines shouldn't index the error page.
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, [name]);

  return (
    <div className="nf">
      <nav className="navbar" aria-label="Main navigation">
        <div className="container">
          <div className="nav-content">
            <Logo href="/" label={`${brandLabel} – home`} />
            <span className="nf-spacer" />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main id="main" className="nf-main">
        <div className="container nf-inner">
          <div className="nf-code" aria-hidden="true">
            <span>4</span>
            <span className="nf-ghost">👻</span>
            <span>4</span>
          </div>

          <h1>
            This page <span className="hero-highlight">ghosted you</span>&nbsp;👻
          </h1>

          <p className="nf-lead">It&rsquo;s not you, it&rsquo;s us. Let&rsquo;s get you back home.</p>

          <p className="nf-term" aria-hidden="true">
            <span className="nf-term-sign">$</span> cd {path}
            <br />
            <span className="nf-term-err">error 404: no such page or directory</span>
          </p>

          <a href="/" className="btn btn-accent btn-lg">
            Take me home
            <ArrowRightIcon size={18} strokeWidth={2.5} />
          </a>
        </div>
      </main>

      <footer className="nf-footer">
        &copy; {new Date().getFullYear()} {name}
      </footer>
    </div>
  );
}
