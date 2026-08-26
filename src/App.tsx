import { useEffect, useState } from 'react';
import { BRAND, HOME } from './lib/content';
import { useGames } from './lib/useGames';
import { buildTable, liveGames, nextRound } from './lib/euroleague';
import { Crest } from './components/Crest';
import { GameRow, Head, Section } from './components/Shared';
import { Live } from './components/screens/Live';
import { Kalendar } from './components/screens/Kalendar';
import { Tabela } from './components/screens/Tabela';
import { KakoFunkcionise, KoSmoMi, Pravila } from './components/screens/Static';
import { SignupScreen } from './components/SignupScreen';

type Tab =
  | 'pocetna' | 'kako' | 'pravila' | 'live'
  | 'kalendar' | 'tabela' | 'kosmomi' | 'prijava';

/** Bočni meni — cijela ponuda sajta. */
const MENU: [Tab, string, string][] = [
  ['pocetna', '🏠', 'Početna'],
  ['kako', 'ℹ️', 'Kako funkcioniše'],
  ['pravila', '📋', 'Pravila'],
  ['live', '🔴', 'Live rezultati'],
  ['kalendar', '📅', 'Kalendar'],
  ['tabela', '🏆', 'EuroLeague tabela'],
  ['kosmomi', '👥', 'Ko smo mi'],
  ['prijava', '📝', 'Prijavi se'],
];

/** Donja traka — ono najkorišćenije, na dohvat palca. */
const BOTTOM: [Tab, string, string][] = [
  ['pocetna', '🏠', 'Početna'],
  ['live', '🔴', 'Live'],
  ['kalendar', '📅', 'Kalendar'],
  ['tabela', '🏆', 'Tabela'],
];

function Pocetna({ go }: { go: (t: Tab) => void }) {
  const { games } = useGames();
  const live = games ? liveGames(games) : [];
  const next = games ? nextRound(games) : null;
  const table = games ? buildTable(games).slice(0, 5) : [];

  return (
    <>
      <div className="hero">
        <div className="hero__bg" />
        <div className="hero__in">
          <img className="hero__logo" src="/logo.jpg" alt={BRAND.name} />
          <h1>EL FANTASY BALKAN</h1>
          <p className="hero__tag">{BRAND.tagline}</p>
          <p className="hero__lead">{HOME.lead}</p>
          <div className="hero__btns">
            <button className="btn" onClick={() => go('prijava')}>Prijavi se</button>
            {BRAND.viber
              ? <a className="btn btn--ghost" href={BRAND.viber} target="_blank" rel="noopener noreferrer">Viber grupa</a>
              : <button className="btn btn--ghost" onClick={() => go('kako')}>Kako funkcioniše</button>}
          </div>
        </div>
      </div>

      {live.length > 0 && (
        <Section>
          <Head icon="🔴" title="Uživo" action="Sve utakmice" onAction={() => go('live')} />
          <div className="panel">{live.map(g => <GameRow key={g.id} g={g} live />)}</div>
        </Section>
      )}

      {next && (
        <Section>
          <Head icon="📅" title={`${next.round}. kolo`} action="Ceo kalendar" onAction={() => go('kalendar')} />
          <div className="panel">{next.games.slice(0, 4).map(g => <GameRow key={g.id} g={g} />)}</div>
        </Section>
      )}

      {table.length > 0 && (
        <Section>
          <Head icon="🏆" title="Tabela" action="Cela tabela" onAction={() => go('tabela')} />
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
        </Section>
      )}
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('pocetna');
  const [menu, setMenu] = useState(false);

  const go = (t: Tab) => { setTab(t); setMenu(false); };

  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  // Otvoren meni prekriva ekran, pa stranica ispod ne smije da se pomjera,
  // a Escape ga zatvara kao i svaki drugi sloj preko sadržaja.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [menu]);

  const title = MENU.find(m => m[0] === tab)?.[2] ?? '';

  return (
    <div className="app">
      <header className="top">
        <button className="top__burger" onClick={() => setMenu(true)} aria-label="Meni">
          <span /><span /><span />
        </button>
        <button className="top__brand" onClick={() => go('pocetna')}>
          <img src="/logo-small.jpg" alt="" />
          <span>
            <b>EL FANTASY BALKAN</b>
            <i>{tab === 'pocetna' ? BRAND.sub : title}</i>
          </span>
        </button>
      </header>

      {menu && (
        <>
          <div className="drawer__bg" onClick={() => setMenu(false)} />
          <nav className="drawer">
            <div className="drawer__top">
              <img src="/logo.jpg" alt={BRAND.name} />
              <b>EL FANTASY BALKAN</b>
              <i>{BRAND.sub}</i>
            </div>
            {MENU.map(([key, icon, label]) => (
              <button key={key} className={tab === key ? 'on' : ''} onClick={() => go(key)}>
                <span className="drawer__i">{icon}</span>{label}
              </button>
            ))}
            {BRAND.viber && (
              <a className="drawer__viber" href={BRAND.viber} target="_blank" rel="noopener noreferrer">
                <span className="drawer__i">💬</span>Viber grupa
              </a>
            )}
          </nav>
        </>
      )}

      <main className="main">
        {tab === 'pocetna' && <Pocetna go={go} />}
        {tab === 'kako' && <KakoFunkcionise go={go as (t: string) => void} />}
        {tab === 'pravila' && <Pravila go={go as (t: string) => void} />}
        {tab === 'live' && <Live />}
        {tab === 'kalendar' && <Kalendar />}
        {tab === 'tabela' && <Tabela />}
        {tab === 'kosmomi' && <KoSmoMi />}
        {tab === 'prijava' && <SignupScreen />}

        <p className="foot">
          {BRAND.name} · nezavisna fantasy liga<br />
          Nije povezano sa EuroLeague Basketball.
        </p>
      </main>

      <nav className="bottom">
        {BOTTOM.map(([key, icon, label]) => (
          <button key={key} className={tab === key ? 'on' : ''} onClick={() => go(key)}>
            <span className="bottom__i">{icon}</span>{label}
          </button>
        ))}
        <button className={menu ? 'on' : ''} onClick={() => setMenu(true)}>
          <span className="bottom__i">•••</span>Više
        </button>
      </nav>
    </div>
  );
}
