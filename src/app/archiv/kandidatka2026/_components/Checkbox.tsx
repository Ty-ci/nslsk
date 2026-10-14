type CheckboxProps = {
  /** Size + colour, e.g. `size-7 text-brand`. */
  className?: string
  /** Mark the box — for milestones already met. */
  checked?: boolean
}

// Ballot box: a hard-edged square in the current colour, crossed with the spot
// ink once it has been marked. Decorative — the state lives in the content, not
// in a form control.
const Checkbox = ({ className = 'size-6 text-cream/50', checked = false }: CheckboxProps) => (
  <span
    aria-hidden="true"
    className={`flex items-center justify-center border-2 border-current font-mono text-sm font-bold ${className}`}
  >
    {checked ? '✕' : ''}
  </span>
)

export default Checkbox
