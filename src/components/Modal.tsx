import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Extra classes for the dialog box */
  className?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Accessible dialog: Escape closes, focus stays inside, background doesn't scroll. */
export default function Modal({ open, title, onClose, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden'; // no background scrolling behind the dialog

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      // Keep keyboard focus inside the dialog
      if (e.key === 'Tab' && dialog) {
        const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      opener?.focus(); // hand focus back to whatever opened the dialog
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex animate-fade-in items-center justify-center bg-black/50 p-4 dark:bg-[#02040a]/72"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative max-h-[90dvh] w-full max-w-175 animate-slide-up overflow-y-auto rounded-xl bg-surface p-8 dark:border dark:border-line-strong dark:shadow-[0_30px_80px_rgb(0_0_0/0.6)]',
          className,
        )}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-lg text-3xl leading-none font-bold text-current opacity-60 hover:opacity-100"
        >
          &times;
        </button>
        <h2 id={titleId} className="mb-5 pr-10 text-[1.35rem] font-bold tracking-tight">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
