import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useActiveSection } from '../hooks/useActiveSection.ts'
import { qaPath, sectionIds, sectionPath, sections } from '../navigation.ts'
import Button from './Button.tsx'

const chip = 'block border-2 px-3 py-1.5 label transition-colors'
const chipOn = 'border-ink bg-ink text-cream'
const chipOff = 'border-transparent text-ink/70 hover:border-ink hover:text-ink'

type SectionLinkProps = {
  id: string
  /** On the one-pager an anchor scrolls; elsewhere it has to be a route. */
  isHome: boolean
  className?: string
  'aria-label'?: string
  children: ReactNode
}

// The nav points at sections of the home page, so from the Q&A subpage the same
// item has to navigate first and scroll after (`Home` handles the hash).
const SectionLink = ({
  id,
  isHome,
  className = '',
  'aria-label': ariaLabel,
  children,
}: SectionLinkProps) =>
  isHome ? (
    <a href={`#${id}`} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ) : (
    <Link to={sectionPath(id)} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  )

const Header = () => {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
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
        <SectionLink
          id={homeId}
          isHome={isHome}
          className="flex items-center gap-2.5"
          aria-label="Spolu do toho — kandidatúra do N-SLSK 2026"
        >
          <img src="/favicon.svg" alt="" aria-hidden="true" className="w-7 shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-xl font-bold tracking-wide text-ink uppercase">
              Spolu do toho
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase sm:block">
              Kandidatúra N-SLSK · 2026
            </span>
          </span>
        </SectionLink>

        <ul className="hidden items-center gap-1 lg:flex">
          {menuSections.map((section) => (
            <li key={section.id}>
              <SectionLink
                id={section.id}
                isHome={isHome}
                className={`${chip} ${isHome && activeId === section.id ? chipOn : chipOff}`}
              >
                <span
                  className={isHome && activeId === section.id ? 'text-brand' : 'text-brand/80'}
                >
                  {section.number}
                </span>{' '}
                {section.label}
              </SectionLink>
            </li>
          ))}
        </ul>

        {/* The Q&A page stays reachable at every width — it is the one place on
            the site where visitors can talk back. */}
        <div className="flex shrink-0 items-center gap-2">
          <Link to={qaPath} className={`${chip} ${pathname === qaPath ? chipOn : chipOff}`}>
            Otázky
          </Link>

          {isHome ? (
            <Button href="#stretnutia" variant="sun" size="sm">
              Stretnime sa
            </Button>
          ) : (
            <Button to={sectionPath('stretnutia')} variant="sun" size="sm">
              Stretnime sa
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
