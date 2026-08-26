/**
 * Every piece of text on the site, in one place.
 *
 * Change it here and it appears on the site — no code to touch. Anything
 * marked TODO is waiting on your details and is flagged on the site itself.
 */

export const BRAND = {
  name: 'EL Fantasy Balkan',
  tagline: 'Play. Predict. Win.',
  sub: 'Fantasy league for true EuroLeague basketball fans',
  instagram: 'https://instagram.com/',   // TODO: your Instagram link
  viber: '',                              // TODO: Viber group invite link
  email: '',                              // TODO: contact address
};

export const HOME = {
  lead: 'Pick your players. Follow the results. Compete. Become a legend.',
};

export const HOW = {
  intro:
    'Fantasy is simple: you pick EuroLeague players within a budget, and they ' +
    'score you points for what they actually do on the court.',
  steps: [
    { title: 'Build your team', text: 'Pick players within a budget every manager shares.' },
    { title: 'Follow the round', text: 'Points come from what your players produce in real games.' },
    { title: 'Make transfers', text: 'After each round you get a limited number of changes.' },
    { title: 'Climb the table', text: 'Your total across the season decides where you finish.' },
  ],
};

export const RULES = {
  facts: [
    { label: 'Entry fee', value: '15 EUR' },
    { label: 'Places', value: 'TODO' },
    { label: 'Registration', value: 'Until the season starts' },
    { label: 'Status', value: 'Open' },
  ],
  list: [
    'The entry fee is 15 EUR, paid once for the whole season.',
    'Registration closes when the season starts — after that no new managers join.',
    'TODO — squad and budget rule.',
    'TODO — transfers per round.',
    'TODO — how points are scored and how ties are settled.',
  ],
  prizes: [
    { place: '1', prize: 'TODO' },
    { place: '2', prize: 'TODO' },
    { place: '3', prize: 'TODO' },
  ],
};

export const ABOUT = {
  lead:
    'We are EL Fantasy Balkan — an independent fantasy league, started out of ' +
    'nothing but love for EuroLeague basketball.',
  points: [
    {
      title: 'One league, one region',
      text: 'We bring fantasy players from the Balkans and across Europe together in a league that is competitive and fair.',
    },
    {
      title: 'Analysis every week',
      text: 'Every week we publish analysis, tips and statistics, so picking your team and your players is easier.',
    },
    {
      title: 'A community, not a scoreboard',
      text: 'We want a sporting, friendly and competitive community where everybody is made welcome.',
    },
    {
      title: 'Limited places',
      text: 'Places are limited, the prizes are worth playing for, and the atmosphere is the real thing — Balkan.',
    },
  ],
  signoff: 'Yours, the EL Fantasy Balkan team',
};
