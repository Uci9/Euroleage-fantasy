import type { ReactNode } from 'react';
import { Crest } from './Crest';
import type { Game } from '../lib/euroleague';

export function fmtTime(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function fmtDay(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** Naslov sekcije sa opcionim linkom "vidi sve" — kao na mockupu. */
export function Head({ title, action, onAction }: {
  title: string; action?: string; onAction?: () => void;
}) {
  return (
    <div className="sec__bar">
      <h2>{title}</h2>
      {action && <button className="sec__more" onClick={onAction}>{action}</button>}
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <section className="sec">{children}</section>;
}

/** Jedna utakmica: dva kluba, vrijeme ili rezultat. */
export function GameRow({ g, live = false }: { g: Game; live?: boolean }) {
  const done = g.homeScore != null && g.awayScore != null;
  return (
    <div className={`grow ${live ? 'grow--live' : ''}`}>
      <div className="grow__side">
        <Crest club={g.home} size={22} />
        <span className="grow__name">{g.home.name}</span>
      </div>
      <div className="grow__mid">
        {done
          ? <span className="grow__score">{g.homeScore} : {g.awayScore}</span>
          : <span className="grow__time">{fmtTime(g.date)}</span>}
        <span className="grow__day">{live ? 'LIVE' : fmtDay(g.date)}</span>
      </div>
      <div className="grow__side grow__side--r">
        <span className="grow__name">{g.away.name}</span>
        <Crest club={g.away} size={22} />
      </div>
    </div>
  );
}
