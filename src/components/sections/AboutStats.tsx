import { useEffect, useState } from 'react';
import { config, services, team } from '../../data';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../lib/cn';

/** Counts from 0 up to `value` once visible (instantly if the user prefers reduced motion). */
function CountUp({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [shown, setShown] = useState(0);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3)))); // ease-out cubic
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reducedMotion, value]);

  const display = reducedMotion && inView ? value : shown;

  return (
    <span ref={ref}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/** "2026 Founded · 9 Team members · 6 Core services" (About page + homepage). Numbers come from the JSON data. */
export default function AboutStats({ className }: { className?: string }) {
  const stats = [
    { label: 'Founded', value: config.company.founded, count: false },
    { label: 'Team members', value: team.length, count: true },
    { label: 'Core services', value: services.length, count: true },
  ];

  return (
    <dl className={cn('grid grid-cols-1 gap-3 min-[481px]:grid-cols-3 sm:gap-4', className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse gap-1 rounded-r-lg border-l-3 border-secondary bg-surface py-4 pr-4 pl-4.5 shadow-sm dark:border dark:border-l-3 dark:border-line dark:border-l-secondary"
        >
          <dt className="text-xs font-semibold tracking-wider text-muted uppercase">{stat.label}</dt>
          <dd className="font-mono text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-extrabold tracking-tight text-heading">
            {stat.count ? <CountUp value={stat.value} /> : stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
