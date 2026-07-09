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
    <header className="sticky top-0 z-20 border-b border-navy/10 bg-cream/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a
          href={`#${homeId}`}
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-wide text-navy uppercase"
        >
          <span aria-hidden="true" className="text-2xl leading-none text-brand">
            ⚜
          </span>
          Pripravení viesť
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {menuSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeId === section.id
                    ? 'bg-navy text-white'
                    : 'text-navy/70 hover:bg-navy/5 hover:text-navy'
                }`}
              >
                {section.label}
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
