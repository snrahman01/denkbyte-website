import { Link } from 'react-router';
import { config } from '../data';
import { contactNav, legalNav, mainNav } from '../data/navigation';
import Backdrop, { Glow } from './ui/Backdrop';
import Container from './ui/Container';
import { HeartIcon, InfoIcon } from './icons';

const exploreLinks = [...mainNav, contactNav];

const colTitle =
  "mb-4 font-mono text-xs font-bold tracking-widest text-accent uppercase before:text-white/30 before:content-['//_']";
const colLink =
  'text-sm wrap-anywhere text-white/72 no-underline transition-[color,padding] duration-150 hover:pl-1 hover:text-accent';

export default function Footer() {
  const { name, tagline } = config.company;
  const { email, linkedin, instagram, address } = config.contact;
  const [brandFirst, brandSecond] = name.split(/(?=[A-Z])/);

  return (
    <footer className="relative isolate overflow-hidden bg-footer pt-16 pb-8 text-white dark:border-t dark:border-line">
      <Backdrop fade="top-left" />
      <Glow className="-top-60 -right-45 size-130 opacity-70" />

      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              aria-label={`${[brandFirst, brandSecond].filter(Boolean).join('·')} – home`}
              className="inline-flex items-center gap-3 no-underline"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-[0_8px_20px_rgb(0_0_0/0.35)]">
                <img src="/logo.svg" alt="" width={34} height={34} />
              </span>
              <span className="font-mono text-[1.6rem] leading-none font-extrabold tracking-[-0.04em] text-white">
                {brandFirst}
                {brandSecond && <span className="text-secondary">·{brandSecond}</span>}
              </span>
            </Link>
            <p aria-hidden="true" className="mt-6 font-mono text-sm text-white/85">
              <span className="font-bold text-accent">$</span> think --digitally
              <span className="ml-1 inline-block h-[1.05em] w-[0.55em] animate-blink bg-secondary align-text-bottom" />
            </p>
            <p className="mt-2 max-w-88 text-sm leading-[1.7] text-white/60">{tagline}</p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className={colTitle}>Explore</h2>
            <ul className="flex flex-col gap-2.5">
              {exploreLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={colLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={colTitle}>Legal</h2>
            <ul className="flex flex-col gap-2.5">
              {legalNav.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={colLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h2 className={colTitle}>Contact</h2>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={`mailto:${email}`} className={colLink}>
                  {email}
                </a>
              </li>
              {linkedin && (
                <li>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className={colLink}>
                    LinkedIn
                  </a>
                </li>
              )}
              {instagram && (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className={colLink}>
                    Instagram
                  </a>
                </li>
              )}
              <li>
                <address className="text-sm leading-[1.7] text-white/55 not-italic">
                  {address.street}
                  <br />
                  {address.postal_code} {address.city}
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Required academic disclaimer: kept prominent on purpose */}
        <div
          role="note"
          aria-label="Disclaimer"
          className="relative overflow-hidden rounded-xl border border-accent/35 bg-linear-135 from-accent/10 to-secondary/4 px-5 pt-9 pb-6 sm:px-8"
        >
          {/* hazard stripes: "not real" */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-[repeating-linear-gradient(-45deg,var(--color-accent)_0_10px,var(--color-dark)_10px_20px)] opacity-85"
          />
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-accent uppercase">
            <InfoIcon size={18} />
            Disclaimer &middot; Fictional company
          </div>
          <p className="max-w-[62rem] leading-[1.7] text-white/92">{config.legal.disclaimer}</p>
          <ul aria-label="Project context" className="mt-4 flex flex-wrap gap-2">
            {['Planspiel Web Engineering', 'TU Chemnitz', 'WS 2026/27'].map((item) => (
              <li
                key={item}
                className="rounded-full border border-accent/40 px-3 py-1 font-mono text-[0.74rem] text-accent"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8">
          <p>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p>
            Made with <HeartIcon className="inline-block animate-heartbeat align-[-2px] text-[#ff4d6d]" /> in{' '}
            {address.city} by the {name} team
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="self-start font-mono text-[0.8rem] text-white/72 transition-colors hover:text-accent sm:self-auto"
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </Container>
    </footer>
  );
}
