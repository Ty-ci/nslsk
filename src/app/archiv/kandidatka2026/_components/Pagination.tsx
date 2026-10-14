'use client'

// Page selector for long lists, printed like the rest of the page: square
// boxes, 2px rules, nothing rounded. The current page is a flood-filled plate,
// the rest are outlines that only ink up on hover.
//
// Renders nothing for a single page, so callers can drop it in unconditionally.
type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
}

const step = 'inline-flex size-10 items-center justify-center border-2 font-mono text-sm font-bold'
const current = `${step} border-ink bg-ink text-cream`
const other = `${step} border-ink/25 text-ink transition-colors hover:border-ink hover:bg-cream-light`
const arrow = `${step} border-ink/25 text-ink transition-colors hover:border-ink hover:bg-cream-light disabled:border-ink/15 disabled:text-ink/25 disabled:hover:bg-transparent`

// Which page numbers get printed: the first, the last, and the current page
// with a neighbour either side. Every run we skip collapses into one `gap`.
const pageWindow = (page: number, pageCount: number): (number | 'gap')[] => {
  const shown = new Set<number>()
  for (const n of [1, page - 1, page, page + 1, pageCount]) {
    if (n >= 1 && n <= pageCount) shown.add(n)
  }

  const sorted = [...shown].sort((a, b) => a - b)
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ['gap' as const, n] : [n]))
}

const Pagination = ({ page, pageCount, onPageChange, className = '' }: PaginationProps) => {
  if (pageCount <= 1) return null

  return (
    <nav
      aria-label="Stránkovanie otázok"
      className={`flex flex-wrap items-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Predchádzajúca strana"
        className={arrow}
      >
        ←
      </button>

      {pageWindow(page, pageCount).map((entry, index) =>
        entry === 'gap' ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="px-1 font-mono text-sm text-ink/40"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPageChange(entry)}
            aria-label={`Strana ${entry}`}
            aria-current={entry === page ? 'page' : undefined}
            className={entry === page ? current : other}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Nasledujúca strana"
        className={arrow}
      >
        →
      </button>
    </nav>
  )
}

export default Pagination
