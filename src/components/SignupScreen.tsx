import { useState } from 'react';
import { BRAND } from '../lib/content';

type Form = { ime: string; email: string; instagram: string; grad: string; poruka: string };
type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = { ime: '', email: '', instagram: '', grad: '', poruka: '' };

/**
 * Prijava za ligu.
 *
 * Sajt zasad nema server, pa se prijava ne može sačuvati u bazu — umjesto da
 * dugme laže da je poslato, forma sastavi prijavu i preda je preko mejla ili
 * Instagrama. Kad bude servera, mijenja se samo ovo jedno mjesto.
 */
export function SignupScreen() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const validate = (): boolean => {
    const er: Errors = {};
    if (form.ime.trim().length < 2) er.ime = 'Upiši ime i prezime.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = 'Upiši ispravnu mejl adresu.';
    if (!form.instagram.trim() && !form.grad.trim()) er.instagram = 'Ostavi bar Instagram ili grad, da znamo ko si.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const body = [
      `Ime: ${form.ime}`,
      `Mejl: ${form.email}`,
      form.instagram && `Instagram: ${form.instagram}`,
      form.grad && `Grad: ${form.grad}`,
      form.poruka && `Poruka: ${form.poruka}`,
    ].filter(Boolean).join('\n');

    if (BRAND.email) {
      window.location.href =
        `mailto:${BRAND.email}?subject=${encodeURIComponent('Prijava za ligu')}&body=${encodeURIComponent(body)}`;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <>
        <div className="panel done">
          <div className="done__i">✓</div>
          <h2 style={{ margin: '0 0 8px' }}>Prijava je spremna</h2>
          <p className="lead">
            {BRAND.email
              ? 'Otvorili smo ti mejl sa popunjenom prijavom — pošalji ga i javljamo se.'
              : 'Pošalji nam poruku na Instagram i javljamo ti sve o ligi.'}
          </p>
          <div className="btn-wrap">
            <a className="btn" href={BRAND.instagram} target="_blank" rel="noopener noreferrer">
              Piši nam na Instagramu
            </a>
          </div>
          <div className="btn-wrap">
            <button className="btn btn--ghost" onClick={() => { setForm(EMPTY); setSent(false); }}>
              Nova prijava
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="sec">
      <div className="sec__head">
        <span className="sec__icon">📝</span>
        <h2 className="sec__title">Prijava za ligu</h2>
      </div>
      <p className="lead">Ostavi podatke i javljamo ti se sa svim detaljima.</p>

      <form className="panel" style={{ marginTop: 12 }} onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="ime">Ime i prezime</label>
          <input id="ime" value={form.ime} onChange={set('ime')} autoComplete="name" />
          {errors.ime && <div className="field__err">{errors.ime}</div>}
        </div>
        <div className="field">
          <label htmlFor="email">Mejl</label>
          <input id="email" type="email" inputMode="email" value={form.email} onChange={set('email')} autoComplete="email" />
          {errors.email && <div className="field__err">{errors.email}</div>}
        </div>
        <div className="field">
          <label htmlFor="ig">Instagram</label>
          <input id="ig" value={form.instagram} onChange={set('instagram')} placeholder="@nalog" />
          {errors.instagram && <div className="field__err">{errors.instagram}</div>}
        </div>
        <div className="field">
          <label htmlFor="grad">Grad</label>
          <input id="grad" value={form.grad} onChange={set('grad')} />
        </div>
        <div className="field">
          <label htmlFor="poruka">Poruka <span style={{ fontWeight: 400, opacity: .6 }}>(nije obavezno)</span></label>
          <textarea id="poruka" value={form.poruka} onChange={set('poruka')} />
          <div className="field__hint">Pitanja o pravilima, kotizaciji ili bilo šta drugo.</div>
        </div>
        <button className="btn" type="submit">Pošalji prijavu</button>
      </form>
    </section>
  );
}
