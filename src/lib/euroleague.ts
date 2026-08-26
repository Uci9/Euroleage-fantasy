/**
 * Podaci direktno sa zvaničnog EuroLeague API-ja.
 *
 * API dozvoljava pozive iz browsera (CORS *), pa sajtu ne treba nikakav
 * server — ni baza, ni hosting za backend. Manje dijelova znači manje
 * stvari koje mogu da se pokvare.
 */

const SEASON = 'E2026';
const BASE = `https://api-live.euroleague.net/v2/competitions/E/seasons/${SEASON}`;

export type Club = { code: string; name: string; crest: string | null };
export type Game = {
  id: string;
  round: number;
  date: string;
  played: boolean;
  home: Club;
  away: Club;
  homeScore: number | null;
  awayScore: number | null;
  venue: string | null;
};

export type TableRow = {
  club: Club;
  played: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
};

function toClub(raw: any): Club {
  return {
    code: raw?.code ?? '',
    // `name` je puno ime kluba. `editorialName` je nadimak za naslove —
    // "Barca" umjesto "FC Barcelona", "Crvena" umjesto "Crvena Zvezda" — pa se
    // ne koristi u tabeli gdje ljudi traže klub po imenu.
    name: raw?.name || raw?.abbreviatedName || '',
    crest: raw?.images?.crest ?? null,
  };
}

/** Cijeli raspored sezone. API stranira, pa se čita dok ne dođe kraća strana. */
export async function fetchGames(): Promise<Game[]> {
  const out: Game[] = [];
  const PAGE = 200;

  for (let page = 0; page < 6; page++) {
    const res = await fetch(`${BASE}/games?limit=${PAGE}&offset=${page * PAGE}`);
    if (!res.ok) {
      if (out.length === 0) throw new Error(`EuroLeague API: HTTP ${res.status}`);
      break;
    }
    const json = await res.json();
    const rows: any[] = json?.data ?? [];
    for (const g of rows) {
      // Neodigrana utakmica ima score 0, ne null — pa bi svaki budući meč
      // stajao kao 0:0 da se to ne provjeri.
      const played = Boolean(g.played);
      out.push({
        id: g.identifier ?? g.id,
        round: g.round ?? 0,
        date: g.localDate ?? g.date ?? '',
        played,
        home: toClub(g.local?.club),
        away: toClub(g.road?.club),
        homeScore: played ? g.local?.score ?? null : null,
        awayScore: played ? g.road?.score ?? null : null,
        venue: g.venue?.name ?? null,
      });
    }
    if (rows.length < PAGE) break;
  }

  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Tabela se računa iz odigranih utakmica.
 *
 * API nema endpoint za tabelu, a i da ima — ovako je tabela uvijek u skladu
 * sa rasporedom koji je prikazan ispod nje. Dok sezona ne počne, tabela je
 * prazna i sajt to i kaže umjesto da prikazuje same nule.
 */
export function buildTable(games: Game[]): TableRow[] {
  const rows = new Map<string, TableRow>();

  const ensure = (club: Club) => {
    if (!club.code) return null;
    let row = rows.get(club.code);
    if (!row) {
      row = { club, played: 0, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 };
      rows.set(club.code, row);
    }
    return row;
  };

  for (const g of games) {
    if (!g.played || g.homeScore == null || g.awayScore == null) continue;
    const home = ensure(g.home);
    const away = ensure(g.away);
    if (!home || !away) continue;

    home.played++; away.played++;
    home.pointsFor += g.homeScore; home.pointsAgainst += g.awayScore;
    away.pointsFor += g.awayScore; away.pointsAgainst += g.homeScore;
    if (g.homeScore > g.awayScore) { home.wins++; away.losses++; }
    else { away.wins++; home.losses++; }
  }

  return [...rows.values()].sort(
    (a, b) =>
      b.wins - a.wins ||
      (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst) ||
      a.club.name.localeCompare(b.club.name)
  );
}

/**
 * Utakmice koje se igraju upravo sada.
 *
 * API nema poseban "live" endpoint: utakmica u toku je ona koja je počela a
 * još nije označena kao odigrana. Prozor od tri sata pokriva i produžetke, a
 * sprječava da meč od prekjuče, koji se zaglavio kao neodigran, zauvijek stoji
 * kao da traje.
 */
export function liveGames(games: Game[], now = new Date()): Game[] {
  const MS = 3 * 60 * 60 * 1000;
  return games.filter(g => {
    if (g.played) return false;
    const t = new Date(g.date).getTime();
    if (isNaN(t)) return false;
    const start = now.getTime() - t;
    return start >= 0 && start <= MS;
  });
}

/** Prvo sljedeće kolo — ono što ljudi traže kad otvore kalendar. */
export function nextRound(games: Game[]): { round: number; games: Game[] } | null {
  const upcoming = games.filter(g => !g.played);
  if (upcoming.length === 0) return null;
  const round = upcoming[0].round;
  return { round, games: upcoming.filter(g => g.round === round) };
}

/** Klubovi u takmičenju — poznati iz rasporeda i prije prve utakmice. */
export function clubsFrom(games: Game[]): Club[] {
  const seen = new Map<string, Club>();
  for (const g of games) {
    for (const c of [g.home, g.away]) if (c.code && !seen.has(c.code)) seen.set(c.code, c);
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}
