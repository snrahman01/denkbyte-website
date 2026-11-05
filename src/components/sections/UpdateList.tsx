import { updates } from '../../data';
import Reveal from '../Reveal';

/** "5 Nov 2026" */
const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** Timeline of status updates from updates.json (newest first). `limit` shows only the latest few. */
export default function UpdateList({ limit }: { limit?: number }) {
  return (
    <ol className="relative border-l-2 border-line pl-6 sm:pl-8">
      {updates.slice(0, limit).map((u, i) => (
        <li key={`${u.date}-${u.title}`} className="relative pb-10 last:pb-0">
          {/* dot on the timeline; the newest one glows */}
          <span
            aria-hidden="true"
            className={
              i === 0
                ? 'absolute top-1.5 -left-[33px] size-4 rounded-full border-3 border-page bg-secondary shadow-[0_0_0_4px_rgb(232_115_12/0.2)] sm:-left-[41px]'
                : 'absolute top-1.5 -left-[31px] size-3 rounded-full border-2 border-page bg-line-strong sm:-left-[39px]'
            }
          />
          <Reveal delay={Math.min(i, 3) * 100}>
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <time dateTime={u.date} className="font-mono text-sm font-bold text-accent-text">
                {formatDate(u.date)}
              </time>
              {u.tag && (
                <span className="rounded-full border border-line-strong bg-chip px-2.5 py-0.5 font-mono text-xs text-chip-fg">
                  {u.tag}
                </span>
              )}
            </div>
            <h3 className="mb-2 text-xl leading-snug font-bold tracking-tight text-heading">{u.title}</h3>
            <p className="max-w-2xl leading-[1.7] text-muted">{u.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
