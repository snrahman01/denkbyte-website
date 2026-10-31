import { useEffect, useRef, useState } from 'react';
import { config } from '../data';

const links = [
  { id: 'about', label: 'About' },
  { id: 'vision', label: 'Vision & Mission' },
  { id: 'services', label: 'Services' },
  { id: 'team', label: 'Team' },
];

// Sections the scroll-spy watches ("top" is the hero, which has no nav link).
const watchedIds = ['top', ...links.map((l) => l.id), 'contact'];

// "DenkByte" -> ["Denk", "Byte"] so the wordmark can be two-tone.
const [brandFirst, brandSecond] = config.company.name.split(/(?=[A-Z])/);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const navRef = useRef<HTMLElement>(null);

  // Add a shadow once the page has been scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the link of the section crossing the middle of the viewport.
  useEffect(() => {
    const sections = watchedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with Escape or a click outside the navbar.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav
      ref={navRef}
      className={`navbar${scrolled ? ' scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="container">
        <div className="nav-content">
          <a className="logo" href="#top" aria-label={`${config.company.name} – back to top`} onClick={close}>
            <img src="/logo.svg" alt="" className="logo-mark" width={44} height={44} />
            <span className="logo-words" aria-hidden="true">
              <span className="logo-text">
                {brandFirst}
                {brandSecond && (
                  <>
                    <span className="logo-dot">·</span>
                    <span className="logo-byte">{brandSecond}</span>
                  </>
                )}
              </span>
              <span className="logo-tagline">
                <span className="logo-tagline-sign">$</span> think --digitally
                <span className="logo-tagline-cursor" />
              </span>
            </span>
          </a>

          <button
            className={`nav-toggle${open ? ' open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`nav-menu${open ? ' active' : ''}`} id="nav-menu">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  className="nav-link"
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'location' : undefined}
                  onClick={close}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="nav-cta">
              <a
                className="btn btn-accent"
                href="#contact"
                aria-current={active === 'contact' ? 'location' : undefined}
                onClick={close}
              >
                Contact us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
