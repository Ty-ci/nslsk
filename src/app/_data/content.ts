// Obsah stránky. Jediný zdroj pravdy — sekcie nič netextujú samé.
//
// Vychádza z dokumentu „NSLSK 2026 Web content.md". Kde autori obsah ešte
// nedoplnili, položka nesie `tbd: true` a na stránke sa vykreslí ako viditeľné
// prázdne miesto, nie ako vymyslený text.

export type Link = {
  label: string
  href: string
}

export type CandidateTopic = {
  title: string
  /** Jednoveršový claim alebo krátky opis témy. */
  summary: string
  link?: Link
}

export type Candidate = {
  /** Skautská prezývka — kandidáti vystupujú pod ňou. */
  name: string
  fullName: string
  initials: string
  /** ID súboru fotky na Google Drive. */
  photoId: string
  /** Kandidačný formulár (PDF na Google Drive). */
  formHref: string
  position: string
  topics: CandidateTopic[]
}

export const candidates: Candidate[] = [
  {
    name: 'Funko',
    fullName: 'Filip Košťál',
    initials: 'F',
    photoId: '16yxMPASGVYHuDuVmm3ThvbNuosrfkrDD',
    formHref: 'https://drive.google.com/file/d/1x8DrW7r1LIvxVJ9FkdSD-IhQ20Y-JPMB/view',
    position: 'Náčelník',
    topics: [
      {
        title: 'Stratégia',
        summary: 'Dosiahnuť 10 000 mladých ľudí do roku 2030.',
        link: {
          label: 'Stratégia',
          href: 'https://docs.google.com/document/d/1CSNRBuMh1USVB7ETtUCtbhpiOFWTwVMb/edit',
        },
      },
      {
        title: 'Dopad skautingu',
        summary: 'Vybudovať systém merania dopadu v SLSK.',
        link: {
          label: 'Dopad skautingu',
          href: 'https://docs.google.com/document/d/1iZt6aFal-bvZhEkefPeT3W_KDsfRvTDK/edit',
        },
      },
    ],
  },
  {
    name: 'Green',
    fullName: 'Miroslav Hrivňák',
    initials: 'G',
    photoId: '1fwfJpUWjqJJMScLZLCuoFOnTLOmsI8o0',
    formHref: 'https://drive.google.com/file/d/11flWPAmeNBmdgGYUfIZ5HPxNSCuJlcd2/view',
    position: 'Člen Náčelníctva',
    topics: [
      {
        title: 'Vzdelávanie a výchova',
        summary: 'Program pre oblasť vzdelávania a výchovy v SLSK.',
        link: {
          label: 'Vzdelávanie a výchova',
          href: 'https://docs.google.com/document/d/1xUZGdL2gU7zxej61dPA_UZVC8Qpr6NSg/edit?rtpof=true',
        },
      },
      {
        title: 'Hierarchia, procesy a dokumenty',
        summary: 'Prehľadné procesy a dokumenty, o ktoré sa dá oprieť.',
        link: {
          label: 'Hierarchia, procesy a dokumenty',
          href: 'https://docs.google.com/document/d/1EOiN-de27auVEO565S6U6oPLGZbBE_lo/edit',
        },
      },
    ],
  },
  {
    name: 'Zved',
    fullName: 'Patrik Kralovič',
    initials: 'Z',
    photoId: '19_IvUfZ5L9cgwvfIYnATnV-uaitDkEn_',
    formHref: 'https://drive.google.com/file/d/1Y9I8mwHqxT4kDT8Bm6NQVGtysZFmi3en/view',
    position: 'Člen Náčelníctva',
    topics: [
      {
        title: 'Rast a podpora dospelých',
        summary: 'Počúvame zbory. Prinášame skauting tam, kde chýba.',
        link: {
          label: 'Rast a podpora dospelých',
          href: 'https://docs.google.com/document/d/1p1N3FM4fxTfokPMAELnEAEXfqU2aGnCF/edit',
        },
      },
    ],
  },
  {
    name: 'Žubro',
    fullName: 'Matej Hodas',
    initials: 'Ž',
    photoId: '1SYS5szJQYXgZKZxIqBkRw6INqO92YG1q',
    formHref: 'https://drive.google.com/file/d/1txrNWSUpeUwZzWUlDLEWeL44VK9JZog0/view',
    position: 'Člen Náčelníctva',
    topics: [
      {
        title: 'Financie a fundraising',
        summary: 'Premeniť krehkú stabilitu na finančnú odolnosť.',
        link: {
          label: 'Podklady k téme',
          href: 'https://docs.google.com/document/d/1kG7Y0p6mZVACTpYOPmfp5_qsJ2D1P29_/edit',
        },
      },
    ],
  },
]

/** Fotka z Google Drive použiteľná ako `img src` (funguje pre verejné súbory). */
export const photoUrl = (photoId: string) =>
  `https://drive.google.com/thumbnail?id=${photoId}&sz=w800`

export type SharedTopic = {
  title: string
  body: string
  link?: Link
}

// Spoločné témy — to, za čím si stojíme ako celý tím.
export const sharedTopics: SharedTopic[] = [
  {
    title: 'Systémové meranie nášho dopadu',
    body: 'Skauting rozvíja kompetencie a prináša obrovskú hodnotu spoločnosti, no potrebujeme to vedieť doložiť. Zavedieme rámec merania dopadu integrovaný do existujúcich procesov, vďaka čomu vytvoríme framework, ktorý vie posilniť fundraising a advokáciu a pomôže nám pri reflektovaní našej výchovy.',
  },
  {
    title: 'Postavené na hodnotách a dátach',
    body: 'Vytvoríme systém, v ktorom budeme stavať rozhodnutia Náčelníctva a Ústredia na dátach a zisteniach, pričom na ne budeme nazerať cez skautské hodnoty. Jednotlivé rozhodnutia musia byť prepojené na víziu a poslanie SLSK.',
  },
  {
    title: 'Podporná štruktúra Náčelníctva SLSK',
    body: 'Okolo Náčelníctva vytvoríme odborný podporný kruh, ktorého úlohou bude spracovávať a analyzovať témy a prinášať historický kontext pre N-SLSK.',
  },
  {
    title: 'Transparentná komunikácia',
    body: 'Zabezpečíme, aby boli všetky kľúčové rozhodnutia komunikované včas, zrozumiteľne a s jasným vysvetlením širšieho kontextu či dát.',
  },
  {
    title: 'Proaktívna organizácia',
    body: 'Budeme aktívne sledovať spoločenské trendy a meniace sa potreby, aby sme na nové skutočnosti ako organizácia vedeli reagovať s dostatočným predstihom. Chceme byť pripravení na nové výzvy skôr, než sa z nich stanú krízové situácie, a poskytovať tak členom stabilné a bezpečné zázemie.',
  },
  {
    title: 'Princíp subsidiarity',
    body: 'Rozhodnutia sa budú prijímať na najnižšej možnej úrovni, ktorá je na to kompetentná a pripravená.',
  },
  {
    title: 'AI v organizácii',
    body: 'Pre organizáciu Slovenský skauting ako celok nastavíme jasnú koncepciu využívania umelej inteligencie. Na národnej úrovni s jej pomocou zautomatizujeme byrokraciu a do programu v oddieloch prinesieme témy digitálnej gramotnosti, aby naši členovia zostali samostatnými a tvorivými lídrami.',
  },
  {
    title: 'Inklúzia',
    body: 'Vyhodnotíme aktuálny projekt zameraný na LGBTI+ členov a na jeho základe nastavíme nový, komplexný projekt inklúzie pre organizáciu. Proces tvorby bude transparentný a zabezpečí jednotný a koncepčný prístup.',
  },
]

export type Milestone = {
  /** Časový horizont, napr. „Prvých 100 dní" alebo „1 rok". */
  horizon: string
  /** Krátky doplnok pod horizontom, napr. rok. */
  note?: string
  body?: string
  tbd?: boolean
}

// Čo chceme dosiahnuť — obsah dopĺňajú kandidáti, míľniky sú už dané.
export const milestones: Milestone[] = [
  { horizon: 'Prvých 100 dní', note: 'do konca 2026', tbd: true },
  { horizon: '1 rok', note: '2027', tbd: true },
  { horizon: '2 roky', note: '2028', tbd: true },
  { horizon: '3 roky', note: '2029', tbd: true },
]

// Termíny stretnutí (sekcia „Stretnime sa") sa už netextujú tu — kandidáti ich
// dopĺňajú do listu „eventy" v tabuľke k dotazníku a stránka ich číta priebežne.
// Pozri `src/app/_lib/sheetContent.ts` a `src/app/_services/sheets.ts`.

export const contact = {
  intro:
    'Radi by sme vám osobne (alebo aspoň cez obrazovky) odprezentovali náš program a víziu, s ktorou do toho ideme. Ešte dôležitejšie pre nás ale je počuť *váš* pohľad a spätnú väzbu.',
  questions: [
    'Čo vám v návrhu dáva zmysel?',
    'Kde naopak vidíte riziká?',
    'Čo by podľa vás malo byť pre Slovenský skauting naozaj dôležité?',
  ],
  /** Doplniť: mail alebo dotazník na prihlásenie sa na stretnutie. */
  email: undefined as string | undefined,
  formHref: undefined as string | undefined,
}

/** Odkaz na dokument s kompletným programom — doplniť po dokončení. */
export const programDocHref: string | undefined = undefined

// Otázky a odpovede. Otázky prichádzajú cez dotazník, odpovede píšeme do
// tabuľky a stránka ich zverejní, keď v riadku zaškrtneme „Zverejniť?".
export const qa = {
  formHref:
    'https://docs.google.com/forms/d/e/1FAIpQLSe7S5Or67qtApl25sZHoVvC1nO9BtIrim8gD9zcxCaw6joyDQ/viewform',
  intro:
    'Ak vám v našom programe niečo nie je jasné, alebo s niečím nesúhlasíte, napíšte nám. Otázky zbierame cez krátky dotazník a odpovede zverejňujeme tu — aby odpoveď dostal každý, koho to zaujíma, nie iba ten, kto sa spýtal.',
  /** Poznámka pod dotazníkom — čo sa s otázkou stane. */
  formNote:
    'Otázku môžete poslať aj anonymne. Zverejňujeme len otázky, ku ktorým máme váš súhlas, a meno pripíšeme iba vtedy, keď ste v dotazníku povedali, že môžeme.',
}
