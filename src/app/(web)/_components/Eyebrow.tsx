import type { ReactNode } from 'react'

type EyebrowProps = {
  children: ReactNode
  /** `quiet` for sub-sections, where a second yellow pill would compete. */
  variant?: 'accent' | 'quiet'
  className?: string
}

// The leaf-shaped label above a heading — sluzba's section pill, recoloured.
const Eyebrow = ({ children, variant = 'accent', className = '' }: EyebrowProps) => (
  <span
    className={`inline-block rounded-leaf px-3 py-1 eyebrow text-navy ${
      variant === 'accent' ? 'bg-yellow' : 'bg-blue-tint'
    } ${className}`}
  >
    {children}
  </span>
)

export default Eyebrow
