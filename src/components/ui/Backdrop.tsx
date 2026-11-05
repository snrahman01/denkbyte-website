import { cn } from '../../lib/cn';

type Fade = 'top' | 'top-left' | 'top-right' | 'center' | 'hero';

// Where the pattern stays visible before fading out
const masks: Record<Fade, string> = {
  top: 'mask-b-from-0% mask-b-to-70%',
  'top-left': '[mask-image:radial-gradient(ellipse_80%_90%_at_0%_0%,#000_10%,transparent_75%)]',
  'top-right': '[mask-image:radial-gradient(ellipse_80%_70%_at_100%_0%,#000,transparent_75%)]',
  center: '[mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_20%,transparent_75%)]',
  hero: '[mask-image:radial-gradient(ellipse_80%_90%_at_70%_35%,#000_20%,transparent_75%)]',
};

/**
 * Decorative background pattern for a section: the "pixel grid" or a dot grid, fading out.
 * Put it inside a `relative isolate` parent.
 */
export default function Backdrop({
  pattern = 'grid',
  fade = 'top',
  className,
}: {
  pattern?: 'grid' | 'dots';
  fade?: Fade;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10',
        pattern === 'grid' ? 'bg-grid' : 'bg-dots',
        masks[fade],
        className,
      )}
    />
  );
}

/** Warm orange glow blob. Position it with classes, e.g. "-right-36 -top-44 size-155". */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -z-10 rounded-full bg-[radial-gradient(circle,rgb(232_115_12/0.32)_0%,transparent_68%)]',
        className,
      )}
    />
  );
}
