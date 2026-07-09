import type { ReactNode } from 'react'

type PillProps = {
  children: ReactNode
  /** Colour + padding, e.g. `bg-brand/10 px-3 py-1 text-sm text-brand`. */
  className?: string
}

// Rounded label chip used for roles, tags and badges.
const Pill = ({ children, className = 'bg-brand/10 px-3 py-1 text-sm text-brand' }: PillProps) => (
  <span className={`inline-flex w-fit items-center gap-2 rounded-full font-semibold ${className}`}>
    {children}
  </span>
)

export default Pill
