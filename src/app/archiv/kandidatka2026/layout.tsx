import './archive.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import AccessGate from '@/app/archiv/kandidatka2026/_components/AccessGate'
import Footer from '@/app/archiv/kandidatka2026/_components/Footer'
import Header from '@/app/archiv/kandidatka2026/_components/Header'

const siteTitle = 'Spolu do toho · Kandidatúra do N-SLSK 2026'

export const metadata: Metadata = {
  // Pages set only their own name; the template appends the site title, the way
  // the old `useDocumentTitle` hook used to.
  title: { default: siteTitle, template: `%s · ${siteTitle}` },
  description:
    'Funko, Green, Zved a Žubro — štyria kandidáti do Náčelníctva Slovenského skautingu a ich spoločný program pre snem 2026.',
  icons: { icon: '/favicon.svg' },
  robots: { index: false, follow: false },
}

// The archived candidacy site keeps a root layout of its own — its own
// `<html>`/`<body>` and its own stylesheet — so the poster look (paper stock,
// dot grain, the four faces) can't leak into the new infoweb, and the infoweb's
// tokens can't leak back in here. Moving between the two is a full page load.
const ArchiveLayout = ({ children }: { children: ReactNode }) => (
  <html lang="sk">
    <body className="min-h-screen">
      <Header />
      <main>
        <AccessGate>{children}</AccessGate>
      </main>
      <Footer />
    </body>
  </html>
)

export default ArchiveLayout
