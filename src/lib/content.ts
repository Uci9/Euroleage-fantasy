/**
 * Sav tekst sa sajta, na jednom mjestu.
 *
 * Mijenja se ovdje i odmah se vidi na sajtu, bez diranja koda. Sve što piše
 * TODO čeka vaš podatak i na sajtu je označeno narandžastom crtom.
 */

export const BRAND = {
  name: 'EL Fantasy Balkan',
  tagline: 'Igraj. Predviđaj. Osvajaj.',
  sub: 'Fantasy liga za prave ljubitelje evroligaške košarke',
  instagram: 'https://instagram.com/',   // TODO: link vašeg Instagrama
  viber: '',                              // TODO: link Viber grupe
  email: '',                              // TODO: mejl za prijave
};

export const HOME = {
  lead: 'Biraj igrače. Prati rezultate. Takmiči se. Postani legenda.',
};

export const HOW = {
  intro:
    'Fantasy je jednostavan: biraš igrače iz Evrolige u okviru budžeta, ' +
    'a oni ti donose bodove po onome što odigraju na terenu.',
  steps: [
    { title: 'Sastavi tim', text: 'Biraš igrače u okviru budžeta koji svi imaju isti.' },
    { title: 'Prati kolo', text: 'Bodovi se računaju po učinku iz odigranih utakmica.' },
    { title: 'Mijenjaj', text: 'Poslije svakog kola imaš ograničen broj transfera.' },
    { title: 'Penji se', text: 'Zbir bodova kroz sezonu određuje mjesto na tabeli lige.' },
  ],
};

export const RULES = {
  facts: [
    { label: 'Kotizacija', value: 'TODO' },
    { label: 'Broj mjesta', value: 'TODO' },
    { label: 'Trajanje', value: 'Cijela sezona' },
    { label: 'Prijave', value: 'Otvorene' },
  ],
  list: [
    'TODO — pravilo o sastavljanju tima i budžetu.',
    'TODO — pravilo o transferima po kolu.',
    'TODO — kako se računaju bodovi i šta se dešava kod izjednačenja.',
    'TODO — rok za prijavu i uplatu kotizacije.',
  ],
  prizes: [
    { place: '1.', prize: 'TODO' },
    { place: '2.', prize: 'TODO' },
    { place: '3.', prize: 'TODO' },
  ],
};

/** Tekst iz vašeg "Ko smo mi" postera. */
export const ABOUT = {
  title: 'Ko smo mi?',
  points: [
    'Mi smo **EL Fantasy Balkan** – nezavisna Fantasy liga stvorena iz čiste ljubavi prema evroligaškoj košarci.',
    'Okupljamo ljubitelje Fantasy-ja sa **Balkana** i širom Evrope u jednoj **kvalitetnoj i fer ligi**.',
    'Svake sedmice donosimo **analize, savjete i statistike** kako biste lakše birali tim i igrače.',
    'Želimo da izgradimo **sportsku, prijateljsku i takmičarsku** zajednicu u kojoj se svi osjećaju dobrodošlo.',
    'Broj mjesta je ograničen, nagrade su vrijedne, a atmosfera prava – **balkanska**.',
  ],
  signoff: 'Vaš, EL Fantasy Balkan tim',
};
