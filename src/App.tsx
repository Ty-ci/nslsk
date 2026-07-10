import type { ComponentType } from 'react'

import Header from './components/Header.tsx'
import Data from './sections/Data.tsx'
import Hero from './sections/Hero.tsx'
import Kandidati from './sections/Kandidati.tsx'
import Kontakt from './sections/Kontakt.tsx'
import Program from './sections/Program.tsx'
import Snem from './sections/Snem.tsx'
import Vizia from './sections/Vizia.tsx'

export type NavSection = {
  id: string
  label: string
  Component: ComponentType
}

// Single source of truth for the page: the nav menu, the section shells below,
// and the scroll-spy all derive from this list. Add a section by writing a
// component and adding one entry here.
export const sections: NavSection[] = [
  { id: 'uvod', label: 'Úvod', Component: Hero },
  { id: 'kandidati', label: 'Kandidáti', Component: Kandidati },
  { id: 'program', label: 'Program', Component: Program },
  { id: 'data', label: 'Dáta', Component: Data },
  { id: 'vizia', label: 'Vízia 2030', Component: Vizia },
  { id: 'snem', label: 'Snem a voľby', Component: Snem },
  { id: 'kontakt', label: 'Kontakt', Component: Kontakt },
]

// Stable reference (module scope) so the scroll-spy effect doesn't re-run.
export const sectionIds = sections.map((section) => section.id)

const App = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      {sections.map(({ id, Component }) => (
        <section key={id} id={id} className="scroll-mt-24">
          <Component />
        </section>
      ))}
    </main>
  </div>
)

export default App
