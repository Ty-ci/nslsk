import type { ReactNode } from 'react'

// A quiet link out to the Google spreadsheet, for people who edit it by hand.
const SheetLink = ({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`inline-flex items-center gap-1.5 rounded-leaf text-sm text-muted underline decoration-line decoration-2 underline-offset-4 focus-ring transition-colors hover:text-navy hover:decoration-yellow ${className}`}
  >
    {children}
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
    <span className="sr-only">(otvorí sa v novom okne)</span>
  </a>
)

export default SheetLink
