import type { ReactNode } from 'react'

type EyebrowProps = {
  children: ReactNode
  /** Text (and marker) colour — defaults to the spot ink. */
  className?: string
}

// Monospace kicker set like a line pulled off an official form: a filled
// register square, then the label in wide-tracked caps.
const Eyebrow = ({ children, className = 'text-brand' }: EyebrowProps) => (
  <p
    className={`flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.25em] uppercase ${className}`}
  >
    <span aria-hidden="true" className="inline-block size-2.5 bg-current" />
    {children}
  </p>
)

export default Eyebrow
