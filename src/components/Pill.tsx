import type { ReactNode } from 'react'

type PillProps = {
  children: ReactNode
  /** Colour + padding, e.g. `border-brand text-brand px-3 py-1`. */
  className?: string
}

// Rectangular stamp-tag used for roles, dates and badges — bordered, squared
// off and set in monospace caps like a rubber stamp.
const Pill = ({
  children,
  className = 'border-ink px-3 py-1 text-ink',
}: PillProps) => (
  <span
    className={`inline-flex w-fit items-center gap-2 border-2 font-mono text-xs font-bold tracking-wider uppercase ${className}`}
  >
    {children}
  </span>
)

export default Pill
