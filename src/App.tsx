import type { ComponentType } from 'react'

import Header from './components/Header.tsx'
import About from './sections/About.tsx'
import Hero from './sections/Hero.tsx'
import Playground from './sections/Playground.tsx'

export type NavSection = {
  id: string
  label: string
  Component: ComponentType
}

export const sections: NavSection[] = [
  { id: 'home', label: 'Home', Component: Hero },
  { id: 'about', label: 'About', Component: About },
  { id: 'playground', label: 'Playground', Component: Playground },
]

const App = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <Header />
    <main>
      <div className="flex flex-col gap-20">
        {sections.map(({ id, Component }, index) => (
          <section
            key={id}
            id={id}
            className={`mx-auto max-w-3xl scroll-mt-20 px-6 py-24${
              index > 0 ? 'border-t border-slate-200' : ''
            }`}
          >
            <Component />
          </section>
        ))}
      </div>
    </main>
  </div>
)

export default App
