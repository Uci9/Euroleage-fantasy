import { useGames } from '../../lib/useGames';
import { buildTable } from '../../lib/euroleague';
import { Crest } from '../Crest';
import { Head, Section } from '../Shared';
import { EurocourtPromo } from '../EurocourtPromo';

export function Tabela() {
  const { games, error } = useGames();

  if (error) return <p className="note">Could not load the table. Please try again shortly.</p>;
  if (!games) return <p className="note">Loading</p>;

  const rows = buildTable(games);
  const played = games.filter(g => g.played).length;

  return (
    <Section>
      <EurocourtPromo line="Standings tell you who is winning. Eurocourt's AI tells you which of their players is worth owning." />

      <Head title="EuroLeague table" />

      {played === 0 && (
        <p className="lead" style={{ marginBottom: 12 }}>
          The season has not started yet. All {rows.length} clubs start level; the table
          fills itself as games are played.
        </p>
      )}

      {rows.length === 0 ? (
        <div className="panel"><p className="note">No clubs found.</p></div>
      ) : (
        <div className="panel">
          <div className="thead"><span>#</span><span /><span>Team</span><span>W</span><span>L</span><span>PCT</span></div>
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
