import { config } from '../data';
import { HeartIcon, InfoIcon } from './icons';

interface FooterProps {
  onOpenImpressum: () => void;
  onOpenPrivacy: () => void;
}

const exploreLinks = [
  { href: '#about', label: 'About' },
  { href: '#vision', label: 'Vision & Mission' },
  { href: '#services', label: 'Services' },
  { href: '#team', label: 'Team' },
  { href: '#contact', label: 'Contact' },
];

export default function Footer({ onOpenImpressum, onOpenPrivacy }: FooterProps) {
  const { name, tagline } = config.company;
  const { email, linkedin, address } = config.contact;
  const [brandFirst, brandSecond] = name.split(/(?=[A-Z])/);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <a className="footer-logo" href="#top" aria-label={`${name} – back to top`}>
              <span className="footer-logo-tile">
                <img src="/logo.svg" alt="" width={34} height={34} />
              </span>
              <span className="footer-logo-text">
                {brandFirst}
                {brandSecond && <span className="footer-logo-accent">·{brandSecond}</span>}
              </span>
            </a>
            <p className="footer-prompt" aria-hidden="true">
              <span className="footer-prompt-sign">$</span> think --digitally
              <span className="footer-cursor" />
            </p>
            <p className="footer-tagline">{tagline}</p>
          </div>

          {/* Explore */}
          <nav className="footer-col" aria-label="Footer navigation">
            <h3>Explore</h3>
            <ul>
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <div className="footer-col">
            <h3>Legal</h3>
            <ul>
              <li>
                <a
                  href="#impressum"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenImpressum();
                  }}
                >
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href="#gdpr"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenPrivacy();
                  }}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              {linkedin && (
                <li>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
              <li>
                <address>
                  {address.street}
                  <br />
                  {address.postal_code} {address.city}
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Required academic disclaimer: kept prominent on purpose */}
        <div className="disclaimer-panel" role="note" aria-label="Disclaimer">
          <div className="disclaimer-label">
            <InfoIcon size={18} />
            Disclaimer &middot; Fictional company
          </div>
          <p>{config.legal.disclaimer}</p>
          <ul className="disclaimer-meta" aria-label="Project context">
            <li>Planspiel Web Engineering</li>
            <li>TU Chemnitz</li>
            <li>WS 2026/27</li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p className="footer-love">
            Made with
            <HeartIcon className="footer-heart" />
            in {address.city} by the {name} team
          </p>
          <a className="footer-top-link" href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
