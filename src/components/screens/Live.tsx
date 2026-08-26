import { useGames } from '../../lib/useGames';
import { liveGames, nextRound } from '../../lib/euroleague';
import { GameRow, Head, Section } from '../Shared';
import { EurocourtPromo } from '../EurocourtPromo';

export function Live() {
  const { games, error } = useGames();

  if (error) return <p className="note">Could not load the data. Please try again shortly.</p>;
  if (!games) return <p className="note">Loading</p>;

  const live = liveGames(games);
  const next = nextRound(games);

  return (
    <>
      <EurocourtPromo />

      <Section>
        <Head title="Live now" />
        <div className="panel">
          {live.length === 0
            ? <p className="note">No games are being played right now.</p>
            : live.map(g => <GameRow key={g.id} g={g} live />)}
        </div>
      </Section>

      {next && (
        <Section>
          <Head title={`Next up — round ${next.round}`} />
          <div className="panel">
            {next.games.map(g => <GameRow key={g.id} g={g} />)}
          </div>
        </Section>
      )}
    </>
  );
}
