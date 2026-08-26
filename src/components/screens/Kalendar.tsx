import { useMemo, useState } from 'react';
import { useGames } from '../../lib/useGames';
import { GameRow, Head, Section } from '../Shared';
import { EurocourtPromo } from '../EurocourtPromo';

export function Kalendar() {
  const { games, error } = useGames();
  const [round, setRound] = useState<number | null>(null);

  const rounds = useMemo(
    () => [...new Set((games ?? []).map(g => g.round))].sort((a, b) => a - b),
    [games]
  );

  if (error) return <p className="note">Could not load the schedule. Please try again shortly.</p>;
  if (!games) return <p className="note">Loading</p>;

  // With nothing chosen, it opens on the first round not yet played — the
  // one people are actually looking for when they open a schedule.
  const active = round ?? games.find(g => !g.played)?.round ?? rounds[0];
  const shown = games.filter(g => g.round === active);

  return (
    <Section>
      <EurocourtPromo line="Know which of the next three games actually favour your players, round by round." />

      <Head title="Schedule" />

      <div className="rounds">
        {rounds.map(r => (
          <button key={r} className={r === active ? 'on' : ''} onClick={() => setRound(r)}>{r}</button>
        ))}
      </div>

      <div className="panel">
        {shown.length === 0
          ? <p className="note">No games in this round.</p>
          : shown.map(g => <GameRow key={g.id} g={g} />)}
      </div>
    </Section>
  );
}
