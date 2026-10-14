import './web.css'

import type { Metadata } from 'next'
import { Georama } from 'next/font/google'
import type { ReactNode } from 'react'

import AccessGate from '@/app/(web)/_components/AccessGate'
import PlaceholderBanner from '@/app/(web)/_components/PlaceholderBanner'
import SiteFooter from '@/app/(web)/_components/SiteFooter'
import SiteHeader from '@/app/(web)/_components/SiteHeader'

// Self-hosted by next/font; `latin-ext` carries the Slovak diacritics. Exposed
// as `--font-georama`, which `--font-sans` in web.css builds on.
const georama = Georama({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-georama',
})

const siteTitle = 'Náčelníctvo SLSK'

export const metadata: Metadata = {
  title: { default: siteTitle, template: `%s · ${siteTitle}` },
  description: 'Interný web Náčelníctva, Ústredia a podporných tímov Slovenského skautingu.',
  icons: { icon: '/lily.svg' },
  // An internal tool: kept out of search engines (see also `app/robots.ts`).
  robots: { index: false, follow: false },
}

// Root layout of the infoweb — everything outside `/archiv`. The archived
// candidacy site has a root layout of its own, so neither stylesheet ever
// reaches the other's pages.
const WebLayout = ({ children }: { children: ReactNode }) => (
  <html lang="sk" className={georama.variable}>
    <body className="flex min-h-screen flex-col">
      {/* Banner and header stick as one block, the warning on top: while the
          infoweb is being built, every page of it carries placeholder content. */}
      <div className="sticky top-0 z-50">
        <PlaceholderBanner>
          POZOR, obsah tohto webu je len na ukážku - informácie nie sú smerodajné, slúžia zatiaľ len
          ako placeholder.
        </PlaceholderBanner>
        <SiteHeader />
      </div>
      <main className="flex-1">
        <AccessGate>{children}</AccessGate>
      </main>
      <SiteFooter />
    </body>
  </html>
)

export default WebLayout
