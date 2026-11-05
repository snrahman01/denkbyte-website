import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Rounded square holding an icon. `tone="light"` for light surfaces, "dark" for the dark bands. */
export default function IconTile({
  children,
  tone = 'light',
  className,
}: {
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex size-14 flex-none items-center justify-center rounded-2xl',
        tone === 'light'
          ? 'bg-tint text-secondary dark:text-cyan dark:shadow-[inset_0_0_0_1px_rgb(34_211_238/0.16)]'
          : 'bg-secondary/18 text-accent',
        className,
      )}
    >
      {children}
    </div>
  );
}
