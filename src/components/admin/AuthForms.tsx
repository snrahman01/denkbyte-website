import { useState, type FormEvent, type ReactNode } from 'react';
import { acceptInvite, login, requestPasswordRecovery, updateUser, type User } from '@netlify/identity';
import Button from '../ui/Button';
import { authMessage } from './authMessage';
import { card, errorBox, hint, input, label, linkButton, okBox } from './styles';

function AuthCard({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className={`${card} mx-auto w-full max-w-md`}>
      <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-heading">{title}</h1>
      <p className="mb-6 text-sm leading-relaxed text-muted">{intro}</p>
      {children}
    </div>
  );
}

const MIN_PASSWORD = 8;

/** New password (+ repeat). Used for invites and password resets. */
function PasswordFields({
  value,
  onChange,
}: {
  value: [string, string];
  onChange: (v: [string, string]) => void;
}) {
  return (
    <>
      <div>
        <label htmlFor="pw-new" className={label}>
          New password
        </label>
        <input
          id="pw-new"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD}
          required
          className={input}
          value={value[0]}
          onChange={(e) => onChange([e.target.value, value[1]])}
        />
        <p className={hint}>At least {MIN_PASSWORD} characters.</p>
      </div>
      <div>
        <label htmlFor="pw-repeat" className={label}>
          Repeat password
        </label>
        <input
          id="pw-repeat"
          type="password"
          autoComplete="new-password"
          required
          className={input}
          value={value[1]}
          onChange={(e) => onChange([value[0], e.target.value])}
        />
      </div>
    </>
  );
}

function checkPasswords([a, b]: [string, string]) {
  if (a.length < MIN_PASSWORD) return `The password needs at least ${MIN_PASSWORD} characters.`;
  if (a !== b) return 'The two passwords are not the same.';
  return null;
}

export function LoginForm({ onLogin, notice }: { onLogin: (user: User) => void; notice?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'login') {
        onLogin(await login(email.trim(), password));
      } else {
        await requestPasswordRecovery(email.trim());
        setSent(true);
      }
    } catch (err) {
      setError(authMessage(err, mode === 'login' ? 'Wrong email or password.' : 'Could not send the email.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard
      title={mode === 'login' ? 'Team login' : 'Reset password'}
      intro={
        mode === 'login'
          ? 'Log in with the account from your DenkByte invite email to manage the patch notes.'
          : 'Enter your email and we will send you a link to set a new password.'
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate={false}>
        {notice && <p className={okBox}>{notice}</p>}
        {error && (
          <p role="alert" className={errorBox}>
            {error}
          </p>
        )}
        {sent && mode === 'forgot' ? (
          <p className={okBox}>
            If an account exists for {email}, a reset link is on its way. Check your inbox.
          </p>
        ) : (
          <>
            <div>
              <label htmlFor="login-email" className={label}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                required
                className={input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {mode === 'login' && (
              <div>
                <label htmlFor="login-password" className={label}>
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Send reset link'}
            </Button>
          </>
        )}
        <p className="text-center text-sm">
          <button
            type="button"
            className={linkButton}
            onClick={() => {
              setMode(mode === 'login' ? 'forgot' : 'login');
              setError(null);
              setSent(false);
            }}
          >
            {mode === 'login' ? 'Forgot your password?' : 'Back to login'}
          </button>
        </p>
      </form>
    </AuthCard>
  );
}

/** Opened from the invite email: the new team member chooses a password */
export function AcceptInviteForm({ token, onDone }: { token: string; onDone: (user: User) => void }) {
  const [passwords, setPasswords] = useState<[string, string]>(['', '']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = checkPasswords(passwords);
    if (problem) return setError(problem);
    setBusy(true);
    setError(null);
    try {
      onDone(await acceptInvite(token, passwords[0]));
    } catch (err) {
      setError(authMessage(err, 'This invite link is invalid or has expired. Ask for a new invite.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Welcome to the team" intro="Choose a password for your DenkByte editor account.">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <p role="alert" className={errorBox}>
            {error}
          </p>
        )}
        <PasswordFields value={passwords} onChange={setPasswords} />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Please wait…' : 'Create account'}
        </Button>
      </form>
    </AuthCard>
  );
}

/** Opened from the "reset password" email: the user is already logged in and sets a new password */
export function NewPasswordForm({ onDone }: { onDone: (user: User) => void }) {
  const [passwords, setPasswords] = useState<[string, string]>(['', '']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = checkPasswords(passwords);
    if (problem) return setError(problem);
    setBusy(true);
    setError(null);
    try {
      onDone(await updateUser({ password: passwords[0] }));
    } catch (err) {
      setError(authMessage(err, 'Could not save the new password. Request a new reset link.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Set a new password" intro="Choose a new password for your editor account.">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <p role="alert" className={errorBox}>
            {error}
          </p>
        )}
        <PasswordFields value={passwords} onChange={setPasswords} />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Please wait…' : 'Save password'}
        </Button>
      </form>
    </AuthCard>
  );
}
