import type { ReactNode } from 'react'

import Footer from '@/app/_components/Footer'
import Header from '@/app/_components/Header'

const PagesLayout = ({ children }: { children: ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
)

export default PagesLayout
