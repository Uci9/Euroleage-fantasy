import { useEffect, useState } from 'react';
import { fetchGames, type Game } from './euroleague';

type State = { games: Game[] | null; error: boolean };

/**
 * Raspored se dohvata jednom i dijeli između ekrana.
 *
 * Početna, Live, Kalendar i Tabela crtaju iz istog spiska. Da svaki ekran
 * zove API sam, prelazak kroz navigaciju bi značio četiri ista poziva i
 * četiri čekanja — a podaci su isti.
 */
let cache: Game[] | null = null;
let inFlight: Promise<Game[]> | null = null;
const listeners = new Set<(s: State) => void>();

function load() {
  if (cache || inFlight) return;
  inFlight = fetchGames();
  inFlight
    .then(g => { cache = g; listeners.forEach(l => l({ games: g, error: false })); })
    .catch(() => { listeners.forEach(l => l({ games: null, error: true })); })
    .finally(() => { inFlight = null; });
}

export function useGames(): State {
  const [state, setState] = useState<State>({ games: cache, error: false });

  useEffect(() => {
    if (cache) { setState({ games: cache, error: false }); return; }
    listeners.add(setState);
    load();
    return () => { listeners.delete(setState); };
  }, []);

  return state;
}
