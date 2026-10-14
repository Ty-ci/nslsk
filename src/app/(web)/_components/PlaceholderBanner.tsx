import type { ReactNode } from 'react'

import Container from '@/app/(web)/_components/Container'

// Site-wide warning that the content is mock or unverified (DESIGN_SPECS.md
// §6.10). The root layout pins it above the header, and it can't be dismissed —
// the warning has to survive a screenshot.
const PlaceholderBanner = ({ children }: { children: ReactNode }) => (
  <div role="note" className="bg-amber-400 text-navy">
    <Container className="flex items-start justify-center gap-2 py-4 text-center text-sm/6 font-semibold sm:items-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 sm:mt-0"
      >
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <p>{children}</p>
    </Container>
  </div>
)

export default PlaceholderBanner
