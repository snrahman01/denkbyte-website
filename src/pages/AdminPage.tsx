import { useEffect, useState } from 'react';
import { AUTH_EVENTS, getUser, handleAuthCallback, logout, onAuthChange, type User } from '@netlify/identity';
import { Link } from 'react-router';
import { AcceptInviteForm, LoginForm, NewPasswordForm } from '../components/admin/AuthForms';
import { authMessage } from '../components/admin/authMessage';
import PatchNotesEditor from '../components/admin/PatchNotesEditor';
import { errorBox, smallButton } from '../components/admin/styles';
import Logo from '../components/Logo';
import PageTitle from '../components/PageTitle';
import ThemeToggle from '../components/ThemeToggle';
import Container from '../components/ui/Container';

type View =
  | { kind: 'loading' }
  | { kind: 'login'; notice?: string }
  | { kind: 'invite'; token: string }
  | { kind: 'recovery' }
  | { kind: 'editor'; user: User };

/**
 * /admin: team-only area to manage the patch notes. Not linked anywhere on the site and hidden from search
 * engines; access is protected by Netlify Identity (invite-only accounts) and checked again by the API.
 * Links from Identity emails (invite, password reset) are redirected here by src/main.tsx.
 */
export default function AdminPage() {
  const [view, setView] = useState<View>({ kind: 'loading' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await handleAuthCallback(); // invite / password-reset link?
        if (!active) return;
        if (result?.type === 'invite' && result.token)
          return setView({ kind: 'invite', token: result.token });
        if (result?.type === 'recovery') return setView({ kind: 'recovery' });
        const user = result?.user ?? (await getUser());
        if (active) setView(user ? { kind: 'editor', user } : { kind: 'login' });
      } catch (err) {
        if (!active) return;
        setError(authMessage(err, 'This link is invalid or has expired.'));
        setView({ kind: 'login' });
      }
    })();
    // Logged out in another tab -> back to the login form
    const unsubscribe = onAuthChange((event) => {
      if (event === AUTH_EVENTS.LOGOUT) setView({ kind: 'login' });
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await logout().catch(() => undefined);
    setView({ kind: 'login', notice: 'You are logged out.' });
  };

  const loggedIn = (user: User) => {
    setError(null);
    setView({ kind: 'editor', user });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-page-alt">
      <PageTitle title="Admin" />
      <meta name="robots" content="noindex, nofollow" />

      <header className="border-b border-line bg-nav backdrop-blur-md">
        <Container className="flex h-18 items-center gap-3">
          <Logo />
          <span className="hidden rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-xs font-bold text-muted sm:inline">
            admin
          </span>
          <div className="ml-auto flex items-center gap-2">
            {view.kind === 'editor' && (
              <button type="button" onClick={signOut} className={smallButton}>
                Log out
              </button>
            )}
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <main id="main" className="flex-1 py-10 sm:py-14">
        <Container>
          {view.kind === 'editor' && (
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1 font-mono text-sm font-bold text-accent-text">// patch notes</p>
                <h1 className="text-[clamp(1.8rem,3.5vw,2.4rem)] leading-tight font-extrabold tracking-tight text-heading">
                  Patch notes editor
                </h1>
                <p className="mt-1 text-sm text-muted">
                  Logged in as <strong className="text-heading">{view.user.email}</strong>
                </p>
              </div>
              <Link
                to="/patch-notes"
                target="_blank"
                className="text-sm font-semibold text-accent-text hover:underline"
              >
                View public page ↗
              </Link>
            </div>
          )}

          {error && view.kind === 'login' && (
            <p role="alert" className={`${errorBox} mx-auto mb-6 max-w-md`}>
              {error}
            </p>
          )}

          {view.kind === 'loading' && <p className="text-center text-muted">Loading…</p>}
          {view.kind === 'login' && <LoginForm onLogin={loggedIn} notice={view.notice} />}
          {view.kind === 'invite' && <AcceptInviteForm token={view.token} onDone={loggedIn} />}
          {view.kind === 'recovery' && <NewPasswordForm onDone={loggedIn} />}
          {view.kind === 'editor' && (
            <PatchNotesEditor
              onSessionExpired={() =>
                setView({ kind: 'login', notice: 'Your session expired. Please log in again.' })
              }
            />
          )}
        </Container>
      </main>
    </div>
  );
}
