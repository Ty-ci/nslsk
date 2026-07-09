import type { ReactNode } from 'react'

type EyebrowProps = {
  children: ReactNode
  /** Text (and dot) colour — defaults to the brand accent. */
  className?: string
}

// Small uppercase kicker with a friendly leading dot, used above every heading.
const Eyebrow = ({ children, className = 'text-brand' }: EyebrowProps) => (
  <p
    className={`flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.2em] uppercase ${className}`}
  >
    <span aria-hidden="true" className="inline-block size-2.5 rounded-full bg-current" />
    {children}
  </p>
)

export default Eyebrow
