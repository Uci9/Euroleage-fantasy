import { useEffect, useState } from 'react';
import { ABOUT, BRAND, FANTASY, HOME, LEAGUE } from './lib/content';
import { EuroLeagueScreen } from './components/EuroLeagueScreen';
import { SignupScreen } from './components/SignupScreen';

type Tab = 'pocetna' | 'fantasy' | 'liga' | 'euroleague' | 'onama' | 'prijava';

const NAV: [Tab, string, string][] = [
  ['pocetna', '🏠', 'Početna'],
  ['fantasy', '🏀', 'Fantasy'],
  ['liga', '🏆', 'Naša liga'],
  ['euroleague', '📊', 'EuroLeague'],
  ['onama', '👥', 'O nama'],
];

/** Logo: vaš fajl kad stigne, do tada inicijali u istoj boji. */
function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="hero__logo">{BRAND.short}</div>;
  return (
    <div className="hero__logo">
      <img src="/logo.png" alt={BRAND.name} onError={() => setFailed(true)} />
    </div>
  );
}

function Home({ go }: { go: (t: Tab) => void }) {
  return (
    <div className="screen">
      <div className="hero">
        <Logo />
        <h1>{BRAND.name}</h1>
        <p className="hero__tag">{BRAND.tagline}</p>
        <p className="hero__lead">{HOME.lead}</p>
        <ul className="ticks">
          {HOME.points.map(p => <li key={p}>{p}</li>)}
        </ul>
        <div className="btn-wrap">
          <button className="btn" onClick={() => go('prijava')}>Uđi u ligu</button>
        </div>
        <div className="btn-wrap">
          <button className="btn btn--ghost" onClick={() => go('liga')}>Pravila i nagrade</button>
        </div>
      </div>
    </div>
  );
}

function Fantasy({ go }: { go: (t: Tab) => void }) {
  return (
    <div className="screen">
      <span className="eyebrow">Kako se igra</span>
      <h1>Fantasy</h1>
      <p className="lead">{FANTASY.intro}</p>

      <h2>Četiri koraka</h2>
      <div className="cards">
        {FANTASY.steps.map((s, i) => (
          <div className="card step" key={s.title}>
            <div className="step__n">{i + 1}</div>
            <div>
              <div className="step__t">{s.title}</div>
              <div className="step__d">{s.text}</div>
            </div>
          </div>
        ))}
      </div>

      <h2>Naši prijedlozi</h2>
      <div className="cards">
        {FANTASY.picks.map((p, i) => (
          <div className={`card ${p.name.startsWith('TODO') ? 'todo' : ''}`} key={i}>
            <div className="pick__n">{p.name}</div>
            <div className="pick__t">{p.team}</div>
            <div className="pick__w">{p.why}</div>
          </div>
        ))}
      </div>

      <div className="btn-wrap">
        <button className="btn" onClick={() => go('prijava')}>Prijavi se</button>
      </div>
    </div>
  );
}

function League({ go }: { go: (t: Tab) => void }) {
  return (
    <div className="screen">
      <span className="eyebrow">Sve o ligi</span>
      <h1>Naša liga</h1>
      <p className="lead">{LEAGUE.intro}</p>

      <div className="facts" style={{ marginTop: 18 }}>
        {LEAGUE.facts.map(f => (
          <div className="fact" key={f.label}>
            <div className="fact__l">{f.label}</div>
            <div className="fact__v">{f.value}</div>
          </div>
        ))}
      </div>

      <h2>Pravila</h2>
      <div className="card todo">
        <ol className="rules">
          {LEAGUE.rules.map((r, i) => <li key={i}>{r}</li>)}
        </ol>
      </div>

      <h2>Nagrade</h2>
      <div className="cards">
        {LEAGUE.prizes.map(p => (
          <div className="card prize" key={p.place}>
            <div className="prize__p">{p.place}</div>
            <div className="prize__v">{p.prize}</div>
          </div>
        ))}
      </div>

      <div className="btn-wrap">
        <button className="btn" onClick={() => go('prijava')}>Prijavi se za ligu</button>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="screen">
      <span className="eyebrow">Ko smo mi</span>
      <h1>O nama</h1>
      <div className="card todo" style={{ marginTop: 16 }}>
        {ABOUT.text.map((t, i) => (
          <p key={i} className="lead" style={{ marginBottom: i < ABOUT.text.length - 1 ? 12 : 0 }}>{t}</p>
        ))}
      </div>
      <div className="btn-wrap">
        <a className="btn btn--ghost" href={BRAND.instagram} target="_blank" rel="noopener noreferrer">
          Prati nas na Instagramu
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('pocetna');

  // Novi ekran uvijek počinje od vrha — inače korisnik sleti na sredinu
  // sadržaja koji nije ni otvorio.
  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  return (
    <div className="app">
      {tab === 'pocetna' && <Home go={setTab} />}
      {tab === 'fantasy' && <Fantasy go={setTab} />}
      {tab === 'liga' && <League go={setTab} />}
      {tab === 'euroleague' && <EuroLeagueScreen />}
      {tab === 'onama' && <About />}
      {tab === 'prijava' && <SignupScreen />}

      <p className="foot">
        {BRAND.name} · nezvanični fan sajt<br />
        Nije povezan sa EuroLeague Basketball.
      </p>

      <nav className="nav">
        {NAV.map(([key, icon, label]) => (
          <button
            key={key}
            className={tab === key || (key === 'liga' && tab === 'prijava') ? 'on' : ''}
            onClick={() => setTab(key)}
          >
            <span className="nav__i">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
