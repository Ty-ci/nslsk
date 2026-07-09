import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  /** Background band + text colour, e.g. `bg-navy text-white`. */
  className?: string
  /** Vertical padding override for the inner container. */
  py?: string
}

// Shared band + centred container used by every page section, so spacing and
// max-width stay consistent in one place.
const Section = ({ children, className = 'bg-cream', py = 'py-20 md:py-28' }: SectionProps) => (
  <div className={className}>
    <div className={`mx-auto max-w-6xl px-6 ${py}`}>{children}</div>
  </div>
)

export default Section
