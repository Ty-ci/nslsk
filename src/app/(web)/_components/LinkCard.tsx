import Link from 'next/link'
import type { ReactNode } from 'react'

// A card that is one link from edge to edge (DESIGN_SPECS.md §6.6): the border
// darkens and the arrow nudges right on hover. It stretches to fill its parent,
// so cards in a grid row share one height.
const LinkCard = ({
  href,
  title,
  children,
  className = '',
}: {
  href: string
  title: string
  children: ReactNode
  className?: string
}) => (
  <Link
    href={href}
    className={`group flex flex-1 flex-col rounded-card border border-line bg-white p-6 focus-ring transition-colors duration-200 hover:border-navy md:p-8 ${className}`}
  >
    <h3 className="text-h4 font-semibold">{title}</h3>
    <p className="mt-2 flex-1 text-sm/6">{children}</p>
    <span
      aria-hidden="true"
      className="mt-6 font-bold text-navy transition-transform duration-200 group-hover:translate-x-1"
    >
      →
    </span>
  </Link>
)

export default LinkCard
