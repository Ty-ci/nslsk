import type { ComponentType } from 'react'

import Hero from './sections/Hero.tsx'
import Kandidati from './sections/Kandidati.tsx'
import Kontakt from './sections/Kontakt.tsx'
import Program from './sections/Program.tsx'
import Temy from './sections/Temy.tsx'

export type NavSection = {
  id: string
  label: string
  Component: ComponentType
}

// Single source of truth for the one-pager: the nav menu, the section shells on
// the home page, and the scroll-spy all derive from this list. Add a section by
// writing a component and adding one entry here.
export const sections: NavSection[] = [
  { id: 'uvod', label: 'Úvod', Component: Hero },
  { id: 'kandidati', label: 'Kandidáti', Component: Kandidati },
  { id: 'temy', label: 'Spoločné témy', Component: Temy },
  { id: 'program', label: 'Program', Component: Program },
  { id: 'stretnutia', label: 'Stretnutia', Component: Kontakt },
  // { id: 'plan', label: 'Za 3 roky', Component: Plan },
  // { id: 'chystame', label: 'Chystáme', Component: Chystame },
]

// Stable reference (module scope) so the scroll-spy effect doesn't re-run.
export const sectionIds = sections.map((section) => section.id)

/** The Q&A page — the one route that lives outside the one-pager. */
export const qaPath = '/otazky'

/** Link to a home-page section, from anywhere in the app. */
export const sectionPath = (id: string) => `/#${id}`
