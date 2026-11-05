import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import { contactNav, mainNav } from '../data/navigation';
import { cn } from '../lib/cn';
import Button from './ui/Button';
import Container from './ui/Container';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative block rounded-xl px-4 py-3.5 text-base font-medium text-fg no-underline transition-colors duration-150 hover:bg-tint hover:text-heading',
    'lg:rounded-full lg:py-2 lg:text-[0.92rem]',
    // brand underline, grows from the centre
    'after:absolute after:inset-x-4 after:bottom-1.5 after:h-0.5 after:scale-x-0 after:rounded-sm after:bg-bar after:transition-transform after:duration-300 hover:after:scale-x-100',
    isActive &&
      'bg-tint font-bold text-heading after:scale-x-100 dark:shadow-[inset_0_0_0_1px_rgb(34_211_238/0.18)]',
  );

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const close = () => setOpen(false);

  // Shadow once the page has been scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu with Escape or a click outside the navbar
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

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-line bg-nav backdrop-blur-md backdrop-saturate-150 transition-shadow duration-300',
        scrolled && 'shadow-[0_6px_24px_rgb(15_24_41/0.08)] dark:shadow-[0_8px_28px_rgb(0_0_0/0.5)]',
      )}
    >
      <nav ref={navRef} aria-label="Main navigation">
        <Container className="flex h-18 items-center gap-2">
          <Logo onClick={close} />

          <ul
            id="nav-menu"
            className={cn(
              // Mobile: dropdown panel under the bar
              'absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-surface px-5 pt-3 pb-5 shadow-[0_20px_30px_rgb(15_24_41/0.12)] transition-[opacity,transform,visibility] duration-300 sm:px-6 dark:shadow-[0_24px_40px_rgb(0_0_0/0.55)]',
              open
                ? 'visible translate-y-0 opacity-100'
                : 'pointer-events-none invisible -translate-y-2 opacity-0',
              // Desktop: inline row
              'lg:pointer-events-auto lg:visible lg:static lg:ml-auto lg:translate-y-0 lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none dark:lg:shadow-none',
            )}
          >
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass} onClick={close}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 lg:mt-0 lg:ml-3">
              <Button
                to={contactNav.to}
                size="sm"
                onClick={close}
                className="w-full py-3.5 lg:w-auto lg:py-2.5"
              >
                Contact us
              </Button>
            </li>
          </ul>

          <ThemeToggle className="ml-auto lg:ml-3" />

          {/* Hamburger (mobile + tablet) */}
          <button
            type="button"
            className="relative size-11 flex-none rounded-xl border border-line-strong bg-surface lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {[
              open ? 'top-[20px] rotate-45' : 'top-[13px]',
              open ? 'top-[20px] opacity-0' : 'top-[20px]',
              open ? 'top-[20px] -rotate-45' : 'top-[27px]',
            ].map((state, i) => (
              <span
                key={i}
                className={cn(
                  'absolute inset-x-3 h-0.5 rounded-sm bg-heading transition-all duration-300',
                  state,
                )}
              />
            ))}
          </button>
        </Container>
      </nav>
    </header>
  );
}
