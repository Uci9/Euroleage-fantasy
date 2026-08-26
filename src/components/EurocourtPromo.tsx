const URL = 'https://eurocourt.net/eurocourt-ai';

/**
 * House promo for Eurocourt's fantasy AI.
 *
 * It links straight to the AI page rather than the front page, because the
 * pitch is the AI — landing somebody on a news feed and asking them to find it
 * loses most of them.
 *
 * The line changes with where it sits. The same sentence repeated on all six
 * screens reads as an ad somebody forgot to vary; a line that follows what the
 * reader is already looking at reads as a suggestion.
 */
export function EurocourtPromo({ line }: { line: string }) {
  return (
    <a className="promo" href={URL} target="_blank" rel="noopener noreferrer">
      <span className="promo__bar" aria-hidden />
      <span className="promo__body">
        <span className="promo__kicker">Eurocourt AI</span>
        <span className="promo__title">Build a better fantasy squad</span>
        <span className="promo__line">{line}</span>
      </span>
      <span className="promo__go" aria-hidden>&rsaquo;</span>
    </a>
  );
}
