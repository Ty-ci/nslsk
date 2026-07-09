import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'light' | 'lightOutline'
type Size = 'sm' | 'md'

type ButtonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
} & AnchorHTMLAttributes<HTMLAnchorElement>

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5'

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-sm hover:bg-brand-dark hover:shadow-md',
  outline: 'border-2 border-navy/20 text-navy hover:border-navy/40 hover:bg-navy/5',
  // For use on coloured / dark backgrounds.
  light: 'bg-white text-brand shadow-sm hover:bg-cream hover:shadow-md',
  lightOutline: 'border-2 border-white/60 text-white hover:bg-white/10',
}

// Anchor styled as a pill button — the CTA shape reused across the whole page.
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...rest }: ButtonProps) => (
  <a className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
    {children}
  </a>
)

export default Button
