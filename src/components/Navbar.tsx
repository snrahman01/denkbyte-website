import { useEffect, useRef, useState } from 'react';
import Logo, { brandLabel } from './Logo';
import ThemeToggle from './ThemeToggle';

const links = [
  { id: 'about', label: 'About' },
  { id: 'vision', label: 'Vision & Mission' },
  { id: 'services', label: 'Services' },
  { id: 'team', label: 'Team' },
];

// Sections the scroll-spy watches ("top" is the hero, which has no nav link).
const watchedIds = ['top', ...links.map((l) => l.id), 'contact'];

const logoLabel = `${brandLabel} – back to top`;

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
    <nav ref={navRef} className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="container">
        <div className="nav-content">
          <Logo href="#top" label={logoLabel} onClick={close} />

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

          <ThemeToggle />

          {/* Hamburger sits after the theme toggle so both stay visible on mobile */}
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
        </div>
      </div>
    </nav>
  );
}
