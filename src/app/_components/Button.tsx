import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'sun' | 'solid' | 'light' | 'sketch' | 'quiet'
type Size = 'sm' | 'md'

type Look = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

// One button, three elements: a route goes through the router, an in-page
// anchor or an outside address is a plain `<a>`, and no `href` at all is a real
// `<button>` — a modal trigger, say. `href` discriminates the two prop sets.
type ButtonProps =
  | (Look & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Look> & { href: string })
  | (Look & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Look> & { href?: never })

// Square, hard-edged button that sits on a solid offset shadow and physically
// "presses" into it on hover/active — no rounding, no blur, no lift-and-float.
const base =
  'group inline-flex items-center justify-center gap-2 font-mono text-sm font-bold tracking-wider uppercase transition-[transform,box-shadow,color] duration-100'

// The pressing motion, shared by every variant that has a shadow to press into.
const press = 'border-2 hover:translate-0.5 active:translate-1'

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3',
}

// Shadow/border colour is baked per-variant so buttons read correctly on both
// paper and ink bands.
const variants: Record<Variant, string> = {
  // Spot ink: reserved for the one thing we most want clicked.
  sun: `${press} border-ink bg-brand text-cream shadow-[4px_4px_0_0_var(--color-ink)] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:shadow-none`,
  // Flood-filled black, shadowed in the spot ink — a second plate, offset.
  solid: `${press} border-ink bg-ink text-cream shadow-[4px_4px_0_0_var(--color-brand)] hover:shadow-[2px_2px_0_0_var(--color-brand)] active:shadow-none`,
  // For ink bands, where the shadow has to print in paper.
  light: `${press} border-cream bg-cream text-ink shadow-[4px_4px_0_0_var(--color-cream)] hover:shadow-[2px_2px_0_0_var(--color-cream)] active:shadow-none`,
  // Boxed but unfilled — for secondary actions on paper.
  sketch: `${press} border-ink bg-cream text-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:shadow-none`,
  // A text link that just happens to be a call to action.
  quiet:
    'p-0 text-ink underline decoration-brand decoration-2 underline-offset-[6px] hover:text-brand',
}

const styles = (variant: Variant, size: Size, className: string) =>
  `${base} ${variant === 'quiet' ? '' : sizes[size]} ${variants[variant]} ${className}`

const Label = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <span
      aria-hidden="true"
      className="transition-transform duration-100 group-hover:translate-x-1"
    >
      →
    </span>
  </>
)

/**
 * Routes (`/dev`) go through the router; in-page anchors (`#temy`) deliberately
 * do not — a plain `<a href="#id">` is resolved against the URL currently open,
 * so it survives the page moving in the folder structure.
 */
const isRoute = (href: string) => href.startsWith('/')

// Narrowed here rather than inside the component, so each branch can destructure
// its own element's attributes off an already-picked half of the union.
const isLink = (props: ButtonProps): props is Extract<ButtonProps, { href: string }> =>
  props.href !== undefined

const Button = (props: ButtonProps) => {
  if (!isLink(props)) {
    const { children, variant = 'solid', size = 'md', className = '', ...rest } = props

    // `href` isn't destructured away: on this half of the union it is typed
    // `never`, so there is nothing to strip out of `rest`.
    return (
      <button type="button" className={styles(variant, size, className)} {...rest}>
        <Label>{children}</Label>
      </button>
    )
  }

  const { children, variant = 'solid', size = 'md', className = '', href, ...rest } = props
  const classes = styles(variant, size, className)

  return isRoute(href) ? (
    <Link className={classes} href={href} {...rest}>
      <Label>{children}</Label>
    </Link>
  ) : (
    <a className={classes} href={href} {...rest}>
      <Label>{children}</Label>
    </a>
  )
}

export default Button
export type { Size as ButtonSize, Variant as ButtonVariant }
