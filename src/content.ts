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

// ── Ilustračné dáta pre sekciu „Rozhodujeme podľa dát" ──────────────────────
// Vymyslené, ale realisticky vyzerajúce časové rady 2019 – 2026: členská
// základňa (s prepadom počas pandémie a následným rastom smerom k vízii 10 000),
// zakladanie nových zborov a udržanie vedúcich. Každá metrika sa v grafe
// zobrazuje samostatne, prepínaním záložiek.

export type MetricColor = 'brand' | 'forest' | 'ink'

export type SeriesPoint = {
  year: string
  value: number
}

export type Metric = {
  id: string
  /** Krátky text na prepínacom tlačidle. */
  tab: string
  /** Plný názov metriky. */
  label: string
  /** Jednotka za hodnotou, napr. „členov" alebo „%". */
  unit: string
  /** Spot farba série. */
  color: MetricColor
  /** Voliteľný cieľ (vykreslí sa ako horizontálna méta v grafe). */
  target?: number
  /** Rozhodnutie, ktoré z dát vyplýva — pointa celej sekcie. */
  insight: string
  points: SeriesPoint[]
}

export const metrics: Metric[] = [
  {
    id: 'clenovia',
    tab: 'Členovia',
    label: 'Členská základňa',
    unit: 'členov',
    color: 'brand',
    target: 10000,
    insight:
      'Po prepade počas pandémie rastieme štvrtý rok po sebe. Do vízie 10 000 nám chýbajú približne 3 % — preto tlačíme na nábor a udržanie.',
    points: [
      { year: '2019', value: 8100 },
      { year: '2020', value: 7600 },
      { year: '2021', value: 7400 },
      { year: '2022', value: 7900 },
      { year: '2023', value: 8500 },
      { year: '2024', value: 9050 },
      { year: '2025', value: 9400 },
      { year: '2026', value: 9700 },
    ],
  },
  {
    id: 'zbory',
    tab: 'Nové zbory',
    label: 'Novozaložené zbory za rok',
    unit: 'nových zborov',
    color: 'forest',
    insight:
      'Zakladanie nových zborov zrýchľuje. Ukazuje sa, že investícia do zázemia a metodickej podpory sa vracia — v tomto tempe chceme pokračovať.',
    points: [
      { year: '2019', value: 2 },
      { year: '2020', value: 1 },
      { year: '2021', value: 1 },
      { year: '2022', value: 3 },
      { year: '2023', value: 4 },
      { year: '2024', value: 5 },
      { year: '2025', value: 6 },
      { year: '2026', value: 7 },
    ],
  },
  {
    id: 'udrzanie',
    tab: 'Udržanie vedúcich',
    label: 'Udržanie vedúcich medzi rokmi',
    unit: '%',
    color: 'ink',
    target: 85,
    insight:
      'Menej vyhorených vedúcich znamená stabilnejšie oddiely. Sledujeme to každý rok — cieľ je dostať sa a udržať nad 80 %.',
    points: [
      { year: '2019', value: 72 },
      { year: '2020', value: 69 },
      { year: '2021', value: 66 },
      { year: '2022', value: 70 },
      { year: '2023', value: 74 },
      { year: '2024', value: 77 },
      { year: '2025', value: 79 },
      { year: '2026', value: 81 },
    ],
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
