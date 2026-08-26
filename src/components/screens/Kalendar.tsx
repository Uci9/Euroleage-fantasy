import { useMemo, useState } from 'react';
import { useGames } from '../../lib/useGames';
import { GameRow, Head, Section } from '../Shared';

export function Kalendar() {
  const { games, error } = useGames();
  const [round, setRound] = useState<number | null>(null);

  const rounds = useMemo(
    () => [...new Set((games ?? []).map(g => g.round))].sort((a, b) => a - b),
    [games]
  );

  if (error) return <p className="note">Ne mogu da dohvatim raspored. Pokušaj malo kasnije.</p>;
  if (!games) return <p className="note">Učitavam…</p>;

  // Bez izbora, otvara se prvo kolo koje još nije odigrano — ono koje se
  // zapravo traži kad se otvori kalendar.
  const active = round ?? games.find(g => !g.played)?.round ?? rounds[0];
  const shown = games.filter(g => g.round === active);

  return (
    <Section>
      <Head icon="📅" title="Kalendar utakmica" />

      <div className="rounds">
        {rounds.map(r => (
          <button key={r} className={r === active ? 'on' : ''} onClick={() => setRound(r)}>{r}</button>
        ))}
      </div>

      <div className="panel">
        {shown.length === 0
          ? <p className="note">Nema utakmica u ovom kolu.</p>
          : shown.map(g => <GameRow key={g.id} g={g} />)}
      </div>
    </Section>
  );
}
