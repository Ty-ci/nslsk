import type { ReactNode } from 'react'

type FieldProps = {
  /** Printed field name, e.g. "Kandidujú". */
  name: string
  /** What has been entered against it. */
  children: ReactNode
  /** Use light rules and text on the ink band. */
  onDark?: boolean
  className?: string
}

// One line off a printed form: the field name in mono caps, a dotted leader
// running across, and the entry set in condensed caps on the right. The page's
// main way of presenting a fact — used for the ballot block, the meeting slots
// and the colophon.
const Field = ({ name, children, onDark = false, className = '' }: FieldProps) => (
  <div className={`flex flex-col items-baseline gap-x-3 lg:flex-row ${className}`}>
    <span
      className={`shrink-0 text-right font-heading text-base leading-none font-bold uppercase lg:text-lg ${
        onDark ? 'text-cream' : 'text-ink'
      }`}
    >
      {name}
    </span>
    <span aria-hidden="true" className={`leader ${onDark ? 'text-cream' : 'text-ink'}`} />
    <span className={`shrink-0 label ${onDark ? 'text-cream/50' : 'text-ink/60'}`}>{children}</span>
  </div>
)

export default Field
