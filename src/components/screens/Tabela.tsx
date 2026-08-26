import { useGames } from '../../lib/useGames';
import { buildTable, clubsFrom } from '../../lib/euroleague';
import { Crest } from '../Crest';
import { Head, Section } from '../Shared';

export function Tabela() {
  const { games, error } = useGames();

  if (error) return <p className="note">Ne mogu da dohvatim tabelu. Pokušaj malo kasnije.</p>;
  if (!games) return <p className="note">Učitavam…</p>;

  const rows = buildTable(games);

  return (
    <Section>
      <Head icon="🏆" title="EuroLeague tabela" />

      {rows.length === 0 ? (
        <div className="panel">
          <p className="note">
            Sezona još nije počela, pa nema odigranih utakmica ni tabele.
            <br /><br />
            U takmičenju je {clubsFrom(games).length} klubova — tabela se popunjava sama čim krenu utakmice.
          </p>
        </div>
      ) : (
        <div className="panel">
          <div className="thead"><span>#</span><span /><span>Tim</span><span>U</span><span>P</span><span>%</span></div>
          {rows.map((r, i) => {
            const pct = r.played > 0 ? Math.round((r.wins / r.played) * 1000) / 10 : 0;
            return (
              <div className="trow" key={r.club.code}>
                <span className="trow__r">{i + 1}</span>
                <Crest club={r.club} size={22} />
                <span className="trow__n">{r.club.name}</span>
                <span className="trow__v">{r.wins}</span>
                <span className="trow__v">{r.losses}</span>
                <span className="trow__v trow__v--hi">{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
