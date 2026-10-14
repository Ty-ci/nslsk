'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Container from '@/app/(web)/_components/Container'
import Lily from '@/app/(web)/_components/Lily'
import { navRoutes } from '@/lib/navigation'

// White bar, at least `h-16`; the root layout makes it sticky together with the
// placeholder banner above it. The active link gets snem's yellow underline
// (DESIGN_SPECS.md §6.1).
const SiteHeader = () => {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="border-b border-line bg-white">
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
        <Link href="/" className="flex items-center gap-2.5 rounded-leaf focus-ring">
          <Lily className="size-7 text-navy" />
          <span className="text-[1.0625rem] font-bold text-navy">Náčelníctvo SLSK</span>
        </Link>

        <nav aria-label="Hlavná navigácia">
          <ul className="-mx-3 flex flex-wrap items-center gap-1">
            {navRoutes.map(({ path, label }) => {
              const active = isActive(path)

              return (
                <li key={path}>
                  <Link
                    href={path}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-leaf px-3 py-2 text-[0.9375rem] font-semibold text-navy underline-offset-10 focus-ring transition-colors duration-200 hover:bg-surface ${
                      active ? 'underline decoration-yellow decoration-[3px]' : ''
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default SiteHeader
