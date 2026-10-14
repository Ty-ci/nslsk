import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  /** Anchor id, when the band itself is a link target (e.g. `#otazky`). */
  id?: string
  /** Full-bleed band styling, e.g. `band-ink text-cream`. Empty = bare paper. */
  className?: string
  /** Vertical padding override for the inner container. */
  py?: string
}

// Shared full-bleed band + centred column. Light bands are left transparent so
// the page's paper grain runs continuously; ink bands opt into `band-ink`.
// `relative overflow-hidden` keeps stamps and misregistered plates that hang
// off the edge of a section from widening the page.
const Section = ({ children, id, className = '', py = 'py-20 md:py-28' }: SectionProps) => (
  <div id={id} className={`relative overflow-hidden ${className}`}>
    <div className={`mx-auto max-w-6xl px-6 ${py}`}>{children}</div>
  </div>
)

export default Section
