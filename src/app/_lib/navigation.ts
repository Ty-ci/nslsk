// Single source of truth for the one-pager: the nav menu, the section shells on
// the page and the scroll-spy all derive from this list. Add a section by adding
// an entry here and wiring its component up in `src/app/(pages)/dev/page.tsx` —
// the `Record<SectionId, …>` there makes TypeScript insist on it.
//
// Deliberately holds no component imports: the header is a client component, so
// anything this module pulls in would be shipped to the browser with it.

export const sections = [
  { id: 'uvod', label: 'Úvod' },
  { id: 'kandidati', label: 'Kandidáti' },
  { id: 'temy', label: 'Spoločné témy' },
  { id: 'program', label: 'Program' },
  { id: 'spojme-sa', label: 'Spojme sa' },
] as const

export type NavSection = (typeof sections)[number]

/** The id of a page section, e.g. `'temy'`. */
export type SectionId = NavSection['id']

/** Stable reference (module scope) so the scroll-spy effect doesn't re-run. */
export const sectionIds: SectionId[] = sections.map((section) => section.id)

/**
 * The Q&A block inside „Spojme sa". It has an anchor of its own because it used
 * to be a page (`/otazky`) and is the half of that section people link to.
 */
export const qaAnchor = 'otazky'

/** Anything on the page that can be linked to. */
export type AnchorId = SectionId | typeof qaAnchor

/**
 * A link to an anchor on the page. Hash-only on purpose: the browser resolves
 * it against the URL currently open, so every anchor keeps working wherever the
 * one-pager is mounted — today `/dev`, later `/` — with no link to update.
 * Never write `/#id`: that pins the anchor to the root route.
 */
export const anchorHref = (id: AnchorId) => `#${id}`
