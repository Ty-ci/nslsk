import { sectionIds, sections } from '../App.tsx'
import { useActiveSection } from '../hooks/useActiveSection.ts'
import Button from './Button.tsx'

const Header = () => {
  const activeId = useActiveSection(sectionIds)

  // Brand links to the first section; the meetings section gets the CTA, so the
  // menu shows everything else. `number` is the printed index of the section, so
  // the nav reads like the contents line of a poster.
  const [homeId] = sectionIds
  const menuSections = sections
    .map((section, i) => ({ ...section, number: String(i).padStart(2, '0') }))
    .filter((section) => section.id !== homeId && section.id !== 'stretnutia')

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-cream/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a
          href={`#${homeId}`}
          aria-label="Spolu do toho — kandidatúra do N-SLSK 2026"
          className="flex items-center gap-2.5"
        >
          <img src="/favicon.svg" alt="" aria-hidden="true" className="w-7 shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-xl font-bold tracking-wide text-ink uppercase">
              Spolu do toho
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
              Kandidatúra N-SLSK · 2026
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {menuSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block border-2 px-3 py-1.5 label transition-colors ${
                  activeId === section.id
                    ? 'border-ink bg-ink text-cream'
                    : 'border-transparent text-ink/70 hover:border-ink hover:text-ink'
                }`}
              >
                <span className={activeId === section.id ? 'text-brand' : 'text-brand/80'}>
                  {section.number}
                </span>{' '}
                {section.label}
              </a>
            </li>
          ))}
        </ul>

        <Button href="#stretnutia" variant="sun" size="sm" className="shrink-0">
          Stretnime sa
        </Button>
      </nav>
    </header>
  )
}

export default Header
