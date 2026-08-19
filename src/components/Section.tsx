import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  /** Full-bleed band styling, e.g. `band-ink text-cream`. Empty = bare paper. */
  className?: string
  /** Vertical padding override for the inner container. */
  py?: string
}

// Shared full-bleed band + centred column. Light bands are left transparent so
// the page's paper grain runs continuously; ink bands opt into `band-ink`.
const Section = ({ children, className = '', py = 'py-20 md:py-28' }: SectionProps) => (
  <div className={className}>
    <div className={`mx-auto max-w-6xl px-6 ${py}`}>{children}</div>
  </div>
)

export default Section
