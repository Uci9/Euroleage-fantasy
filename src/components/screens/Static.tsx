import { ABOUT, BRAND, HOW, RULES } from '../../lib/content';
import { Head, Section } from '../Shared';

/** **podebljano** iz teksta — da se sadržaj piše bez HTML-a. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p))}</>;
}

export function KakoFunkcionise({ go }: { go: (t: string) => void }) {
  return (
    <Section>
      <Head icon="ℹ️" title="Kako funkcioniše" />
      <p className="lead">{HOW.intro}</p>
      <div className="cards">
        {HOW.steps.map((s, i) => (
          <div className="panel step" key={s.title}>
            <div className="step__n">{i + 1}</div>
            <div>
              <div className="step__t">{s.title}</div>
              <div className="step__d">{s.text}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn" onClick={() => go('prijava')}>Prijavi se</button>
    </Section>
  );
}

export function Pravila({ go }: { go: (t: string) => void }) {
  const todo = (v: string) => v.startsWith('TODO');
  return (
    <>
      <Section>
        <Head icon="📋" title="Pravila lige" />
        <div className="facts">
          {RULES.facts.map(f => (
            <div className={`fact ${todo(f.value) ? 'todo' : ''}`} key={f.label}>
              <div className="fact__l">{f.label}</div>
              <div className="fact__v">{f.value}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Head icon="⚖️" title="Pravila" />
        <div className={`panel ${RULES.list.some(todo) ? 'todo' : ''}`}>
          <ol className="rules">{RULES.list.map((r, i) => <li key={i}>{r}</li>)}</ol>
        </div>
      </Section>

      <Section>
        <Head icon="🥇" title="Nagrade" />
        <div className="cards">
          {RULES.prizes.map(p => (
            <div className={`panel prize ${todo(p.prize) ? 'todo' : ''}`} key={p.place}>
              <div className="prize__p">{p.place}</div>
              <div className="prize__v">{p.prize}</div>
            </div>
          ))}
        </div>
        <button className="btn" onClick={() => go('prijava')}>Prijavi se za ligu</button>
      </Section>
    </>
  );
}

export function KoSmoMi() {
  return (
    <Section>
      <Head icon="👥" title={ABOUT.title} />
      <div className="panel about">
        <ul className="ticks">
          {ABOUT.points.map((p, i) => <li key={i}><Rich text={p} /></li>)}
        </ul>
        <p className="about__sign">{ABOUT.signoff}</p>
        <p className="about__sub">{BRAND.sub}</p>
      </div>
    </Section>
  );
}
