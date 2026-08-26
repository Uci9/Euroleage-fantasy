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
const listeners = new Set<(a: Account | null) => void>();

function broadcast() { listeners.forEach(l => l(current)); }

export function setAccount(a: Account | null) { current = a; loaded = true; broadcast(); }

async function load() {
  try {
    const res = await fetch('/api/me');
    current = res.ok ? await res.json() : null;
  } catch {
    current = null;
  }
  loaded = true;
  broadcast();
}

export function useAccount() {
  const [account, setLocal] = useState<Account | null>(current);
  const [ready, setReady] = useState(loaded);

  useEffect(() => {
    const listener = (a: Account | null) => { setLocal(a); setReady(true); };
    listeners.add(listener);
    if (!loaded) load(); else setReady(true);
    return () => { listeners.delete(listener); };
  }, []);

  return { account, ready };
}

export async function signOut() {
  await fetch('/api/logout', { method: 'POST' });
  setAccount(null);
}
