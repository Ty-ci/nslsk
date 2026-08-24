// Single source of truth for the one-pager: the nav menu, the section shells on
// the home page and the scroll-spy all derive from this list. Add a section by
// adding an entry here and wiring its component up in `src/app/page.tsx` — the
// `Record<SectionId, …>` there makes TypeScript insist on it.
//
// Deliberately holds no component imports: the header is a client component, so
// anything this module pulls in would be shipped to the browser with it.

export const sections = [
  { id: 'uvod', label: 'Úvod' },
  { id: 'kandidati', label: 'Kandidáti' },
  { id: 'temy', label: 'Spoločné témy' },
  { id: 'program', label: 'Program' },
  { id: 'stretnutia', label: 'Stretnutia' },
] as const

export type NavSection = (typeof sections)[number]

/** The id of a home-page section, e.g. `'temy'`. */
export type SectionId = NavSection['id']

/** Stable reference (module scope) so the scroll-spy effect doesn't re-run. */
export const sectionIds: SectionId[] = sections.map((section) => section.id)

/** The Q&A page — the one route that lives outside the one-pager. */
export const qaPath = '/otazky'

/** Link to a home-page section, from anywhere in the app. */
export const sectionPath = (id: SectionId) => `/#${id}`
