import type { ComponentType } from 'react'

import HashScroll from '@/app/_components/HashScroll'
import { type SectionId, sections } from '@/app/_lib/navigation'
import Hero from '@/app/_sections/Hero'
import Kandidati from '@/app/_sections/Kandidati'
import Otazky from '@/app/_sections/Otazky'
import Program from '@/app/_sections/Program'
import SpojmeSa from '@/app/_sections/SpojmeSa'
import Temy from '@/app/_sections/Temy'

// The section order and labels live in `_lib/navigation.ts`; this map is where
// each id gets its components. Typed as a full `Record`, so adding a section to
// the nav without writing its component is a type error rather than a blank gap.
// A nav entry may render more than one band — they all sit inside the one
// anchored `<section>`, so the scroll-spy keeps the nav item lit throughout.
const sectionComponents: Record<SectionId, ComponentType[]> = {
  uvod: [Hero],
  kandidati: [Kandidati],
  temy: [Temy],
  program: [Program],
  // Two halves of the same conversation: the invitation to meet, and the Q&A —
  // which keeps its own `#otazky` anchor from when it was a page of its own.
  'spojme-sa': [SpojmeSa, Otazky],
}

export const dynamic = 'force-dynamic'

const Home = () => (
  <>
    {/* Deep links (`/dev#otazky`) can land before the sheet-backed blocks have
        rendered, and a hash isn't part of the route — so scroll on arrival. */}
    <HashScroll />

    {sections.map(({ id }) => (
      <section key={id} id={id} className="scroll-mt-20">
        {sectionComponents[id].map((Band, i) => (
          <Band key={i} />
        ))}
      </section>
    ))}
  </>
)

export default Home
