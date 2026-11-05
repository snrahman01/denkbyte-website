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
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-transparent px-4 py-2.5 font-mono text-[0.8rem] font-bold whitespace-nowrap text-white transition-colors duration-150 hover:border-white/50 hover:bg-white/12"
    >
      {copied ? <CheckIcon size={16} strokeWidth={2.4} /> : <CopyIcon size={16} strokeWidth={2} />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
