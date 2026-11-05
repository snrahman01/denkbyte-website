import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import Container from './Container';

/** Page section with consistent vertical spacing. Add backgrounds via `className`. */
export default function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('relative isolate py-16 md:py-24', className)}>
      <Container>{children}</Container>
    </section>
  );
}
