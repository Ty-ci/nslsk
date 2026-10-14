import type { InputHTMLAttributes } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
  /** A save is in flight: the box pulses and reads as busy. */
  busy?: boolean
}

// A native checkbox, restyled (DESIGN_SPECS.md §6.11): 22px, 2px navy border,
// navy fill with a white tick when checked. Native underneath, so keyboard,
// forms and screen readers get the real thing.
const Checkbox = ({ busy = false, ...rest }: CheckboxProps) => (
  <span className="relative inline-flex size-[22px] shrink-0">
    <input
      type="checkbox"
      aria-busy={busy || undefined}
      className={`peer size-full cursor-pointer appearance-none rounded-md border-2 border-navy bg-white focus-ring transition-colors duration-150 checked:bg-navy disabled:cursor-not-allowed disabled:opacity-60 ${
        busy ? 'animate-pulse' : ''
      }`}
      {...rest}
    />
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0.5 hidden text-white peer-checked:block"
    >
      <path d="m5 12 5 5 9-10" />
    </svg>
  </span>
)

export default Checkbox
