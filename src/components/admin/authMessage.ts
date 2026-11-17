import { AuthError, MissingIdentityError } from '@netlify/identity';

const UNAVAILABLE =
  'Login is not available here. Netlify Identity only runs on the deployed site (or with `netlify dev`).';

/** Turns library errors into something a team member can act on */
export function authMessage(err: unknown, fallback: string) {
  if (err instanceof MissingIdentityError || (err instanceof AuthError && err.status === 404)) {
    return UNAVAILABLE;
  }
  if (err instanceof AuthError) {
    if (err.status === 401 || err.status === 400 || /invalid_grant/i.test(err.message)) return fallback;
    if (err.status === 422) return 'Please check your input (e.g. a password of at least 8 characters).';
  }
  return err instanceof Error && err.message ? `${fallback} (${err.message})` : fallback;
}
