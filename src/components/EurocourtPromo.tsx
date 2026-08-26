const URL = 'https://eurocourt.net/eurocourt-ai';

/**
 * House promo for Eurocourt.
 *
 * Leads with what the AI does for the reader, not with how it does it — the
 * mechanics are Eurocourt's business, and a reader deciding whether to click
 * only wants to know what they get.
 *
 * Links to the AI page rather than the front page: landing somebody on a news
 * feed and asking them to find the AI loses most of them.
 */
export function EurocourtPromo() {
  return (
    <a className="promo" href={URL} target="_blank" rel="noopener noreferrer">
      <span className="promo__bar" aria-hidden />
      <span className="promo__body">
        <span className="promo__title">Eurocourt AI</span>
        <span className="promo__line">
          Helps you make your best EuroLeague fantasy squad.
        </span>
        <span className="promo__extra">
          Plus all the stats, standings, games, injuries and matchups.
        </span>
      </span>
      <span className="promo__go" aria-hidden>&rsaquo;</span>
    </a>
  );
}
