import type { ReactNode } from 'react'

type TbdProps = {
  /** What is still missing, phrased for the authors filling it in. */
  children: ReactNode
  className?: string
}

// Deliberate hole in the page: content the candidates have not written yet.
// Printed as an empty form field with a hatched rule rather than filled with
// invented copy, so it is obvious at a glance what still needs doing.
const Tbd = ({ children, className = '' }: TbdProps) => (
  <div
    className={`flex items-start gap-3 border-2 border-dashed border-ink/35 bg-ink/3 p-5 ${className}`}
  >
    <span
      aria-hidden="true"
      className="mt-px flex size-5 shrink-0 items-center justify-center border-2 border-ink/40 font-mono text-[10px] font-bold text-ink/40"
    >
      ?
    </span>
    <p className="font-mono text-[11px] leading-relaxed tracking-wide text-ink/55 uppercase">
      <span className="text-ink/80">Doplniť — </span>
      {children}
    </p>
  </div>
)

export default Tbd
