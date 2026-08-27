import { useEffect, useState } from 'react';

export type Account = {
  id: string; username: string; email: string; fullName: string;
  city: string; instagram: string; isAdmin: boolean; createdAt: string;
};

/**
 * Who is signed in, shared across the app.
 *
 * The header, the drawer and the admin screen all need the answer, and each
 * asking the server separately would mean three requests for one fact — and
 * three chances for them to disagree after a sign-in.
 */
let current: Account | null = null;
let loaded = false;
/** Set when the API cannot be reached at all, as opposed to answering "no". */
let offline = false;
const listeners = new Set<(a: Account | null) => void>();

function broadcast() { listeners.forEach(l => l(current)); }

export function setAccount(a: Account | null) { current = a; loaded = true; broadcast(); }

async function load() {
  try {
    const res = await fetch('/api/me');
    // 401 is a healthy server saying nobody is signed in. Anything that is not
    // JSON means the request never reached it.
    const body = await res.json().catch(() => null);
    offline = body === null;
    current = res.ok && body ? body : null;
  } catch {
    offline = true;
    current = null;
  }
  loaded = true;
  broadcast();
}

/**
 * Asks the server again.
 *
 * The first version checked once at page load and never again, so a tab opened
 * while the API was down kept saying so for as long as it stayed open — long
 * after the server came back. A banner that cannot clear itself is worse than
 * no banner: it teaches people to ignore it.
 */
export function refreshAccount() {
  return load();
}

/**
 * Re-check whenever the page is looked at again. Somebody who reads the banner,
 * starts the server and comes back finds the site working, without being told
 * to reload — which is the fix they would have had to guess at.
 */
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') load();
  });
  window.addEventListener('focus', () => load());
}

export function useAccount() {
  const [account, setLocal] = useState<Account | null>(current);
  const [ready, setReady] = useState(loaded);
  const [down, setDown] = useState(offline);

  useEffect(() => {
    const listener = (a: Account | null) => { setLocal(a); setReady(true); setDown(offline); };
    listeners.add(listener);
    if (!loaded) load(); else setReady(true);
    return () => { listeners.delete(listener); };
  }, []);

  return { account, ready, offline: down };
}

export async function signOut() {
  await fetch('/api/logout', { method: 'POST' });
  setAccount(null);
}
