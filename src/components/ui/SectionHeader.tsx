import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import Reveal from '../Reveal';

/** Section title block: "// eyebrow", big heading and an optional subtitle. */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  onDark = false,
  as: Heading = 'h2',
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Use on the dark bands (team) */
  onDark?: boolean;
  /** h1 on a page's main section, h2 everywhere else */
  as?: 'h1' | 'h2';
}) {
  return (
    <Reveal className="mb-10 md:mb-12">
      <p
        className={cn(
          'mb-2 font-mono text-sm font-bold tracking-wide',
          onDark ? 'text-accent' : 'text-accent-text',
        )}
      >
        {eyebrow}
      </p>
      <Heading
        className={cn(
          'text-[clamp(2rem,4vw,2.75rem)] leading-tight font-extrabold tracking-tight text-balance',
          onDark ? 'text-white' : 'text-heading',
        )}
      >
        {title}
      </Heading>
      {subtitle && <p className={cn('mt-3 text-lg', onDark ? 'text-white/70' : 'text-muted')}>{subtitle}</p>}
    </Reveal>
  );
}
