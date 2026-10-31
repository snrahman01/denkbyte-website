import { config } from '../data';

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Contact() {
  const { email, address } = config.contact;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.postal_code} ${address.city}, ${address.country}`,
  )}`;

  return (
    <section id="contact" className="section alternate">
      <div className="container">
        <h2>Contact Us</h2>
        <p className="section-subtitle">Have an idea or a challenge? Let&rsquo;s talk about it.</p>

        <div className="contact-cards">
          <article className="contact-card">
            <div className="contact-card-icon">
              <MailIcon />
            </div>
            <h3>Email us</h3>
            <p className="contact-card-text">Questions, project ideas or just a hello &mdash; drop us a line.</p>
            <a href={`mailto:${email}`} className="contact-card-value">
              {email}
            </a>
            <a href={`mailto:${email}`} className="btn btn-primary contact-card-btn">
              Send an email <ArrowIcon />
            </a>
          </article>

          <article className="contact-card">
            <div className="contact-card-icon">
              <PinIcon />
            </div>
            <h3>Visit us</h3>
            <p className="contact-card-text">Find us at our home base in the heart of Saxony.</p>
            <address className="contact-card-value">
              {address.street}
              <br />
              {address.postal_code} {address.city}
              <br />
              {address.country}
            </address>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary contact-card-btn">
              Open in Maps <ArrowIcon />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
