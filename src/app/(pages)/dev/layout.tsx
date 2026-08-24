import type { ReactNode } from 'react'

import Footer from '@/app/_components/Footer'
import Header from '@/app/_components/Header'

// The shell the real site wears: sticky header, routed body, colophon. Section
// order and the nav live in `_lib/navigation.ts`.
//
// A nested layout, so no `<html>`/`<body>` and no metadata of its own — the root
// layout owns the document and the title, and `/` is parked as the turning lily.
const PagesLayout = ({ children }: { children: ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
)

export default PagesLayout
