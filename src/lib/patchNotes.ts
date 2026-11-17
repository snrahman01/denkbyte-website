/**
 * Patch notes: the rules shared by the admin form (browser) and the API (netlify/functions/patch-notes.mts),
 * so both sides always agree on what a valid note is.
 */
import type { PatchNote } from '../types';

/** Options of the category dropdown. Add one here and it appears in the form and is accepted by the API. */
export const CATEGORIES = [
  'Pitch',
  'Website',
  'Product',
  'Launch',
  'Brand',
  'Team',
  'Social media',
  'Business',
  'Event',
] as const;

export const LIMITS = {
  title: 100,
  change: 220,
  maxChanges: 10,
};

/** What the form sends to the API */
export interface PatchNoteInput {
  version: string;
  date: string;
  tag: string;
  title: string;
  changes: string[];
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const VERSION = /^\d{1,3}(\.\d{1,3}){0,2}$/;

type Result = { ok: true; value: PatchNoteInput } | { ok: false; error: string };

/** Checks and cleans a note (trims text, drops empty points). Never trust the browser: the API runs this too. */
export function validatePatchNote(raw: unknown): Result {
  if (typeof raw !== 'object' || raw === null) return { ok: false, error: 'Invalid data.' };
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

  const date = str(r.date);
  if (!DATE.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00Z`))) {
    return { ok: false, error: 'Please pick a valid date.' };
  }

  const version = str(r.version).replace(/^v/i, '');
  if (!VERSION.test(version)) return { ok: false, error: 'Version must look like 1.2 (numbers and dots).' };

  const tag = str(r.tag);
  if (!(CATEGORIES as readonly string[]).includes(tag))
    return { ok: false, error: 'Please choose a category.' };

  const title = str(r.title);
  if (!title) return { ok: false, error: 'Please add a heading.' };
  if (title.length > LIMITS.title) return { ok: false, error: `Heading: max. ${LIMITS.title} characters.` };

  const changes = (Array.isArray(r.changes) ? r.changes : []).map(str).filter(Boolean);
  if (changes.length === 0) return { ok: false, error: 'Please add at least one point.' };
  if (changes.length > LIMITS.maxChanges) return { ok: false, error: `Max. ${LIMITS.maxChanges} points.` };
  if (changes.some((c) => c.length > LIMITS.change)) {
    return { ok: false, error: `Each point: max. ${LIMITS.change} characters.` };
  }

  return { ok: true, value: { version, date, tag, title, changes } };
}

/** "1.10" > "1.9" > "0.4" */
export function compareVersions(a: string, b: string) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/** Suggested version for a new note: the highest existing one, plus one in the last place (1.1 -> 1.2). */
export function nextVersion(notes: Pick<PatchNote, 'version'>[]) {
  if (notes.length === 0) return '1.0';
  const highest = notes
    .map((n) => n.version)
    .sort(compareVersions)
    .pop() as string;
  const parts = highest.split('.').map(Number);
  if (parts.length === 1) parts.push(0);
  parts[parts.length - 1] += 1;
  return parts.join('.');
}

/** Newest first (by date, then by version) */
export function sortPatchNotes<T extends Pick<PatchNote, 'date' | 'version'>>(notes: T[]) {
  return [...notes].sort((a, b) => b.date.localeCompare(a.date) || compareVersions(b.version, a.version));
}

/** A blank note for the admin form: today's date and the suggested next version */
export const emptyPatchNote = (version: string): PatchNoteInput => ({
  version,
  date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD in the local time zone
  tag: '',
  title: '',
  changes: [''],
});
