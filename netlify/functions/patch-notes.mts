/**
 * Patch notes API  ->  /.netlify/functions/patch-notes
 *
 *   GET                 public: all notes, newest first
 *   POST                logged-in team member: add a note
 *   PUT    ?id=<id>     logged-in team member: change a note
 *   DELETE ?id=<id>     logged-in team member: delete a note
 *
 * Storage: Netlify Blobs (one JSON list). Login: Netlify Identity (invite-only, see README).
 * Until the first save, the list is seeded from src/data/patch-notes.json.
 * Deploy previews use a separate store, so testing a PR never changes the live notes.
 */
import { getStore, type Store } from '@netlify/blobs';
import { getUser, verifyRequestOrigin } from '@netlify/identity';
import type { Context } from '@netlify/functions';
import seed from '../../src/data/patch-notes.json';
import { sortPatchNotes, validatePatchNote, type PatchNoteInput } from '../../src/lib/patchNotes';

interface StoredNote extends PatchNoteInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** Email of the team member who last saved it (never sent to the public) */
  updatedBy: string;
}

const KEY = 'notes';
const MAX_BODY_BYTES = 10_000;

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function storeFor(context: Context) {
  const live = context.deploy?.context === 'production';
  return getStore({ name: live ? 'patch-notes' : 'patch-notes-preview', consistency: 'strong' });
}

async function load(store: Store): Promise<StoredNote[]> {
  const saved = (await store.get(KEY, { type: 'json' })) as StoredNote[] | null;
  if (Array.isArray(saved)) return saved;
  // Nothing saved yet: start from the notes that ship with the site (stable ids so they can be edited)
  return seed.map((n) => ({
    version: n.version,
    date: n.date,
    tag: n.tag ?? 'Website',
    title: n.title,
    changes: n.changes,
    id: `seed-${n.version}`,
    createdAt: `${n.date}T12:00:00.000Z`,
    updatedAt: `${n.date}T12:00:00.000Z`,
    updatedBy: '',
  }));
}

const toPublic = (notes: StoredNote[]) =>
  sortPatchNotes(notes).map(({ id, version, date, tag, title, changes }) => ({
    id,
    version,
    date,
    tag,
    title,
    changes,
  }));

async function readBody(req: Request) {
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return { error: 'Request too large.' };
  try {
    return { data: JSON.parse(text) as unknown };
  } catch {
    return { error: 'Invalid JSON.' };
  }
}

export default async (req: Request, context: Context) => {
  const store = storeFor(context);

  if (req.method === 'GET') return json({ notes: toPublic(await load(store)) });

  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) return json({ error: 'Method not allowed.' }, 405);

  // Changes only from our own site (CSRF protection) and only by a logged-in team member
  try {
    verifyRequestOrigin(req);
  } catch {
    return json({ error: 'Forbidden.' }, 403);
  }
  const user = await getUser();
  if (!user?.email) return json({ error: 'Please log in again.' }, 401);

  const notes = await load(store);
  const id = new URL(req.url).searchParams.get('id');
  const now = new Date().toISOString();

  if (req.method === 'DELETE') {
    const rest = notes.filter((n) => n.id !== id);
    if (rest.length === notes.length) return json({ error: 'Note not found.' }, 404);
    await store.setJSON(KEY, rest);
    return json({ notes: toPublic(rest) });
  }

  const body = await readBody(req);
  if ('error' in body) return json({ error: body.error }, 400);
  const result = validatePatchNote(body.data);
  if (!result.ok) return json({ error: result.error }, 400);
  const input = result.value;

  if (req.method === 'POST') {
    if (notes.some((n) => n.version === input.version)) {
      return json({ error: `Version ${input.version} already exists.` }, 409);
    }
    const note: StoredNote = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      updatedBy: user.email,
    };
    const next = [...notes, note];
    await store.setJSON(KEY, next);
    return json({ notes: toPublic(next) }, 201);
  }

  // PUT
  const existing = notes.find((n) => n.id === id);
  if (!existing) return json({ error: 'Note not found.' }, 404);
  if (notes.some((n) => n.id !== id && n.version === input.version)) {
    return json({ error: `Version ${input.version} already exists.` }, 409);
  }
  const next = notes.map((n) =>
    n.id === id ? { ...existing, ...input, updatedAt: now, updatedBy: user.email! } : n,
  );
  await store.setJSON(KEY, next);
  return json({ notes: toPublic(next) });
};
