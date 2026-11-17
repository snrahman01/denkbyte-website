import { useEffect, useState } from 'react';
import { patchNotes as bundled } from '../data';
import { fetchPatchNotes } from '../lib/patchNotesApi';

/**
 * Patch notes for the public pages: shows the notes that ship with the site right away, then swaps in the
 * live list from the API. If the API can't be reached (e.g. `npm run dev`), the shipped notes simply stay.
 */
export function usePatchNotes() {
  const [notes, setNotes] = useState(bundled);

  useEffect(() => {
    let active = true;
    fetchPatchNotes()
      .then((live) => active && setNotes(live))
      .catch(() => {
        /* keep the shipped notes */
      });
    return () => {
      active = false;
    };
  }, []);

  return notes;
}
