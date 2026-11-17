import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { CATEGORIES, LIMITS, validatePatchNote, type PatchNoteInput } from '../../lib/patchNotes';
import { PatchNoteCard } from '../sections/PatchNoteList';
import Button from '../ui/Button';
import { card, errorBox, hint, input, label, smallButton } from './styles';

interface NoteFormProps {
  initial: PatchNoteInput;
  /** Editing an existing note (changes the heading and button text) */
  editing: boolean;
  busy: boolean;
  onSubmit: (note: PatchNoteInput) => Promise<boolean>;
  onCancel: () => void;
}

/** Date, category, version, heading and points, with a live preview of how the note will look */
export default function NoteForm({ initial, editing, busy, onSubmit, onCancel }: NoteFormProps) {
  const [note, setNote] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const pointRefs = useRef<(HTMLInputElement | null)[]>([]);

  const set = <K extends keyof PatchNoteInput>(key: K, value: PatchNoteInput[K]) =>
    setNote((n) => ({ ...n, [key]: value }));

  const setPoint = (i: number, value: string) =>
    set(
      'changes',
      note.changes.map((c, j) => (j === i ? value : c)),
    );

  const addPoint = (after = note.changes.length - 1) => {
    if (note.changes.length >= LIMITS.maxChanges) return;
    const changes = [...note.changes];
    changes.splice(after + 1, 0, '');
    set('changes', changes);
    requestAnimationFrame(() => pointRefs.current[after + 1]?.focus());
  };

  const removePoint = (i: number) => {
    const changes = note.changes.filter((_, j) => j !== i);
    set('changes', changes.length ? changes : ['']);
    requestAnimationFrame(() => pointRefs.current[Math.max(0, i - 1)]?.focus());
  };

  // Enter in a point adds the next point; Backspace in an empty point removes it
  const onPointKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPoint(i);
    } else if (e.key === 'Backspace' && note.changes[i] === '' && note.changes.length > 1) {
      e.preventDefault();
      removePoint(i);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const result = validatePatchNote(note);
    if (!result.ok) return setError(result.error);
    setError(null);
    await onSubmit(result.value);
  };

  const preview = { ...note, changes: note.changes.filter((c) => c.trim()) };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <form onSubmit={submit} className={`${card} space-y-5`}>
        <h2 className="text-lg font-bold text-heading">
          {editing ? `Edit v${initial.version}` : 'New patch note'}
        </h2>

        {error && (
          <p role="alert" className={errorBox}>
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="note-date" className={label}>
              Date
            </label>
            <input
              id="note-date"
              type="date"
              required
              className={input}
              value={note.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="note-tag" className={label}>
              Category
            </label>
            <select
              id="note-tag"
              required
              className={input}
              value={note.tag}
              onChange={(e) => set('tag', e.target.value)}
            >
              <option value="" disabled>
                Choose…
              </option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="note-version" className={label}>
              Version
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-mono text-muted">
                v
              </span>
              <input
                id="note-version"
                inputMode="decimal"
                required
                className={`${input} pl-7 font-mono`}
                value={note.version}
                onChange={(e) => set('version', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="note-title" className={label}>
            Heading
          </label>
          <input
            id="note-title"
            required
            maxLength={LIMITS.title}
            placeholder="e.g. First pitch: 4th place"
            className={input}
            value={note.title}
            onChange={(e) => set('title', e.target.value)}
          />
          <p className={hint}>
            {note.title.length} / {LIMITS.title}
          </p>
        </div>

        <fieldset>
          <legend className={label}>Points</legend>
          <ol className="space-y-2">
            {note.changes.map((change, i) => (
              <li key={i} className="flex items-center gap-2">
                <span aria-hidden="true" className="w-4 font-mono font-bold text-secondary">
                  +
                </span>
                <label htmlFor={`note-point-${i}`} className="sr-only">
                  Point {i + 1}
                </label>
                <input
                  id={`note-point-${i}`}
                  ref={(el) => {
                    pointRefs.current[i] = el;
                  }}
                  maxLength={LIMITS.change}
                  placeholder={i === 0 ? 'What happened? One short line.' : ''}
                  className={input}
                  value={change}
                  onChange={(e) => setPoint(i, e.target.value)}
                  onKeyDown={onPointKey(i)}
                />
                <button
                  type="button"
                  onClick={() => removePoint(i)}
                  aria-label={`Remove point ${i + 1}`}
                  title="Remove"
                  className="flex size-10 flex-none items-center justify-center rounded-lg text-xl leading-none text-muted transition-colors hover:bg-err/10 hover:text-err"
                >
                  &times;
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={smallButton}
              onClick={() => addPoint()}
              disabled={note.changes.length >= LIMITS.maxChanges}
            >
              + Add point
            </button>
            <span className={hint}>Tip: press Enter in a point to add the next one.</span>
          </div>
        </fieldset>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            className={`${smallButton} justify-center py-3`}
            onClick={onCancel}
            disabled={busy}
          >
            {editing ? 'Cancel' : 'Clear'}
          </button>
          <Button type="submit" disabled={busy}>
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Publish note'}
          </Button>
        </div>
      </form>

      {/* Live preview, exactly as on /patch-notes */}
      <aside aria-label="Preview" className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-3 font-mono text-xs font-bold tracking-wider text-muted uppercase">Preview</p>
        <div className={card}>
          <PatchNoteCard
            note={{
              ...preview,
              version: preview.version.replace(/^v/i, '') || '?',
              title: preview.title || 'Your heading',
              tag: preview.tag || undefined,
              changes: preview.changes.length ? preview.changes : ['Your first point'],
            }}
          />
        </div>
      </aside>
    </div>
  );
}
