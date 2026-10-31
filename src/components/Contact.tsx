import { useState, type ReactNode } from 'react';
import { config } from '../data';
import CopyButton from './CopyButton';
import QrDialog, { preloadQrImages, type QrItem } from './QrDialog';
import Reveal from './Reveal';
import { ArrowRightIcon, FollowIcon, InstagramIcon, LinkedInIcon, MailIcon, PinIcon, QrIcon } from './icons';

/**
 * "https://www.linkedin.com/company/denkbyte/" -> "/company/denkbyte".
 * A malformed value in site.config.json (e.g. missing "https://") must not crash the page, so it
 * falls back to showing the text as written.
 */
function pathOf(url: string) {
  try {
    return new URL(url).pathname.replace(/\/$/, '') || url;
  } catch {
    return url;
  }
}

/** "https://www.instagram.com/denkbyte/" -> "@denkbyte" */
function handleOf(url: string) {
  const path = pathOf(url);
  const last = path.split('/').filter(Boolean).pop();
  return last && path.startsWith('/') ? `@${last}` : path;
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
  const { email, linkedin, instagram, qr, address } = config.contact;
  const [qrOpen, setQrOpen] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.postal_code} ${address.city}, ${address.country}`,
  )}`;

  // Social profiles shown in the "Follow us" card. A profile without a URL in site.config.json is skipped.
  const socials = [
    {
      name: 'LinkedIn',
      url: linkedin,
      handle: linkedin && pathOf(linkedin),
      qr: qr?.linkedin,
      icon: <LinkedInIcon size={18} />,
    },
    {
      name: 'Instagram',
      url: instagram,
      handle: instagram && handleOf(instagram),
      qr: qr?.instagram,
      icon: <InstagramIcon size={19} strokeWidth={1.9} />,
    },
  ].filter((s): s is typeof s & { url: string; handle: string } => Boolean(s.url));

  // Profiles that also have a QR image in site.config.json get an entry in the QR dialog.
  const qrItems: QrItem[] = socials.flatMap((s) =>
    s.qr ? [{ name: s.name, url: s.url, qr: s.qr, icon: s.icon }] : [],
  );

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
                <CopyButton text={email} label="Copy email address" />
              </div>
            </Card>
          </Reveal>

          <Reveal delay={120}>
            <Card
              icon={<FollowIcon size={28} />}
              title="Follow us"
              text="News, projects and behind-the-scenes from the DenkByte team."
            >
              {socials.length > 0 ? (
                <>
                  <ul className="social-list">
                    {socials.map((s) => (
                      <li key={s.name}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="social-link">
                          <span className="social-link-icon">{s.icon}</span>
                          <span className="social-link-text">
                            <span className="social-link-name">{s.name}</span>
                            <span className="social-link-handle">{s.handle}</span>
                          </span>
                          <span className="social-link-arrow">
                            <ArrowRightIcon size={16} strokeWidth={2.2} />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  {qrItems.length > 0 && (
                    <div className="contact-card-actions">
                      <button
                        type="button"
                        className="btn btn-accent"
                        aria-haspopup="dialog"
                        onClick={() => setQrOpen(true)}
                        onPointerEnter={() => preloadQrImages(qrItems)}
                        onFocus={() => preloadQrImages(qrItems)}
                      >
                        <QrIcon size={18} strokeWidth={2} /> Show QR code
                      </button>
                    </div>
                  )}
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

      {qrItems.length > 0 && <QrDialog open={qrOpen} onClose={() => setQrOpen(false)} items={qrItems} />}
    </section>
  );
}
