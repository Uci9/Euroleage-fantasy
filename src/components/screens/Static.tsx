import { ABOUT, HOW, RULES } from '../../lib/content';

export function HowItWorks({ go }: { go: (t: string) => void }) {
  return (
    <section className="sec">
      <div className="head">
        <span className="eyebrow">The basics</span>
        <h2>How it works</h2>
      </div>
      <p className="lead" style={{ marginBottom: 16 }}>{HOW.intro}</p>
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
      <button className="btn" onClick={() => go('account')}>Join the league</button>
    </section>
  );
}

export function Rules({ go }: { go: (t: string) => void }) {
  const isTodo = (v: string) => v.startsWith('TODO');
  return (
    <>
      <section className="sec">
        <div className="head">
          <span className="eyebrow">Entry and format</span>
          <h2>League rules</h2>
        </div>
        <div className="facts">
          {RULES.facts.map(f => (
            <div className={`fact ${isTodo(f.value) ? 'todo' : ''}`} key={f.label}>
              <div className="fact__l">{f.label}</div>
              <div className="fact__v">{f.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec__bar"><h2>The rules</h2></div>
        <div className="panel">
          <ol className="rules">
            {RULES.list.map((r, i) => (
              <li key={i} style={isTodo(r) ? { color: 'var(--orange-2)' } : undefined}>{r}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec">
        <div className="sec__bar"><h2>Prizes</h2></div>
        <div className="cards">
          {RULES.prizes.map(p => (
            <div className={`panel prize ${isTodo(p.prize) ? 'todo' : ''}`} key={p.place}>
              <div className="prize__p">{p.place}</div>
              <div className="prize__v">{p.prize}</div>
            </div>
          ))}
        </div>
        <button className="btn" onClick={() => go('account')}>Join the league</button>
      </section>
    </>
  );
}

/**
 * About us.
 *
 * The earlier version ran the whole poster together as one list of long
 * sentences, and it read as a wall. Each idea is its own card with a heading
 * now, so the page can be skimmed — which is how anybody arriving from
 * Instagram will read it.
 */
export function About() {
  return (
    <section className="sec">
      <div className="head">
        <span className="eyebrow">Who we are</span>
        <h2>About us</h2>
      </div>

      <p className="about__lead">{ABOUT.lead}</p>

      <div className="cards">
        {ABOUT.points.map(p => (
          <div className="panel about__item" key={p.title}>
            <div className="about__t">{p.title}</div>
            <div className="about__d">{p.text}</div>
          </div>
        ))}
      </div>

      <p className="about__sign">{ABOUT.signoff}</p>
    </section>
  );
}
