import { useEffect, useState } from 'react';
import type { PatchNote } from '../../types';
import { emptyPatchNote, nextVersion, type PatchNoteInput } from '../../lib/patchNotes';
import {
  ApiError,
  createPatchNote,
  deletePatchNote,
  fetchPatchNotes,
  updatePatchNote,
} from '../../lib/patchNotesApi';
import NoteForm from './NoteForm';
import { errorBox, okBox, panel, smallButton } from './styles';

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** List of all patch notes + the form to add or edit one */
export default function PatchNotesEditor({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [notes, setNotes] = useState<PatchNote[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<PatchNote | null>(null);
  const [formKey, setFormKey] = useState(0); // remounts the form to reset it
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchPatchNotes()
      .then(setNotes)
      .catch((err: unknown) =>
        setLoadError(
          err instanceof ApiError && err.status === 404
            ? 'The patch notes API is not running here. It works on the deployed site and deploy previews (or with `netlify dev`).'
            : err instanceof Error
              ? err.message
              : 'Could not load the patch notes.',
        ),
      );
  }, []);

  const resetForm = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
  };

  /** Runs an API call and shows the result; returns true on success */
  const run = async (action: () => Promise<PatchNote[]>, success: string) => {
    setBusy(true);
    setMessage(null);
    try {
      setNotes(await action());
      setMessage({ ok: true, text: success });
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired();
        return false;
      }
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'Something went wrong.' });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = async (input: PatchNoteInput) => {
    const ok = editing?.id
      ? await run(
          () => updatePatchNote(editing.id!, input),
          `v${input.version} updated. It is live on /patch-notes.`,
        )
      : await run(() => createPatchNote(input), `v${input.version} published. It is live on /patch-notes.`);
    if (ok) {
      resetForm();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return ok;
  };

  const remove = async (note: PatchNote) => {
    if (!note.id || !window.confirm(`Delete v${note.version} "${note.title}"? This cannot be undone.`))
      return;
    if ((await run(() => deletePatchNote(note.id!), `v${note.version} deleted.`)) && editing?.id === note.id)
      resetForm();
  };

  const edit = (note: PatchNote) => {
    setEditing(note);
    setFormKey((k) => k + 1);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadError) {
    return (
      <p role="alert" className={errorBox}>
        {loadError}
      </p>
    );
  }
  if (!notes) return <p className="text-muted">Loading patch notes…</p>;

  const initial: PatchNoteInput = editing
    ? {
        version: editing.version,
        date: editing.date,
        tag: editing.tag ?? '',
        title: editing.title,
        changes: editing.changes.length ? editing.changes : [''],
      }
    : emptyPatchNote(nextVersion(notes));

  return (
    <div className="space-y-8">
      {message && (
        <p role="status" className={message.ok ? okBox : errorBox}>
          {message.text}
        </p>
      )}

      <NoteForm
        key={formKey}
        initial={initial}
        editing={Boolean(editing)}
        busy={busy}
        onSubmit={save}
        onCancel={resetForm}
      />

      <section aria-labelledby="all-notes">
        <h2 id="all-notes" className="mb-4 text-lg font-bold text-heading">
          All patch notes <span className="font-normal text-muted">({notes.length})</span>
        </h2>
        <ul className={`${panel} divide-y divide-line`}>
          {notes.map((note) => (
            <li key={note.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-7">
              <div className="min-w-0 flex-1">
                <p className="mb-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs">
                  <span className="rounded bg-brand px-1.5 py-0.5 font-extrabold text-dark">
                    v{note.version}
                  </span>
                  <span className="font-bold text-accent-text">{formatDate(note.date)}</span>
                  {note.tag && <span className="text-muted">{note.tag}</span>}
                </p>
                <p className="truncate font-semibold text-heading">{note.title}</p>
              </div>
              <div className="flex flex-none gap-2">
                <button type="button" className={smallButton} onClick={() => edit(note)} disabled={busy}>
                  Edit
                </button>
                <button
                  type="button"
                  className={`${smallButton} hover:border-err hover:text-err`}
                  onClick={() => remove(note)}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
