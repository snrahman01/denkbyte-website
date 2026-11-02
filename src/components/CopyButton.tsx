import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from './icons';

export default function CopyButton({ text, label }: { text: string; label: string }) {
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
      /* clipboard unavailable (e.g. insecure context) - the link next to it still works */
    }
  };

  return (
    <button type="button" className="copy-btn" onClick={copy} aria-label={label}>
      {copied ? <CheckIcon size={16} strokeWidth={2.4} /> : <CopyIcon size={16} strokeWidth={2} />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
