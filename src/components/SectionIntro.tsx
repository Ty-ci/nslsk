import type { ReactNode } from 'react'

import Eyebrow from './Eyebrow.tsx'

type SectionIntroProps = {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  /** Two-digit section index printed large beside the heading, e.g. "02". */
  index?: string
  /** Use light text for ink bands. */
  onDark?: boolean
}

// Flush-left masthead: a printed section index, monospace kicker, a tight
// condensed headline and a lead — no centring, no soft gradients.
const SectionIntro = ({ eyebrow, title, lead, index, onDark = false }: SectionIntroProps) => (
  <div className="border-t-2 border-current pt-5">
    <div className="flex items-baseline gap-4">
      {index && (
        <span
          className={`font-mono text-sm font-bold ${onDark ? 'text-cream/50' : 'text-ink/40'}`}
        >
          {index} /
        </span>
      )}
      <Eyebrow className="text-brand">{eyebrow}</Eyebrow>
    </div>
    <h2
      className={`mt-4 max-w-4xl font-heading text-5xl font-bold tracking-tight uppercase md:text-6xl ${
        onDark ? 'text-cream' : 'text-ink'
      }`}
    >
      {title}
    </h2>
    {lead && (
      <p className={`mt-5 max-w-2xl text-lg ${onDark ? 'text-cream/70' : 'text-ink/75'}`}>{lead}</p>
    )}
  </div>
)

export default SectionIntro
