import type { PatchNote } from '../../types';
import { usePatchNotes } from '../../hooks/usePatchNotes';
import { cn } from '../../lib/cn';
import Reveal from '../Reveal';

/** "4 Nov 2026" */
const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** One patch note: version badge, date, category, heading, points. Also used as the live preview on /admin. */
export function PatchNoteCard({ note }: { note: PatchNote }) {
  return (
    <>
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
      <h3 className="mb-3 text-xl leading-snug font-bold tracking-tight wrap-anywhere text-heading">
        {note.title}
      </h3>
      <ul className="max-w-2xl space-y-1.5">
        {note.changes.map((change, i) => (
          <li key={`${i}-${change}`} className="flex gap-2.5 leading-[1.7] wrap-anywhere text-muted">
            <span aria-hidden="true" className="font-mono font-bold text-secondary">
              +
            </span>
            <span>{change}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Timeline of patch notes (newest first). `limit` shows only the latest few. */
export default function PatchNoteList({ limit }: { limit?: number }) {
  const notes = usePatchNotes();

  return (
    <ol className="relative border-l-2 border-line pl-6 sm:pl-8">
      {notes.slice(0, limit).map((note, i) => (
        <li key={note.id ?? note.version} className="relative pb-10 last:pb-0">
          {/* dot on the timeline; the newest one glows */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-1.5 rounded-full border-page',
              i === 0
                ? '-left-[33px] size-4 border-3 bg-secondary shadow-[0_0_0_4px_rgb(232_115_12/0.2)] sm:-left-[41px]'
                : '-left-[31px] size-3 border-2 bg-line-strong sm:-left-[39px]',
            )}
          />
          <Reveal delay={Math.min(i, 3) * 100}>
            <PatchNoteCard note={note} />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
