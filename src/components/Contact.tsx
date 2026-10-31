import { useEffect, useRef, useState, type ReactNode } from 'react';
import { config } from '../data';
import Reveal from './Reveal';
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  LinkedInIcon,
  MailIcon,
  PinIcon,
} from './icons';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable (e.g. insecure context) - the mailto link still works */
    }
  };

  return (
    <button type="button" className="copy-btn" onClick={copy} aria-label="Copy email address">
      {copied ? <CheckIcon size={16} strokeWidth={2.4} /> : <CopyIcon size={16} strokeWidth={2} />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function Card({
  icon,
  title,
  text,
  children,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <article className="contact-card">
      <div className="contact-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p className="contact-card-text">{text}</p>
      {children}
    </article>
  );
}

export default function Contact() {
  const { email, linkedin, address } = config.contact;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.postal_code} ${address.city}, ${address.country}`,
  )}`;
  // "https://www.linkedin.com/company/denkbyte/" -> "linkedin.com/company/denkbyte"
  const linkedinLabel = linkedin?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="section-head">
          <p className="section-eyebrow">// contact</p>
          <h2>Contact Us</h2>
          <p className="contact-subtitle">Have an idea or a challenge? Let&rsquo;s talk about it.</p>
        </Reveal>

        <div className="contact-grid">
          <Reveal>
            <Card
              icon={<MailIcon size={28} />}
              title="Email us"
              text="Questions, project ideas or just a hello — drop us a line."
            >
              <a href={`mailto:${email}`} className="contact-card-value">
                {email}
              </a>
              <div className="contact-card-actions">
                <a href={`mailto:${email}`} className="btn btn-accent">
                  Send an email <ArrowRightIcon size={16} strokeWidth={2} />
                </a>
                <CopyButton text={email} />
              </div>
            </Card>
          </Reveal>

          <Reveal delay={120}>
            <Card
              icon={<LinkedInIcon size={26} />}
              title="Connect on LinkedIn"
              text="Follow our company page for news, projects and updates."
            >
              {linkedin ? (
                <>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="contact-card-value">
                    {linkedinLabel}
                  </a>
                  <div className="contact-card-actions">
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                      Visit our page <ArrowRightIcon size={16} strokeWidth={2} />
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="contact-card-value contact-card-value--muted">linkedin.com/company/&hellip;</p>
                  <div className="contact-card-actions">
                    <span className="btn btn-outline is-disabled" aria-disabled="true">
                      Coming soon
                    </span>
                  </div>
                </>
              )}
            </Card>
          </Reveal>

          <Reveal delay={240}>
            <Card
              icon={<PinIcon size={28} />}
              title="Visit us"
              text="Find us on the campus of TU Chemnitz, in the heart of Saxony."
            >
              <address className="contact-card-value">
                {address.street}
                <br />
                {address.postal_code} {address.city}, {address.country}
              </address>
              <div className="contact-card-actions">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                  Open in Maps <ArrowRightIcon size={16} strokeWidth={2} />
                </a>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
