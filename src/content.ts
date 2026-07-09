// Mock obsah pre promo stránku kandidátov do Náčelníctva SLSK.
// Údaje vychádzajú zo Stratégie 2030 a Formulára pre kandidáta (Rokovací
// poriadok, Príloha č. 01). Mená a zbory sú vymyslené.

export type Candidate = {
  name: string
  /** Skautské meno (prezývka). */
  scoutName: string
  /** Kandidovaná funkcia podľa Rokovacieho poriadku. */
  role: string
  /** Skautský zbor. */
  troop: string
  /** Preferované témy v N-SLSK. */
  focus: string
  bio: string
  initials: string
}

export const candidates: Candidate[] = [
  {
    name: 'Zuzana Hrušková',
    scoutName: 'Líška',
    role: 'Kandidátka na náčelníčku SLSK',
    troop: '14. zbor Prameň Žilina',
    focus: 'Vízia, vedenie tímu, spolupráca oblastí',
    bio: 'Devätnásť rokov v skautingu, z toho osem vo vedení oblasti. Verí, že dobrá vízia sa rodí zdola — z klubovní a táborov, nie od stola.',
    initials: 'ZH',
  },
  {
    name: 'Martin Kováč',
    scoutName: 'Bobor',
    role: 'Kandidát na člena N-SLSK',
    troop: '5. zbor Bratislava',
    focus: 'Stabilné zázemie, táboriská a financie',
    bio: 'Roky sa stará o zborovú chatu a rozpočet. Chce, aby každý zbor mal isté zázemie a viac než jeden zdroj príjmov.',
    initials: 'MK',
  },
  {
    name: 'Barbora Lukáčová',
    scoutName: 'Sova',
    role: 'Kandidátka na členku N-SLSK',
    troop: '51. zbor Kremeň Košice',
    focus: 'Spokojní dobrovoľníci a vzdelávanie',
    bio: 'Inštruktorka na lesných školách. Zameriava sa na to, aby vedúci nevyhoreli a mali komu odovzdať svoju prácu.',
    initials: 'BL',
  },
  {
    name: 'Tomáš Beňo',
    scoutName: 'Rys',
    role: 'Kandidát na člena N-SLSK',
    troop: '32. zbor Tatran Poprad',
    focus: 'Cielená komunikácia a výchovný program',
    bio: 'Venuje sa komunikácii a programu pre družiny. Chce, aby o skautingu vedeli aj tam, kde ešte klubovňu nemáme.',
    initials: 'TB',
  },
]

export type Priority = {
  number: string
  title: string
  summary: string
  goal: string
}

export const priorities: Priority[] = [
  {
    number: '01',
    title: 'Stabilné zázemie a zdroje',
    summary:
      'Táboriská, klubovne a chaty na pravidelnú činnosť, s dlhodobo udržateľným a diverzifikovaným financovaním na národnej aj regionálnej úrovni.',
    goal: '3 nové táboriská a 5 nových priestorov s dlhodobým zázemím do roku 2030.',
  },
  {
    number: '02',
    title: 'Spokojní dobrovoľníci',
    summary:
      'Dobrovoľníci nachádzajú v práci pre organizáciu zmysel, dokážu odhadnúť svoje možnosti a pripravujú priestor pre svojich nasledovníkov.',
    goal: 'Jasný cyklus dobrovoľníka a udržateľný systém obmeny na každej úrovni.',
  },
  {
    number: '03',
    title: 'Cielená komunikácia',
    summary:
      'Jasný a pozitívny obraz o skautingu navonok, efektívna a obojstranná komunikácia dnu. Dôveryhodný partner pre rodičov aj inštitúcie.',
    goal: 'Aspoň 10 % detí v lokalitách so zbormi pozná skauting a jeho prínos.',
  },
  {
    number: '04',
    title: 'Hodnotová výchova mladých ľudí',
    summary:
      'Vychovávame k pevnému charakteru a pripravenosti na život — v prírode, v meste aj v spoločnosti. Skautské hodnoty vieme odovzdávať ďalej.',
    goal: 'Výchova cez sľub a zákon: čestnosť, rešpekt, starostlivosť, odvaha.',
  },
]

export type Stat = {
  value: string
  label: string
}

export const visionStats: Stat[] = [
  { value: '10 000', label: 'nadšených mladých ľudí do roku 2030' },
  { value: '4', label: 'priority Stratégie 2030' },
  { value: '2024 – 2030', label: 'obdobie napĺňania vízie' },
  { value: 'WOSM a WAGGGS', label: 'sme súčasťou svetového skautingu' },
]
