import type { ReactNode } from 'react'

export type TagTone = 'neutral' | 'navy' | 'info' | 'done' | 'warn'

const tones: Record<TagTone, string> = {
  neutral: 'bg-surface text-muted',
  navy: 'bg-navy text-white',
  info: 'bg-blue-tint text-navy',
  done: 'bg-green/10 text-green',
  warn: 'bg-yellow-tint text-navy',
}

// Small leaf pill for owners, deadlines, phases and statuses (DESIGN_SPECS.md §6.9).
const Tag = ({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode
  tone?: TagTone
  className?: string
}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-leaf px-2.5 py-0.5 text-xs/5 font-semibold ${tones[tone]} ${className}`}
  >
    {children}
  </span>
)

export default Tag
