import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * White (dark mode: ink) card with the brand bar on top that grows on hover, and an optional
 * small index number ("01") in the corner. Used by the focus, service and vision cards.
 */
export default function Card({
  children,
  index,
  className,
  barWidth = 'before:w-12',
}: {
  children: ReactNode;
  index?: string;
  className?: string;
  barWidth?: string;
}) {
  return (
    <article
      className={cn(
        'group relative flex flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface',
        'transition duration-300 hover:-translate-y-1.5 hover:border-secondary/35 hover:shadow-xl',
        'dark:hover:border-accent/50 dark:hover:shadow-[0_16px_36px_rgb(0_0_0/0.55),0_0_0_1px_rgb(245_166_35/0.3),0_14px_44px_rgb(245_166_35/0.12)]',
        // brand bar
        'before:absolute before:top-0 before:left-0 before:h-1 before:bg-bar before:transition-[width] before:duration-300 hover:before:w-full',
        barWidth,
        className,
      )}
    >
      {index && (
        <span aria-hidden="true" className="absolute top-4 right-6 font-mono text-sm font-bold text-index">
          {index}
        </span>
      )}
      {children}
    </article>
  );
}
