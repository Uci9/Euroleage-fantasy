/**
 * Sav tekst sa sajta, na jednom mjestu.
 *
 * Vi šaljete tekstove i logo — ovdje se mijenja i odmah se vidi na sajtu,
 * bez diranja koda. Sve što piše TODO je privremeno i čeka vaš tekst.
 */

export const BRAND = {
  name: 'EuroLeague Fantasy Balkan',
  short: 'EFB',
  tagline: 'Fantasy liga za one koji EuroLigu prate ozbiljno.',
  instagram: 'https://instagram.com/',   // TODO: vaš Instagram
  email: '',                              // TODO: mejl za prijave
};

export const HOME = {
  lead:
    'Napravi svoj tim, prati kola i takmiči se sa ekipom sa Balkana. ' +
    'Sve na jednom mjestu — pravila, tabela i raspored.',
  points: [
    'Nova liga svake sezone',
    'Nagrade za prva tri mjesta',
    'Bodovanje po zvaničnoj EuroLeague statistici',
  ],
};

export const FANTASY = {
  intro:
    'Fantasy je jednostavan: biraš igrače iz EuroLige u okviru budžeta, ' +
    'a oni ti donose bodove po onome što odigraju na terenu.',
  steps: [
    { title: 'Sastavi tim', text: 'Biraš igrače u okviru budžeta koji svi imaju isti.' },
    { title: 'Prati kolo', text: 'Bodovi se računaju po učinku (PIR) iz odigranih utakmica.' },
    { title: 'Mijenjaj', text: 'Poslije svakog kola imaš ograničen broj transfera.' },
    { title: 'Penji se', text: 'Zbir bodova kroz sezonu određuje mjesto na tabeli lige.' },
  ],
  // TODO: ovdje ide vaš izbor igrača za tekuće kolo
  picks: [
    { name: 'TODO — ime igrača', team: 'Klub', why: 'Zašto ga preporučujete ovo kolo.' },
    { name: 'TODO — ime igrača', team: 'Klub', why: 'Zašto ga preporučujete ovo kolo.' },
    { name: 'TODO — ime igrača', team: 'Klub', why: 'Zašto ga preporučujete ovo kolo.' },
  ],
};

export const LEAGUE = {
  intro: 'Naša liga se igra kroz cijelu sezonu EuroLige.',
  facts: [
    { label: 'Kotizacija', value: 'TODO' },
    { label: 'Broj igrača', value: 'TODO' },
    { label: 'Trajanje', value: 'Cijela sezona' },
    { label: 'Prijave', value: 'Otvorene' },
  ],
  rules: [
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

export const ABOUT = {
  // TODO: ovdje ide vaš tekst o vama
  text: [
    'TODO — ko ste vi i zašto ste pokrenuli ligu.',
    'TODO — kako da vas ljudi kontaktiraju i šta mogu očekivati.',
  ],
};
