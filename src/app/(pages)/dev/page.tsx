import type { ComponentType } from 'react'

import HashScroll from '@/app/_components/HashScroll'
import { type SectionId, sections } from '@/app/_lib/navigation'
import Hero from '@/app/_sections/Hero'
import Kandidati from '@/app/_sections/Kandidati'
import Program from '@/app/_sections/Program'
import SpojmeSa from '@/app/_sections/SpojmeSa'
import Temy from '@/app/_sections/Temy'

// The section order and labels live in `_lib/navigation.ts`; this map is where
// each id gets its component. Typed as a full `Record`, so adding a section to
// the nav without writing its component is a type error rather than a blank gap.
const sectionComponents: Record<SectionId, ComponentType> = {
  uvod: Hero,
  kandidati: Kandidati,
  temy: Temy,
  program: Program,
  'spojme-sa': SpojmeSa,
}

export const dynamic = 'force-dynamic'

const Home = () => (
  <>
    {/* Deep links (`/dev#otazky`) can land before the sheet-backed blocks have
        rendered, and a hash isn't part of the route — so scroll on arrival. */}
    <HashScroll />

    {sections.map(({ id }) => {
      const Section = sectionComponents[id]

      return (
        <section key={id} id={id} className="scroll-mt-20">
          <Section />
        </section>
      )
    })}
  </>
)

export default Home
