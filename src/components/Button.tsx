import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'light' | 'lightOutline'
type Size = 'sm' | 'md'

type ButtonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
} & AnchorHTMLAttributes<HTMLAnchorElement>

// Square, hard-edged button that sits on a solid offset shadow and physically
// "presses" into it on hover/active — no rounding, no blur, no lift-and-float.
const base =
  'group inline-flex items-center justify-center gap-2 border-2 font-mono text-sm font-bold uppercase tracking-wider transition-[transform,box-shadow] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px]'

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3',
}

// Shadow/border colour is baked per-variant so buttons read correctly on both
// paper and ink bands.
const variants: Record<Variant, string> = {
  primary:
    'border-ink bg-brand text-cream shadow-[4px_4px_0_0_var(--color-ink)] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:shadow-none',
  outline:
    'border-ink bg-cream text-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:shadow-none',
  light:
    'border-cream bg-cream text-ink shadow-[4px_4px_0_0_var(--color-cream)] hover:shadow-[2px_2px_0_0_var(--color-cream)] active:shadow-none',
  lightOutline:
    'border-cream bg-transparent text-cream shadow-[4px_4px_0_0_var(--color-cream)] hover:shadow-[2px_2px_0_0_var(--color-cream)] active:shadow-none',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps) => (
  <a className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
    {children}
    <span aria-hidden="true" className="transition-transform duration-100 group-hover:translate-x-1">
      →
    </span>
  </a>
)

export default Button
