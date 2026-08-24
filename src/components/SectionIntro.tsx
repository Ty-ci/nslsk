import type { ReactNode } from 'react'

import Label from './Label.tsx'

type SectionIntroProps = {
  label: string
  title: ReactNode
  lead?: ReactNode
  /** Short figure printed at the right end of the running head, e.g. "4 záznamy". */
  note?: string
  /** Use light rules and text on the ink band. */
  onDark?: boolean
}

// Flush-left masthead ruled off by a heavy line, the way a poster opens a
// panel: a monospace kicker on the left, a printed figure on the right, then a
// tight condensed headline in caps. No centring, no soft gradients.
const SectionIntro = ({ label, title, lead, note, onDark = false }: SectionIntroProps) => (
  <div className={`border-t-2 pt-5 ${onDark ? 'border-cream/40' : 'border-ink'}`}>
    <div className="flex items-baseline gap-4">
      <Label className="text-brand">{label}</Label>
      <span aria-hidden="true" className={`leader ${onDark ? 'text-cream' : 'text-ink'}`} />
      {note && (
        <span className={`shrink-0 label ${onDark ? 'text-cream/45' : 'text-ink/40'}`}>{note}</span>
      )}
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
