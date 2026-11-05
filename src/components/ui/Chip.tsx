import { cn } from '../../lib/cn';

/** Small monospace tag ("AI strategy", "GDPR"...). Renders an <li>, so wrap chips in a <ul>. */
export default function Chip({ children, className }: { children: string; className?: string }) {
  return (
    <li
      className={cn(
        'rounded border border-line-strong bg-chip px-2.5 py-1 font-mono text-xs text-chip-fg dark:border-cyan/22',
        className,
      )}
    >
      {children}
    </li>
  );
}
