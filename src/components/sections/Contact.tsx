import { useState, type ReactNode } from 'react';
import { config } from '../../data';
import { preloadQrImages, type QrItem } from '../../utils/qr';
import CopyButton from '../CopyButton';
import QrDialog from '../QrDialog';
import Reveal from '../Reveal';
import Backdrop from '../ui/Backdrop';
import Button from '../ui/Button';
import IconTile from '../ui/IconTile';
import { ArrowRightIcon, FollowIcon, InstagramIcon, LinkedInIcon, MailIcon, PinIcon, QrIcon } from '../icons';

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

/** Code-style box for the email / address value */
const valueBox =
  'mt-auto mb-6 block rounded-lg border border-white/12 bg-ink/55 px-4 py-3 font-mono text-[0.85rem] leading-relaxed not-italic wrap-anywhere text-accent no-underline';

/** Dark contact card with the pixel grid and a growing orange bar */
function ContactCard({
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
    <article className="group relative isolate flex flex-1 flex-col overflow-hidden rounded-xl border border-transparent bg-band px-5 pt-10 pb-6 text-white shadow-[0_20px_44px_rgb(15_24_41/0.28)] transition duration-300 before:absolute before:top-0 before:left-0 before:z-10 before:h-1 before:w-12 before:bg-brand before:transition-[width] before:duration-300 hover:-translate-y-1.5 hover:border-accent/45 hover:shadow-[0_26px_50px_rgb(15_24_41/0.4)] hover:before:w-full sm:px-6 dark:border-line dark:shadow-[0_20px_44px_rgb(0_0_0/0.5)] dark:hover:border-accent/50">
      <Backdrop fade="top-right" className="[--grid-size:36px]" />
      <IconTile tone="dark" className="mb-6">
        {icon}
      </IconTile>
      <h2 className="mb-2 text-xl font-bold tracking-tight">{title}</h2>
      <p className="mb-6 text-sm leading-[1.7] text-white/72">{text}</p>
      {children}
    </article>
  );
}

const actions = 'flex min-h-11.5 flex-wrap items-center gap-2';

export default function ContactCards() {
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
    <>
      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        <Reveal className="flex">
          <ContactCard
            icon={<MailIcon size={28} />}
            title="Email us"
            text="Questions, project ideas or just a hello — drop us a line."
          >
            <a href={`mailto:${email}`} className={`${valueBox} hover:border-accent`}>
              {email}
            </a>
            <div className={actions}>
              <Button href={`mailto:${email}`}>
                Send an email <ArrowRightIcon size={16} strokeWidth={2} />
              </Button>
              <CopyButton text={email} label="Copy email address" />
            </div>
          </ContactCard>
        </Reveal>

        <Reveal delay={120} className="flex">
          <ContactCard
            icon={<FollowIcon size={28} />}
            title="Follow us"
            text="News, projects and behind-the-scenes from the DenkByte team."
          >
            {socials.length > 0 ? (
              <>
                <ul className="mt-auto flex flex-col gap-2.5">
                  {socials.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-3 rounded-lg border border-white/12 bg-ink/55 px-3 py-2.5 text-white no-underline transition duration-150 hover:translate-x-0.5 hover:border-accent hover:bg-accent/8"
                      >
                        <span className="flex size-9 flex-none items-center justify-center rounded-[10px] bg-secondary/18 text-accent transition duration-300 group-hover/link:-rotate-6 group-hover/link:bg-brand group-hover/link:text-dark">
                          {s.icon}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col leading-tight">
                          <span className="text-[0.95rem] font-bold">{s.name}</span>
                          <span className="font-mono text-[0.8rem] wrap-anywhere text-accent">
                            {s.handle}
                          </span>
                        </span>
                        <span className="flex flex-none -rotate-45 text-white/55 transition duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent">
                          <ArrowRightIcon size={16} strokeWidth={2.2} />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                {qrItems.length > 0 && (
                  <div className={`${actions} mt-4`}>
                    <Button
                      aria-haspopup="dialog"
                      onClick={() => setQrOpen(true)}
                      onPointerEnter={() => preloadQrImages(qrItems)}
                      onFocus={() => preloadQrImages(qrItems)}
                    >
                      <QrIcon size={18} strokeWidth={2} /> Show QR code
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className={`${valueBox} border-dashed text-white/60`}>linkedin.com/company/&hellip;</p>
                <div className={actions}>
                  <span
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center rounded-lg border-[1.5px] border-dashed border-white/40 px-5 py-3 text-sm font-bold opacity-55"
                  >
                    Coming soon
                  </span>
                </div>
              </>
            )}
          </ContactCard>
        </Reveal>

        <Reveal delay={240} className="flex">
          <ContactCard
            icon={<PinIcon size={28} />}
            title="Visit us"
            text="Find us on the campus of TU Chemnitz, in the heart of Saxony."
          >
            <address className={valueBox}>
              {address.street}
              <br />
              {address.postal_code} {address.city}, {address.country}
            </address>
            <div className={actions}>
              <Button href={mapsUrl}>
                Open in Maps <ArrowRightIcon size={16} strokeWidth={2} />
              </Button>
            </div>
          </ContactCard>
        </Reveal>
      </div>

      {qrItems.length > 0 && <QrDialog open={qrOpen} onClose={() => setQrOpen(false)} items={qrItems} />}
    </>
  );
}
