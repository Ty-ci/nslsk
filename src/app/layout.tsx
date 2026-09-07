import './globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import Footer from '@/app/_components/Footer'
import Header from '@/app/_components/Header'

const siteTitle = 'Spolu do toho · Kandidatúra do N-SLSK 2026'

export const metadata: Metadata = {
  // Pages set only their own name; the template appends the site title, the way
  // the old `useDocumentTitle` hook used to.
  title: { default: siteTitle, template: `%s · ${siteTitle}` },
  description:
    'Funko, Green, Zved a Žubro — štyria kandidáti do Náčelníctva Slovenského skautingu a ich spoločný program pre snem 2026.',
  icons: { icon: '/favicon.svg' },
}

// The whole shell: the only `<html>`/`<body>` in the app, plus the header and
// colophon that frame the one-pager. There is only the one page to frame — the
// catch-all redirects before it renders — so this lives here rather than in a
// layout of its own.
const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="sk">
    <body className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </body>
  </html>
)

export default RootLayout
