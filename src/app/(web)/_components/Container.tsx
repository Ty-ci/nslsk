import type { ReactNode } from 'react'

// The page column: 1080px centred, 16px gutters on phones and 24px from `sm`.
// The only thing on the site that sets page gutters (DESIGN_SPECS.md §4).
const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1080px] px-4 sm:px-6 ${className}`}>{children}</div>
)

export default Container
