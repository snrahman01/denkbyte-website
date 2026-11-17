import type { PatchNote } from '../types';
import type { PatchNoteInput } from './patchNotes';

/** The patch notes API (netlify/functions/patch-notes.mts). Login travels in Netlify Identity's cookie. */
const URL = '/.netlify/functions/patch-notes';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function call(method: string, id?: string, body?: PatchNoteInput): Promise<PatchNote[]> {
  let res: Response;
  try {
    res = await fetch(id ? `${URL}?id=${encodeURIComponent(id)}` : URL, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection.', 0);
  }
  const data = (await res.json().catch(() => null)) as { notes?: PatchNote[]; error?: string } | null;
  if (!res.ok || !data?.notes) {
    throw new ApiError(data?.error ?? `The server answered with an error (${res.status}).`, res.status);
  }
  return data.notes;
}

export const fetchPatchNotes = () => call('GET');
export const createPatchNote = (note: PatchNoteInput) => call('POST', undefined, note);
export const updatePatchNote = (id: string, note: PatchNoteInput) => call('PUT', id, note);
export const deletePatchNote = (id: string) => call('DELETE', id);
