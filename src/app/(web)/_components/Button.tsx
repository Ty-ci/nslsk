import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'on-dark'
type Size = 'sm' | 'md'

type Look = {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Trailing arrow that nudges right on hover. */
  arrow?: boolean
  className?: string
}

// One button, three elements: a route goes through the router, an outside
// address is a plain `<a>`, and no `href` at all is a real `<button>`. `href`
// discriminates the two prop sets.
type ButtonProps =
  | (Look & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Look> & { href: string })
  | (Look & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Look> & { href?: never })

// The leaf pill (DESIGN_SPECS.md §6.3). Outline variants fill on hover, the way
// sluzba's buttons do.
const base =
  'group inline-flex items-center justify-center gap-2 rounded-leaf font-bold transition-colors duration-200 ease-out focus-ring disabled:cursor-not-allowed disabled:opacity-50'

const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-4 text-sm',
  md: 'min-h-11 px-6 text-[0.9375rem]',
}

const variants: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-700',
  // At most one per screen: the key call to action.
  accent: 'bg-yellow text-navy hover:bg-yellow-600',
  outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-white',
  ghost:
    'px-0 text-navy underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-yellow',
  // On navy bands, where the focus ring has to print in yellow.
  'on-dark':
    'border-2 border-white text-white hover:border-yellow hover:bg-yellow hover:text-navy focus-visible:outline-yellow',
}

const styles = (variant: Variant, size: Size, className: string) =>
  `${base} ${sizes[size]} ${variants[variant]} ${className}`

const Label = ({ children, arrow }: { children: ReactNode; arrow: boolean }) => (
  <>
    {children}
    {arrow ? (
      <span
        aria-hidden="true"
        className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
      >
        →
      </span>
    ) : null}
  </>
)

const isLink = (props: ButtonProps): props is Extract<ButtonProps, { href: string }> =>
  props.href !== undefined

const Button = (props: ButtonProps) => {
  if (!isLink(props)) {
    const {
      children,
      variant = 'primary',
      size = 'md',
      arrow = false,
      className = '',
      ...rest
    } = props

    return (
      <button type="button" className={styles(variant, size, className)} {...rest}>
        <Label arrow={arrow}>{children}</Label>
      </button>
    )
  }

  const {
    children,
    variant = 'primary',
    size = 'md',
    arrow = false,
    className = '',
    href,
    ...rest
  } = props
  const classes = styles(variant, size, className)

  return href.startsWith('/') ? (
    <Link className={classes} href={href} {...rest}>
      <Label arrow={arrow}>{children}</Label>
    </Link>
  ) : (
    <a className={classes} href={href} {...rest}>
      <Label arrow={arrow}>{children}</Label>
    </a>
  )
}

export default Button
