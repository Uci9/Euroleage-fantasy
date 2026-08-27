import { useState } from 'react';
import { setAccount, useAccount, signOut, type Account } from '../../lib/auth';

type Mode = 'login' | 'signup';

/** Says which half is down and what to do about it, rather than just failing. */
const OFFLINE = 'The account server is not responding. Start it with "pnpm start" and try again.';

/**
 * Sign in and join, in one screen.
 *
 * Creating an account *is* the league entry — there is no second form to fill
 * in and no way to end up registered for one but not the other. The extra
 * fields are what the organisers need to recognise a person; only the account
 * fields are required.
 */
export function AccountScreen({ go }: { go: (t: string) => void }) {
  const { account, ready } = useAccount();
  const [mode, setMode] = useState<Mode>('signup');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [f, setF] = useState({
    username: '', email: '', password: '', identifier: '',
    fullName: '', city: '', instagram: '',
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const body = mode === 'signup'
        ? { username: f.username, email: f.email, password: f.password,
            fullName: f.fullName, city: f.city, instagram: f.instagram }
        : { identifier: f.identifier, password: f.password };

      const res = await fetch(`/api/${mode}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });

      // A reply that is not JSON means the request never reached the API — the
      // dev proxy answers with an HTML error page when nothing is listening.
      // Parsing it would throw and get reported as a network fault, which
      // sends people looking in the wrong place.
      const data = await res.json().catch(() => null);

      if (!data) { setError(OFFLINE); return; }
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }
      setAccount(data as Account);
    } catch {
      setError(OFFLINE);
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return <p className="note">Loading</p>;

  if (account) {
    return (
      <section className="sec">
        <div className="head">
          <span className="eyebrow">Your account</span>
          <h2>{account.username}</h2>
        </div>
        <div className="panel member">
          <div className="member__row">{account.email}</div>
          {account.fullName && <div className="member__row">{account.fullName}</div>}
          {account.city && <div className="member__row">{account.city}</div>}
          {account.instagram && <div className="member__row">{account.instagram}</div>}
          <div className="member__d" style={{ marginTop: 8 }}>
            {account.isAdmin ? 'ADMINISTRATOR' : 'REGISTERED FOR THE LEAGUE'}
          </div>
        </div>
        {account.isAdmin && (
          <button className="btn" style={{ marginTop: 14 }} onClick={() => go('admin')}>Admin panel</button>
        )}
        <button className="btn btn--ghost" style={{ marginTop: 10 }} onClick={signOut}>Sign out</button>
      </section>
    );
  }

  return (
    <section className="sec">
      <div className="head">
        <span className="eyebrow">{mode === 'signup' ? 'Join the league' : 'Welcome back'}</span>
        <h2>{mode === 'signup' ? 'Create account' : 'Sign in'}</h2>
      </div>

      <form className="panel" onSubmit={submit} noValidate>
        {error && <div className="form__err">{error}</div>}

        {mode === 'signup' ? (
          <>
            <div className="field">
              <label htmlFor="u">Username</label>
              <input id="u" value={f.username} onChange={set('username')} autoComplete="username" />
              <div className="field__hint">Each username can only be used once.</div>
            </div>
            <div className="field">
              <label htmlFor="e">Gmail address</label>
              <input id="e" type="email" inputMode="email" value={f.email} onChange={set('email')} autoComplete="email" placeholder="you@gmail.com" />
              <div className="field__hint">Must end in @gmail.com, and each address can only be used once.</div>
            </div>
            <div className="field">
              <label htmlFor="p">Password</label>
              <input id="p" type="password" value={f.password} onChange={set('password')} autoComplete="new-password" />
              <div className="field__hint">At least 8 characters.</div>
            </div>
            <div className="field">
              <label htmlFor="fn">Full name <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <input id="fn" value={f.fullName} onChange={set('fullName')} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="c">City <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <input id="c" value={f.city} onChange={set('city')} />
            </div>
            <div className="field">
              <label htmlFor="ig">Instagram <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <input id="ig" value={f.instagram} onChange={set('instagram')} placeholder="@handle" />
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label htmlFor="id">Username or Gmail</label>
              <input id="id" value={f.identifier} onChange={set('identifier')} autoComplete="username" />
            </div>
            <div className="field">
              <label htmlFor="pw">Password</label>
              <input id="pw" type="password" value={f.password} onChange={set('password')} autoComplete="current-password" />
            </div>
          </>
        )}

        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Working' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="form__swap">
        {mode === 'signup' ? 'Already have an account? ' : 'No account yet? '}
        <button className="linkish" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(null); }}>
          {mode === 'signup' ? 'Sign in' : 'Create one'}
        </button>
      </p>
    </section>
  );
}
