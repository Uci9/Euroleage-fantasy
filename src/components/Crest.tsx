import { useState } from 'react';
import type { Club } from '../lib/euroleague';

/**
 * Grb kluba, sa slovima kao rezervom.
 *
 * Grbovi stižu sa EuroLeague CDN-a. Kad jedan ne stigne — pao CDN, blokator
 * slika, loša veza — na njegovom mjestu ostane rupa i red se raspadne. Zato
 * postoji rezerva: kratica kluba, iste veličine, pa raspored izgleda isto.
 *
 * Bez `loading="lazy"`: lista je dvadesetak utakmica sa sitnim slikama, a
 * lazy uvodi svoje probleme (u pozadinskoj kartici Chrome ih uopšte ne
 * učitava) bez ikakve dobiti na ovoj količini.
 */
export function Crest({ club, size = 24 }: { club: Club; size?: number }) {
  const [failed, setFailed] = useState(false);

  const initials = club.name
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .join('')
    .slice(0, 3)
    .toUpperCase();

  if (!club.crest || failed) {
    return (
      <span
        className="crest crest--txt"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
        title={club.name}
      >
        {initials || '—'}
      </span>
    );
  }

  return (
    <img
      className="crest"
      src={club.crest}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
