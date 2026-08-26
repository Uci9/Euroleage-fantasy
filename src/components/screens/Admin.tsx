import { useEffect, useState } from 'react';
import { useAccount, type Account } from '../../lib/auth';

/** Everybody registered for the league, newest first. */
export function AdminScreen() {
  const { account, ready } = useAccount();
  const [members, setMembers] = useState<Account[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetch('/api/admin/members')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setMembers)
      .catch(() => setError('Could not load the member list.'));
  };

  useEffect(() => { if (account?.isAdmin) load(); }, [account?.isAdmin]);

  const remove = async (m: Account) => {
    // Deleting somebody's registration cannot be undone, so it is confirmed.
    if (!window.confirm(`Remove ${m.username} from the league?`)) return;
    const res = await fetch(`/api/admin/members/${m.id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  if (!ready) return <p className="note">Loading</p>;
  if (!account?.isAdmin) return <p className="note">Admins only.</p>;

  return (
    <section className="sec">
      <div className="head">
        <span className="eyebrow">Admin panel</span>
        <h2>League members</h2>
      </div>

      {error && <div className="form__err">{error}</div>}

      {members === null ? (
        <p className="note">Loading</p>
      ) : (
        <>
          <div className="panel" style={{ padding: '16px', marginBottom: 14 }}>
            <div className="fact__l">Registered</div>
            <div className="count">{members.length}</div>
          </div>

          <div className="panel">
            {members.length === 0 ? (
              <p className="note">Nobody has registered yet.</p>
            ) : (
              members.map(m => (
                <div className="member" key={m.id}>
                  <div className="member__top">
                    <span className="member__u">{m.username}</span>
                    <span className="member__d">
                      {new Date(m.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="member__row">{m.email}</div>
                  {(m.fullName || m.city) && (
                    <div className="member__row">{[m.fullName, m.city].filter(Boolean).join(' — ')}</div>
                  )}
                  {m.instagram && <div className="member__row">{m.instagram}</div>}
                  <div className="member__act">
                    <button className="btn btn--sm btn--danger" onClick={() => remove(m)}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
