'use client'

import Button from '@/app/(web)/_components/Button'
import Tag from '@/app/(web)/_components/Tag'
import { statusTones } from '@/app/(web)/vyzvy/_components/CallCard'
import { byDate, isActive, openCount, plural, statusLabel } from '@/app/(web)/vyzvy/_lib/calls'
import type { CallStatus, OpenCall } from '@/app/(web)/vyzvy/_lib/types'

// The stepper's node states (DESIGN_SPECS.md §6.13): behind us navy, now
// yellow with a navy ring, ahead an empty circle.
const dots: Record<CallStatus, string> = {
  closed: 'bg-navy',
  open: 'bg-yellow ring-2 ring-navy',
  closing: 'bg-yellow ring-2 ring-navy',
  scheduled: 'border-2 border-line bg-white',
  draft: 'border-2 border-dashed border-navy bg-white',
}

type ProcessTimelineProps = {
  process: string
  /** Every call of the process, closed ones included, in any order. */
  calls: OpenCall[]
  onReveal: (id: string) => void
  onClear: () => void
}

// Shown above the list while it's filtered to one process: the process's
// calls as a timeline — what's done, what's open now, what comes next — so a
// call is read in its context. Built from the calls' own dates; the admin
// writes nothing extra for it.
const ProcessTimeline = ({ process, calls, onReveal, onClear }: ProcessTimelineProps) => {
  const ordered = [...calls].sort(byDate)
  const open = calls.filter((call) => call.status === 'open' || call.status === 'closing').length

  return (
    <section
      aria-labelledby="process-title"
      className="mb-6 rounded-card border border-navy bg-white p-5 md:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-muted">Proces</p>
          <h2 id="process-title" className="mt-1 text-h4 font-bold">
            {process}
          </h2>
          <p className="text-sm text-muted">
            {calls.length} {plural(calls.length, ['výzva', 'výzvy', 'výziev'])} ·{' '}
            {openCount(open).toLowerCase()}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onClear}>
          Všetky výzvy
        </Button>
      </div>

      <ol className="mt-5 ml-1.5 border-l-2 border-line pl-5">
        {ordered.map((call) => (
          <li key={call.id} className="relative pb-4 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute top-2 -left-6.75 size-3 rounded-full ${dots[call.status]}`}
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <button
                type="button"
                onClick={() => onReveal(call.id)}
                className={`cursor-pointer rounded-leaf text-left font-semibold underline decoration-line decoration-2 underline-offset-4 focus-ring hover:decoration-yellow ${
                  isActive(call) ? 'text-navy' : 'text-muted'
                }`}
              >
                {call.title}
              </button>
              <Tag tone={statusTones[call.status]}>{statusLabel(call)}</Tag>
            </div>
            <p className="text-[0.8125rem]/5 text-muted">
              {call.deadline
                ? `Uzávierka ${call.deadline.label}`
                : (call.deadlineText ?? 'Priebežne')}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default ProcessTimeline
