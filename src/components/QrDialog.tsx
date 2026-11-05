import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import CopyButton from './CopyButton';
import Modal from './Modal';
import Button from './ui/Button';
import { cn } from '../lib/cn';
import { ArrowRightIcon } from './icons';
import type { QrItem } from '../utils/qr';
import { bareUrl } from '../utils/url';

/** Orange viewfinder corners around the QR code */
function Corners() {
  const corner = 'absolute size-6 border-accent';
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -inset-2">
      <span className={cn(corner, 'top-0 left-0 border-t-3 border-l-3')} />
      <span className={cn(corner, 'top-0 right-0 border-t-3 border-r-3')} />
      <span className={cn(corner, 'bottom-0 left-0 border-b-3 border-l-3')} />
      <span className={cn(corner, 'right-0 bottom-0 border-r-3 border-b-3')} />
    </span>
  );
}

function QrTabs({ items }: { items: QrItem[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = items[active];

  // Arrow keys / Home / End move between tabs (WAI-ARIA tabs pattern)
  const onTabKeyDown = (e: KeyboardEvent) => {
    const last = items.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? active === last
          ? 0
          : active + 1
        : e.key === 'ArrowLeft'
          ? active === 0
            ? last
            : active - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      {items.length > 1 && (
        <div
          role="tablist"
          aria-label="Choose a profile"
          onKeyDown={onTabKeyDown}
          className="mb-5 flex gap-1 rounded-lg border border-white/12 bg-ink/55 p-1"
        >
          {items.map((it, i) => (
            <button
              key={it.name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-2 rounded-[5px] px-3 py-2.5 text-[0.9rem] font-bold transition-colors duration-150 focus-visible:outline-offset-2',
                i === active ? 'bg-brand text-dark' : 'text-white/72 hover:bg-white/8 hover:text-white',
              )}
              onClick={() => setActive(i)}
            >
              {it.icon}
              {it.name}
            </button>
          ))}
        </div>
      )}

      <div
        role={items.length > 1 ? 'tabpanel' : undefined}
        id={`${baseId}-panel`}
        aria-labelledby={items.length > 1 ? `${baseId}-tab-${active}` : undefined}
      >
        {/* Always on white: a QR code needs light/dark contrast to scan, whatever the site theme is */}
        <div className="relative mx-auto mb-5 flex aspect-[1114/1280] w-[min(100%,270px,36vh)] items-center justify-center rounded-[18px] bg-white p-2.5 shadow-[0_18px_40px_rgb(0_0_0/0.35)]">
          <Corners />
          <img
            key={item.qr}
            className="block size-full object-contain"
            src={item.qr}
            alt={`QR code for the DenkByte ${item.name} profile`}
          />
        </div>

        <p className="mb-3 text-sm leading-normal text-white/72">
          Point your phone&rsquo;s camera at the code
        </p>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5 block rounded-lg border border-white/12 bg-ink/55 px-3 py-2 font-mono text-[0.8rem] wrap-anywhere text-accent no-underline hover:border-accent"
        >
          {bareUrl(item.url)}
        </a>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button href={item.url}>
            Open {item.name} <ArrowRightIcon size={16} strokeWidth={2} />
          </Button>
          <CopyButton text={item.url} label={`Copy ${item.name} link`} />
        </div>
      </div>
    </>
  );
}

/**
 * Dialog that shows the QR codes of our profiles. The images are only mounted while it is open,
 * so nothing is downloaded until someone asks for it.
 */
export default function QrDialog({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: QrItem[];
}) {
  // Portal: the dialog is position:fixed and must not live inside the section's stacking context
  // (it would end up below the sticky navbar).
  return createPortal(
    <Modal
      open={open}
      onClose={onClose}
      title="Scan to follow us"
      className="max-h-[94dvh] max-w-100 border border-white/14 bg-band px-6 pt-7 pb-6 text-center text-white shadow-[0_30px_80px_rgb(0_0_0/0.55)]"
    >
      <QrTabs items={items} />
    </Modal>,
    document.body,
  );
}
