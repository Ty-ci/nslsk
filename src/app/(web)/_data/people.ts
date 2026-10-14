// The Náčelníctvo SLSK 2026–2029: who holds which area. Shared by the homepage
// and the onboarding checklist, whose sheet has one column per person, headed
// with the nickname below (matched without case or diacritics).

export const people = [
  // { key: 'funo', nickname: 'Funo', area: 'Náčelník SLSK' },
  // { key: 'barca', nickname: 'Barča', area: 'Výchova a vzdelávanie' },
  // { key: 'biely-medved', nickname: 'Biely Medveď', area: 'Procesy, dokumenty, hierarchia' },
  // { key: 'green', nickname: 'Green', area: 'Komunikácia a partnerstvá' },
  // { key: 'kolohnath', nickname: 'Kolohnáth', area: 'Dospelí a rast' },
  // { key: 'zved', nickname: 'Zved', area: 'Financie a fundraising' },
  // { key: 'zubro', nickname: 'Žubro', area: 'Stratégia' },
  { key: 'funo', nickname: 'Funo', area: 'Náčelník SLSK' },
  { key: 'barca', nickname: 'Barča', area: '...' },
  { key: 'biely-medved', nickname: 'Biely Medveď', area: '...' },
  { key: 'green', nickname: 'Green', area: '...' },
  { key: 'kolohnath', nickname: 'Kolohnáth', area: '...' },
  { key: 'zved', nickname: 'Zved', area: '...' },
  { key: 'zubro', nickname: 'Žubro', area: '...' },
] as const

export type Person = (typeof people)[number]
export type PersonKey = Person['key']

export const isPersonKey = (value: unknown): value is PersonKey =>
  people.some((person) => person.key === value)
