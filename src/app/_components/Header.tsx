'use client'

import Button from '@/app/_components/Button'
import { useActiveSection } from '@/app/_hooks/useActiveSection'
import { anchorHref, qaAnchor, sectionIds, sections } from '@/app/_lib/navigation'

const chip = 'block border-2 px-3 py-1.5 label transition-colors'
const chipOn = 'border-ink bg-ink text-cream'
const chipOff = 'border-transparent text-ink/70 hover:border-ink hover:text-ink'

// Everything the nav points at now lives on this one page, so every item is a
// plain in-page anchor — `#id`, resolved by the browser against whatever URL the
// page is served from (see `anchorHref` in `_lib/navigation.ts`).
const Header = () => {
  const activeId = useActiveSection(sectionIds)

  // Brand links to the first section; „Spojme sa" gets the CTA, so the menu
  // shows everything else. `number` is the printed index of the section, so the
  // nav reads like the contents line of a poster.
  const [homeId] = sectionIds
  const menuSections = sections
    .map((section, i) => ({ ...section, number: String(i).padStart(2, '0') }))
    .filter((section) => section.id !== homeId && section.id !== 'spojme-sa')

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-cream/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a
          href={anchorHref(homeId)}
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
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {menuSections.map((section) => (
            <li key={section.id}>
              <a
                href={anchorHref(section.id)}
                className={`${chip} ${activeId === section.id ? chipOn : chipOff}`}
              >
                <span className={activeId === section.id ? 'text-brand' : 'text-brand/80'}>
                  {section.number}
                </span>{' '}
                {section.label}
              </a>
            </li>
          ))}
        </ul>

        {/* The Q&A stays reachable at every width — it is the one place on the
            site where visitors can talk back. */}
        <div className="flex shrink-0 items-center gap-2">
          <a href={anchorHref(qaAnchor)} className={`${chip} ${chipOff}`}>
            Otázky
          </a>

          <Button href={anchorHref('spojme-sa')} variant="sun" size="sm">
            Spojme sa
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Header
