import { patchNotes } from '../../data';
import Reveal from '../Reveal';

/** "4 Nov 2026" */
const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** Timeline of patch notes from patch-notes.json (newest first). `limit` shows only the latest few. */
export default function PatchNoteList({ limit }: { limit?: number }) {
  return (
    <ol className="relative border-l-2 border-line pl-6 sm:pl-8">
      {patchNotes.slice(0, limit).map((note, i) => (
        <li key={note.version} className="relative pb-10 last:pb-0">
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
              <span className="rounded-md bg-brand px-2 py-0.5 font-mono text-xs font-extrabold text-dark">
                v{note.version}
              </span>
              <time dateTime={note.date} className="font-mono text-sm font-bold text-accent-text">
                {formatDate(note.date)}
              </time>
              {note.tag && (
                <span className="rounded-full border border-line-strong bg-chip px-2.5 py-0.5 font-mono text-xs text-chip-fg">
                  {note.tag}
                </span>
              )}
            </div>
            <h3 className="mb-3 text-xl leading-snug font-bold tracking-tight text-heading">{note.title}</h3>
            <ul className="max-w-2xl space-y-1.5">
              {note.changes.map((change) => (
                <li key={change} className="flex gap-2.5 leading-[1.7] text-muted">
                  <span aria-hidden="true" className="font-mono font-bold text-secondary">
                    +
                  </span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
