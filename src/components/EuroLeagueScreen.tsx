import { useEffect, useState } from 'react';
import { buildTable, clubsFrom, fetchGames, type Game, type TableRow } from '../lib/euroleague';
import { Crest } from './Crest';

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('sr-Latn', { day: 'numeric', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('sr-Latn', { hour: '2-digit', minute: '2-digit' });
}

export function EuroLeagueScreen() {
  const [view, setView] = useState<'tabela' | 'raspored'>('tabela');
  const [games, setGames] = useState<Game[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchGames()
      .then(g => { if (alive) setGames(g); })
      .catch(() => { if (alive) setErr(true); });
    return () => { alive = false; };
  }, []);

  if (err) return <div className="screen"><p className="note">Ne mogu da dohvatim podatke sa EuroLeague servisa. Pokušaj ponovo malo kasnije.</p></div>;
  if (!games) return <div className="screen"><p className="note">Učitavam…</p></div>;

  const table: TableRow[] = buildTable(games);
  const clubs = clubsFrom(games);
  // Sljedeće utakmice — ono što je ljudima korisno prije nego što sezona počne.
  const upcoming = games.filter(g => !g.played).slice(0, 20);
  const played = games.filter(g => g.played);

  return (
    <div className="screen">
      <span className="eyebrow">Sezona 2026/27</span>
      <h1>EuroLeague</h1>
      <p className="lead">Tabela i raspored, direktno sa zvaničnog EuroLeague servisa.</p>

      <div className="tabs" style={{ marginTop: 18 }}>
        <button className={view === 'tabela' ? 'on' : ''} onClick={() => setView('tabela')}>Tabela</button>
        <button className={view === 'raspored' ? 'on' : ''} onClick={() => setView('raspored')}>Raspored</button>
      </div>

      {view === 'tabela' && (
        <div className="card" style={{ padding: 0 }}>
          {table.length === 0 ? (
            <p className="note">
              Sezona još nije počela — nema odigranih utakmica, pa nema ni tabele.
              <br /><br />
              U takmičenju je {clubs.length} klubova. Tabela se popunjava sama, čim krenu utakmice.
            </p>
          ) : (
            table.map((r, i) => (
              <div className="trow" key={r.club.code}>
                <span className="trow__r">{i + 1}</span>
                <Crest club={r.club} size={26} />
                <span className="trow__n">{r.club.name}</span>
                <span className="trow__w">{r.wins}-{r.losses}</span>
              </div>
            ))
          )}
        </div>
      )}

      {view === 'raspored' && (
        <div className="card" style={{ padding: 0 }}>
          {upcoming.length === 0 ? (
            <p className="note">Nema zakazanih utakmica.</p>
          ) : (
            upcoming.map(g => (
              <div className="game" key={g.id}>
                <div className="game__meta">{g.round}. kolo · {fmtDate(g.date)}</div>
                <div className="game__side">
                  <Crest club={g.home} />
                  <span>{g.home.name}</span>
                  {g.homeScore != null && <b>{g.homeScore}</b>}
                </div>
                <div className="game__side">
                  <Crest club={g.away} />
                  <span>{g.away.name}</span>
                  {g.awayScore != null && <b>{g.awayScore}</b>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <p className="note" style={{ paddingBottom: 0 }}>
        {played.length > 0
          ? `Odigrano ${played.length} od ${games.length} utakmica.`
          : `Ukupno ${games.length} utakmica u sezoni.`}
      </p>
    </div>
  );
}
