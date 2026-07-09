import type { ReactNode } from 'react'

import Eyebrow from './Eyebrow.tsx'

type SectionIntroProps = {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  /** Use light text for dark backgrounds. */
  onDark?: boolean
}

// The eyebrow + heading + lead paragraph block shared by most sections.
const SectionIntro = ({ eyebrow, title, lead, onDark = false }: SectionIntroProps) => (
  <div>
    <Eyebrow className={onDark ? 'text-white/70' : 'text-brand'}>{eyebrow}</Eyebrow>
    <h2
      className={`mt-3 font-heading text-4xl font-bold tracking-tight md:text-5xl ${
        onDark ? 'text-white' : 'text-navy'
      }`}
    >
      {title}
    </h2>
    {lead && (
      <p className={`mt-4 max-w-2xl text-lg ${onDark ? 'text-white/70' : 'text-navy/70'}`}>{lead}</p>
    )}
  </div>
)

export default SectionIntro
