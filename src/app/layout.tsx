import './globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const siteTitle = 'Spolu do toho · Kandidatúra do N-SLSK 2026'

export const metadata: Metadata = {
  // Pages set only their own name; the template appends the site title, the way
  // the old `useDocumentTitle` hook used to.
  title: { default: siteTitle, template: `%s · ${siteTitle}` },
  description:
    'Funko, Green, Zved a Žubro — štyria kandidáti do Náčelníctva Slovenského skautingu a ich spoločný program pre snem 2026.',
  icons: { icon: '/favicon.svg' },
}

// The bare document shell: the only `<html>`/`<body>` in the app, and nothing
// else — not even the `<main>`, since the header/footer shell now belongs to the
// routes that want it (see `(pages)/dev/layout.tsx`) and `/` is parked as the
// turning lily.
const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="sk" className="scroll-smooth">
    <body className="min-h-screen">{children}</body>
  </html>
)

export default RootLayout
