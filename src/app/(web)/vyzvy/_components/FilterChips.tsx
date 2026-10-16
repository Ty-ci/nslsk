'use client'

import { useId } from 'react'

import type { FilterOption } from '@/app/(web)/vyzvy/_lib/calls'

type FilterChipsProps = {
  label: string
  allLabel: string
  /** Open calls in all — calls with an empty cell count here, but under no option. */
  allActive: number
  options: FilterOption[]
  /** The selected option's slug; `null` for all. */
  selected: string | null
  onSelect: (slug: string | null) => void
}

// A row of toggle chips (DESIGN_SPECS.md §6.14), each with how many of its
// calls are still open. The options come from the sheet, not from code.
const FilterChips = ({
  label,
  allLabel,
  allActive,
  options,
  selected,
  onSelect,
}: FilterChipsProps) => {
  const labelId = useId()

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-wrap items-center gap-2">
      <span id={labelId} className="mr-1 eyebrow text-navy">
        {label}
      </span>
      {[{ slug: null, label: allLabel, active: allActive }, ...options].map((option) => {
        const active = selected === option.slug

        return (
          <button
            key={option.slug ?? 'all'}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(option.slug)}
            className={`inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-leaf border px-3 text-sm font-semibold focus-ring transition-colors duration-200 ${
              active
                ? 'border-navy bg-navy text-white'
                : 'border-line bg-white text-navy hover:border-navy'
            }`}
          >
            {option.label}
            <span className={`text-xs tabular-nums ${active ? 'text-white/80' : 'text-muted'}`}>
              {option.active}
              <span className="sr-only"> aktuálnych</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default FilterChips
