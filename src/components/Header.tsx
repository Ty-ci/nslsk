import { sectionIds, sections } from '../App.tsx'
import { useActiveSection } from '../hooks/useActiveSection.ts'
import Button from './Button.tsx'

const Header = () => {
  const activeId = useActiveSection(sectionIds)

  // Brand links to the first section; the last section (Kontakt) gets the CTA
  // button, so the menu shows everything in between.
  const [homeId] = sectionIds
  const contactId = sectionIds[sectionIds.length - 1]
  const menuSections = sections.slice(1, -1)

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-cream/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href={`#${homeId}`} className="flex items-center gap-2.5">
          <span aria-hidden="true" className="text-2xl leading-none text-brand">
            ⚜
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-xl font-bold tracking-wide text-ink uppercase">
              Pripravení viesť
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
              Kandidatúra N-SLSK · 2026
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {menuSections.map((section, i) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`border-2 px-3 py-1.5 font-mono text-xs font-bold tracking-wider uppercase transition-colors ${
                  activeId === section.id
                    ? 'border-ink bg-ink text-cream'
                    : 'border-transparent text-ink/70 hover:border-ink hover:text-ink'
                }`}
              >
                <span className="text-brand">{String(i + 1).padStart(2, '0')}</span> {section.label}
              </a>
            </li>
          ))}
        </ul>

        <Button href={`#${contactId}`} size="sm">
          Podporte nás
        </Button>
      </nav>
    </header>
  )
}

export default Header
