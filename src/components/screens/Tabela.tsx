import { useGames } from '../../lib/useGames';
import { buildTable, clubsFrom } from '../../lib/euroleague';
import { Crest } from '../Crest';
import { Head, Section } from '../Shared';

export function Tabela() {
  const { games, error } = useGames();

  if (error) return <p className="note">Could not load the table. Please try again shortly.</p>;
  if (!games) return <p className="note">Loading</p>;

  const rows = buildTable(games);

  return (
    <Section>
      <Head title="EuroLeague table" />

      {rows.length === 0 ? (
        <div className="panel">
          <p className="note">
            The season has not started, so there are no played games and no table yet.
            <br /><br />
            {clubsFrom(games).length} clubs are in the competition. The table fills itself once games are played.
          </p>
        </div>
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
