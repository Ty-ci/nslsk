import type { ReactNode } from 'react'

type LabelProps = {
  children: ReactNode
  /** Colour, e.g. `text-brand` or `text-cream/60`. */
  className?: string
}

// Monospace kicker set like a line pulled off an official form: a filled
// register square, then the label in wide-tracked caps. The one recurring
// ornament on the page.
const Label = ({ children, className = 'text-brand' }: LabelProps) => (
  <p className={`flex items-center gap-2.5 label ${className}`}>
    <span aria-hidden="true" className="inline-block size-2.5 shrink-0 bg-current" />
    {children}
  </p>
)

export default Label
