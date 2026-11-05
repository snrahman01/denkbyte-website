import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import gsap from 'gsap';
import { contactNav, mainNav } from '../data/navigation';
import { cn } from '../lib/cn';
import { ArrowRightIcon } from './icons';
import Button from './ui/Button';
import Container from './ui/Container';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

/** Desktop links: brand underline that grows from the centre, tinted background on the current page */
const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative block rounded-full px-4 py-2 text-[0.92rem] font-medium text-fg no-underline transition-colors duration-150 hover:bg-tint hover:text-heading',
    'after:absolute after:inset-x-4 after:bottom-1.5 after:h-0.5 after:scale-x-0 after:rounded-sm after:bg-bar after:transition-transform after:duration-300 hover:after:scale-x-100',
    isActive &&
      'bg-tint font-bold text-heading after:scale-x-100 dark:shadow-[inset_0_0_0_1px_rgb(34_211_238/0.18)]',
  );

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  // Shadow once the page has been scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: Escape or a click outside closes it; the page behind doesn't scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    document.body.style.overflow = 'hidden';
    // Growing the window to desktop width closes the mobile menu
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = () => desktop.matches && setOpen(false);
    desktop.addEventListener('change', onDesktop);
    return () => {
      desktop.removeEventListener('change', onDesktop);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Mobile menu animation (GSAP). Opening plays a 2 s sequence, but the links can be tapped right away.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;
    const q = gsap.utils.selector(panel);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!open) {
        gsap.to(overlay, { autoAlpha: 0, duration: 0.25 });
        gsap.to(panel, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: reduced ? 0 : 0.35,
          ease: 'power3.in',
          onComplete: () => void gsap.set(panel, { visibility: 'hidden' }),
        });
        return;
      }

      gsap.set(panel, { visibility: 'visible' });
      if (reduced) {
        gsap.set(panel, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(overlay, { autoAlpha: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to(overlay, { autoAlpha: 1, duration: 0.4 }, 0)
        .fromTo(
          panel,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55 },
          0,
        )
        .fromTo(q('.menu-sweep'), { scaleX: 0 }, { scaleX: 1, duration: 2, ease: 'power2.inOut' }, 0)
        .fromTo(
          q('.menu-item'),
          { x: -28, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          0.15,
        )
        .fromTo(
          q('.menu-cta'),
          { y: 16, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
          0.6,
        )
        .fromTo(q('.menu-foot'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.9)
        .fromTo(
          q('.menu-glow'),
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
          0.2,
        );
    }, panel);
    // Stop (don't undo) the running animation, so closing can animate from where it is
    return () => ctx.kill();
  }, [open]);

  return (
    <>
      {/* Dim the page behind the open mobile menu */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        onClick={close}
        className="invisible fixed inset-0 z-40 bg-dark/45 opacity-0 backdrop-blur-[2px] lg:hidden"
      />

      <header
        className={cn(
          'sticky top-0 z-50 border-b border-line bg-nav backdrop-blur-md backdrop-saturate-150 transition-shadow duration-300',
          scrolled && 'shadow-[0_6px_24px_rgb(15_24_41/0.08)] dark:shadow-[0_8px_28px_rgb(0_0_0/0.5)]',
        )}
      >
        <nav ref={navRef} aria-label="Main navigation">
          <Container className="relative flex h-18 items-center gap-2">
            <Logo onClick={close} />

            {/* ---------- Desktop ---------- */}
            <ul className="ml-auto hidden items-center gap-1 lg:flex">
              {mainNav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={linkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="ml-3 hidden lg:block">
              <Button to={contactNav.to} size="sm">
                Contact us
              </Button>
            </div>

            <ThemeToggle className="ml-auto lg:ml-3" />

            {/* ---------- Mobile + tablet: hamburger ---------- */}
            <button
              type="button"
              className={cn(
                'relative size-11 flex-none rounded-xl border bg-surface transition-colors duration-300 lg:hidden',
                open ? 'border-secondary' : 'border-line-strong',
              )}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {[
                open ? 'top-[20px] w-5 rotate-45' : 'top-[13px] w-5',
                open ? 'top-[20px] w-0 opacity-0' : 'top-[20px] w-3.5',
                open ? 'top-[20px] w-5 -rotate-45' : 'top-[27px] w-5',
              ].map((state, i) => (
                <span
                  key={i}
                  className={cn(
                    'absolute left-[11px] h-0.5 rounded-sm transition-all duration-300',
                    open ? 'bg-secondary' : 'bg-heading',
                    state,
                  )}
                />
              ))}
            </button>
          </Container>

          {/* ---------- Mobile + tablet: dropdown panel ---------- */}
          <div
            ref={panelRef}
            id="mobile-menu"
            className="invisible absolute inset-x-0 top-full z-10 overflow-hidden rounded-b-3xl border-b border-line bg-surface shadow-[0_24px_40px_rgb(15_24_41/0.18)] lg:hidden dark:shadow-[0_24px_40px_rgb(0_0_0/0.6)]"
          >
            {/* decoration: dot grid, warm glow, sweeping brand line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-dots mask-b-from-0% mask-b-to-80%"
            />
            <div
              aria-hidden="true"
              className="menu-glow pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(232_115_12/0.18),transparent_65%)]"
            />
            <span
              aria-hidden="true"
              className="menu-sweep absolute inset-x-0 top-0 h-0.5 origin-left bg-brand"
            />

            <div className="relative mx-auto max-w-300 px-5 pt-4 pb-6 sm:px-6">
              <ul className="flex flex-col">
                {mainNav.map((item) => (
                  <li key={item.to} className="menu-item border-b border-line last:border-b-0">
                    <NavLink
                      to={item.to}
                      onClick={close}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-4 py-4 no-underline transition-colors duration-200',
                          isActive ? 'text-heading' : 'text-fg hover:text-heading',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={cn(
                              'flex-1 text-xl tracking-tight',
                              isActive ? 'font-extrabold' : 'font-semibold',
                            )}
                          >
                            {item.label}
                          </span>
                          <span
                            className={cn(
                              'text-secondary transition-transform duration-300 group-hover:translate-x-1',
                              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
                            )}
                          >
                            <ArrowRightIcon size={18} strokeWidth={2.4} />
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <Button to={contactNav.to} size="lg" onClick={close} className="menu-cta mt-5 w-full">
                Contact us <ArrowRightIcon size={18} strokeWidth={2.5} />
              </Button>

              <p aria-hidden="true" className="menu-foot mt-5 text-center font-mono text-xs text-muted">
                <span className="font-bold text-secondary">$</span> think --digitally
                <span className="ml-1 inline-block h-[1em] w-[0.5em] animate-blink bg-secondary align-text-bottom" />
              </p>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
