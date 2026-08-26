import { useGames } from '../../lib/useGames';
import { liveGames, nextRound } from '../../lib/euroleague';
import { GameRow, Head, Section } from '../Shared';

export function Live() {
  const { games, error } = useGames();

  if (error) return <p className="note">Ne mogu da dohvatim podatke. Pokušaj malo kasnije.</p>;
  if (!games) return <p className="note">Učitavam…</p>;

  const live = liveGames(games);
  const next = nextRound(games);

  return (
    <>
      <Section>
        <Head icon="🔴" title="Uživo" />
        <div className="panel">
          {live.length === 0
            ? <p className="note">Trenutno nema utakmica u toku.</p>
            : live.map(g => <GameRow key={g.id} g={g} live />)}
        </div>
      </Section>

      {next && (
        <Section>
          <Head icon="⏭" title={`Sljedeće — ${next.round}. kolo`} />
          <div className="panel">
            {next.games.map(g => <GameRow key={g.id} g={g} />)}
          </div>
        </Section>
      )}
    </>
  );
}
