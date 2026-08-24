import type { ReactNode } from 'react'

type TbdProps = {
  /** What is still missing, phrased for the authors filling it in. */
  children: ReactNode
  className?: string
  /** Use light rules and text on the ink band. */
  onDark?: boolean
}

// Deliberate hole in the page: content the candidates have not written yet.
// Printed as an empty form field — a dashed box with an unticked register
// square — never padded out with invented copy, so it is obvious at a glance
// what still needs doing.
const Tbd = ({ children, className = '', onDark = false }: TbdProps) => (
  <div
    className={`flex items-start gap-3 border-2 border-dashed p-5 ${
      onDark ? 'border-cream/30 bg-cream/5' : 'border-ink/35 bg-ink/3'
    } ${className}`}
  >
    <span
      aria-hidden="true"
      className={`mt-px flex size-5 shrink-0 items-center justify-center border-2 font-mono text-[10px] font-bold ${
        onDark ? 'border-cream/40 text-cream/40' : 'border-ink/40 text-ink/40'
      }`}
    >
      ?
    </span>
    <p
      className={`font-mono text-[11px] leading-relaxed tracking-wide uppercase ${
        onDark ? 'text-cream/50' : 'text-ink/55'
      }`}
    >
      <span className={onDark ? 'text-cream/75' : 'text-ink/80'}>Doplniť — </span>
      {children}
    </p>
  </div>
)

export default Tbd
