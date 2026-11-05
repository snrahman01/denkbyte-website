import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Centred page column with the site's side gutters. */
export default function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-300 px-5 sm:px-6 lg:px-8', className)}>{children}</div>;
}
