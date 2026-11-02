import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

/** Fades/slides its children in when scrolled into view (styles: `.reveal` in styles.css). */
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={`reveal${inView ? ' in-view' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
