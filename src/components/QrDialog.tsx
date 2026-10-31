import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import CopyButton from './CopyButton';
import Modal from './Modal';
import { ArrowRightIcon } from './icons';
import type { QrItem } from '../utils/qr';
import { bareUrl } from '../utils/url';

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
        <div className="qr-tabs" role="tablist" aria-label="Choose a profile" onKeyDown={onTabKeyDown}>
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
              className="qr-tab"
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
        <div className="qr-frame">
          <img
            key={item.qr}
            className="qr-img"
            src={item.qr}
            alt={`QR code for the DenkByte ${item.name} profile`}
          />
        </div>

        <p className="qr-hint">Point your phone&rsquo;s camera at the code</p>

        <a className="qr-url" href={item.url} target="_blank" rel="noopener noreferrer">
          {bareUrl(item.url)}
        </a>

        <div className="qr-actions">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
            Open {item.name} <ArrowRightIcon size={16} strokeWidth={2} />
          </a>
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
    <Modal open={open} onClose={onClose} title="Scan to follow us" className="qr-dialog">
      <QrTabs items={items} />
    </Modal>,
    document.body,
  );
}
