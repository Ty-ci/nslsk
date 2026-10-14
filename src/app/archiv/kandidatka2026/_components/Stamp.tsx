import type { ReactNode } from 'react'

type StampProps = {
  children: ReactNode
  /** Rotation + colour + placement, e.g. `rotate-12 border-brand text-brand`. */
  className?: string
}

// Rubber stamp: a flat bordered box of mono caps on paper stock, always struck
// slightly askew. Used for the things a poster gets stamped with — the
// occasion, the status.
const Stamp = ({ children, className = 'rotate-12 border-brand text-brand' }: StampProps) => (
  <span
    className={`inline-block border-2 bg-cream px-3 py-1.5 text-center label leading-tight ${className}`}
  >
    {children}
  </span>
)

export default Stamp
