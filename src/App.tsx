import { useEffect, useState } from 'react';
import { BRAND, HOME } from './lib/content';
import { useGames } from './lib/useGames';
import { buildTable, liveGames, nextRound } from './lib/euroleague';
import { refreshAccount, useAccount } from './lib/auth';
import { Crest } from './components/Crest';
import { GameRow, Head } from './components/Shared';
import { EurocourtPromo } from './components/EurocourtPromo';
import { Live } from './components/screens/Live';
import { Kalendar } from './components/screens/Kalendar';
import { Tabela } from './components/screens/Tabela';
import { About, HowItWorks, Rules } from './components/screens/Static';
import { AccountScreen } from './components/screens/Account';
import { AdminScreen } from './components/screens/Admin';

type Tab = 'home' | 'how' | 'rules' | 'live' | 'schedule' | 'table' | 'about' | 'account' | 'admin';

const MENU: [Tab, string][] = [
  ['home', 'Home'],
  ['how', 'How it works'],
  ['rules', 'Rules'],
  ['live', 'Live scores'],
  ['schedule', 'Schedule'],
  ['table', 'EuroLeague table'],
  ['about', 'About us'],
];

const BOTTOM: [Tab, string][] = [
  ['home', 'Home'],
  ['live', 'Live'],
  ['schedule', 'Schedule'],
  ['table', 'Table'],
];

function Home({ go }: { go: (t: Tab) => void }) {
  const { games } = useGames();
  const { account } = useAccount();
  const live = games ? liveGames(games) : [];
  const next = games ? nextRound(games) : null;
  const table = games ? buildTable(games).slice(0, 5) : [];

  return (
    <>
      <div className="hero">
        <div className="hero__bg" />
        <div className="hero__in">
          <img className="hero__logo" src="/logo.jpg" alt={BRAND.name} />
          <h1>EL Fantasy Balkan</h1>
          <p className="hero__tag">{BRAND.tagline}</p>
          <p className="hero__lead">{HOME.lead}</p>
          <div className="hero__btns">
            <button className="btn" onClick={() => go('account')}>
              {account ? 'Your account' : 'Join the league'}
            </button>
            {BRAND.viber
              ? <a className="btn btn--ghost" href={BRAND.viber} target="_blank" rel="noopener noreferrer">Viber group</a>
              : <button className="btn btn--ghost" onClick={() => go('how')}>How it works</button>}
          </div>
        </div>
      </div>

      {live.length > 0 && (
        <section className="sec">
          <Head title="Live now" action="All games" onAction={() => go('live')} />
          <div className="panel">{live.map(g => <GameRow key={g.id} g={g} live />)}</div>
        </section>
      )}

      <EurocourtPromo />

      {next && (
        <section className="sec">
          <Head title={`Round ${next.round}`} action="Full schedule" onAction={() => go('schedule')} />
          <div className="panel">{next.games.slice(0, 4).map(g => <GameRow key={g.id} g={g} />)}</div>
        </section>
      )}

      {table.length > 0 && (
        <section className="sec">
          <Head title="EuroLeague table" action="Full table" onAction={() => go('table')} />
          <div className="panel">
            {table.map((r, i) => (
              <div className="trow trow--mini" key={r.club.code}>
                <span className="trow__r">{i + 1}</span>
                <Crest club={r.club} size={22} />
                <span className="trow__n">{r.club.name}</span>
                <span className="trow__v trow__v--hi">{r.wins}-{r.losses}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [menu, setMenu] = useState(false);
  const { account, offline } = useAccount();

  const go = (t: Tab) => { setTab(t); setMenu(false); };

  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  // An open drawer covers the page, so the page beneath must not scroll under
  // it, and Escape closes it like any other layer over the content.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [menu]);

  const title = tab === 'account' ? 'Account'
    : tab === 'admin' ? 'Admin panel'
    : MENU.find(m => m[0] === tab)?.[1] ?? '';

  return (
    <div className="app">
      <header className="top">
        <button className="top__burger" onClick={() => setMenu(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <button className="top__brand" onClick={() => go('home')}>
          <img src="/logo-small.jpg" alt="" />
          <span>
            <b>EL Fantasy Balkan</b>
            <i>{tab === 'home' ? BRAND.sub : title}</i>
          </span>
        </button>
        <button
          className={`top__acct ${account ? 'top__acct--in' : ''}`}
          onClick={() => go('account')}
        >
          {account ? account.username : 'Sign in'}
        </button>
      </header>

      {menu && (
        <>
          <div className="drawer__bg" onClick={() => setMenu(false)} />
          <nav className="drawer">
            <div className="drawer__top">
              <img src="/logo.jpg" alt={BRAND.name} />
              <b>EL Fantasy Balkan</b>
              <i>{BRAND.sub}</i>
            </div>
            {MENU.map(([key, label]) => (
              <button key={key} className={tab === key ? 'on' : ''} onClick={() => go(key)}>{label}</button>
            ))}
            <div className="drawer__sep" />
            <button className={tab === 'account' ? 'on' : ''} onClick={() => go('account')}>
              {account ? `Signed in as ${account.username}` : 'Sign in or join'}
            </button>
            {account?.isAdmin && (
              <button className={tab === 'admin' ? 'on' : ''} onClick={() => go('admin')}>Admin panel</button>
            )}
            {BRAND.viber && (
              <a className="drawer__link" href={BRAND.viber} target="_blank" rel="noopener noreferrer">Viber group</a>
            )}
          </nav>
        </>
      )}

      <main className="main">
        {/* Said once, at the top, rather than after somebody has filled in a
            whole form and pressed the button. */}
        {offline && (
          <div className="form__err" style={{ marginBottom: 16 }}>
            The account server is not running, so signing in and joining will not work.
            Start it with <code>pnpm start</code>.
            {' '}
            <button className="linkish" onClick={() => refreshAccount()}>Check again</button>
          </div>
        )}

        {tab === 'home' && <Home go={go} />}
        {tab === 'how' && <HowItWorks go={go as (t: string) => void} />}
        {tab === 'rules' && <Rules go={go as (t: string) => void} />}
        {tab === 'live' && <Live />}
        {tab === 'schedule' && <Kalendar />}
        {tab === 'table' && <Tabela />}
        {tab === 'about' && <About />}
        {tab === 'account' && <AccountScreen go={go as (t: string) => void} />}
        {tab === 'admin' && <AdminScreen />}

        {/* The footer sits inside <main>, so it renders under every screen —
            one place to change, and no page can be missed. */}
        <footer className="foot">
          <p>
            {BRAND.name} — independent fantasy league<br />
            Not affiliated with EuroLeague Basketball.
          </p>
          <p className="foot__by">
            This site was made by{' '}
            <a href="https://eurocourt.net" target="_blank" rel="noopener noreferrer">eurocourt.net</a>
          </p>
        </footer>
      </main>

      <nav className="bottom">
        {BOTTOM.map(([key, label]) => (
          <button key={key} className={tab === key ? 'on' : ''} onClick={() => go(key)}>{label}</button>
        ))}
        <button className={menu ? 'on' : ''} onClick={() => setMenu(true)}>More</button>
      </nav>
    </div>
  );
}
