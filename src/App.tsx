import type { ComponentType } from 'react'

import Footer from './components/Footer.tsx'
import Header from './components/Header.tsx'
import Chystame from './sections/Chystame.tsx'
import Hero from './sections/Hero.tsx'
import Kandidati from './sections/Kandidati.tsx'
import Kontakt from './sections/Kontakt.tsx'
import Plan from './sections/Plan.tsx'
import Program from './sections/Program.tsx'
import Temy from './sections/Temy.tsx'

export type NavSection = {
  id: string
  label: string
  Component: ComponentType
}

// Single source of truth for the page: the nav menu, the section shells below,
// and the scroll-spy all derive from this list. Add a section by writing a
// component and adding one entry here. The intro's printed index ("02 /") is the
// section's position in this list, so keep them in sync when reordering.
export const sections: NavSection[] = [
  { id: 'uvod', label: 'Úvod', Component: Hero },
  { id: 'kandidati', label: 'Kandidáti', Component: Kandidati },
  { id: 'temy', label: 'Spoločné témy', Component: Temy },
  { id: 'program', label: 'Program', Component: Program },
  { id: 'plan', label: 'Za 3 roky', Component: Plan },
  { id: 'stretnutia', label: 'Stretnutia', Component: Kontakt },
  { id: 'chystame', label: 'Chystáme', Component: Chystame },
]

// Stable reference (module scope) so the scroll-spy effect doesn't re-run.
export const sectionIds = sections.map((section) => section.id)

const App = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      {sections.map(({ id, Component }) => (
        <section key={id} id={id} className="scroll-mt-20">
          <Component />
        </section>
      ))}
    </main>
    <Footer />
  </div>
)

export default App
