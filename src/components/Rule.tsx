type RuleProps = {
  /** Width, height and colour, e.g. `mt-4 h-1.5 w-44 bg-brand`. */
  className?: string
}

// A flat bar of spot ink under a heading. Does the job an underline would, but
// printed as a solid block — the way a poster rules off a headline.
const Rule = ({ className = 'h-1.5 w-44 bg-brand' }: RuleProps) => (
  <span aria-hidden="true" className={`block ${className}`} />
)

export default Rule
