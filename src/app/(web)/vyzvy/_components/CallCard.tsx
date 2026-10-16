'use client'

import type { ReactNode } from 'react'

import Button from '@/app/(web)/_components/Button'
import Tag, { type TagTone } from '@/app/(web)/_components/Tag'
import { statusLabel } from '@/app/(web)/vyzvy/_lib/calls'
import type { CallStatus, OpenCall } from '@/app/(web)/vyzvy/_lib/types'

export const statusTones: Record<CallStatus, TagTone> = {
  draft: 'navy',
  scheduled: 'info',
  open: 'done',
  closing: 'warn',
  closed: 'neutral',
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const ExternalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-3.5"
  >
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)

const LinkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-3.5"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

/** One fact in the side column: a quiet label over a plain value. */
const Fact = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="min-w-0">
    <dt className="text-xs/5 text-muted">{label}</dt>
    <dd className="text-sm/6 break-words text-ink">{children}</dd>
  </div>
)

const Deadline = ({ call }: { call: OpenCall }) =>
  call.deadline ? (
    <time dateTime={call.deadline.iso} className="tabular-nums">
      {call.deadline.label}
    </time>
  ) : (
    (call.deadlineText ?? 'Priebežne')
  )

type CallCardProps = {
  call: OpenCall
  /** Ringed after arriving through its `#anchor` or from a process timeline. */
  highlighted: boolean
  copied: boolean
  onCopyLink: () => void
  /** Filters the page to the card's process; absent while it already is. */
  onSelectProcess?: () => void
}

// One call as a full-width row. The left column is what the call is: status
// and type, the title (the one loud thing), its process, a teaser. The right
// column is what decides whether to apply — deadline, time, whom to ask —
// kept quiet, with the way out to the full document under it. On phones the
// right column drops below, its facts side by side.
const CallCard = ({ call, highlighted, copied, onCopyLink, onSelectProcess }: CallCardProps) => {
  const closed = call.status === 'closed'
  const titleId = `${call.id}-title`

  return (
    <article
      id={call.id}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={`grid gap-x-8 gap-y-5 rounded-card border p-5 transition-colors duration-200 outline-none md:grid-cols-[minmax(0,1fr)_14rem] md:p-6 ${
        closed ? 'bg-white/60' : 'bg-white'
      } ${highlighted ? 'border-navy ring-2 ring-navy' : 'border-line'}`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone={statusTones[call.status]}>{statusLabel(call)}</Tag>
          {call.type ? <Tag>{call.type}</Tag> : null}
        </div>

        <h3 id={titleId} className={`mt-3 text-h4 font-semibold ${closed ? 'text-muted' : ''}`}>
          {call.title}
        </h3>

        {call.process ? (
          onSelectProcess ? (
            <button
              type="button"
              onClick={onSelectProcess}
              className="mt-1 w-fit cursor-pointer rounded-leaf text-left text-sm text-muted underline decoration-line decoration-2 underline-offset-4 focus-ring transition-colors hover:text-navy hover:decoration-yellow"
            >
              Súčasť procesu {call.process}
              <span className="sr-only"> — zobraziť všetky jeho výzvy</span>
            </button>
          ) : (
            <p className="mt-1 text-sm text-muted">Súčasť procesu {call.process}</p>
          )
        ) : null}

        {call.description ? (
          <p className="mt-3 max-w-[65ch] text-sm/6 text-pretty">{call.description}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-5 border-t border-line pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
          <Fact label="Uzávierka">
            <Deadline call={call} />
          </Fact>
          {call.commitment ? <Fact label="Časová náročnosť">{call.commitment}</Fact> : null}
          {call.contact ? (
            <Fact label="Kontakt">
              {isEmail(call.contact) ? (
                <a
                  href={`mailto:${call.contact}`}
                  className="rounded-leaf underline decoration-line decoration-2 underline-offset-4 focus-ring hover:decoration-yellow"
                >
                  {call.contact}
                </a>
              ) : (
                call.contact
              )}
            </Fact>
          ) : null}
        </dl>

        {/* Pushed to the bottom of the column, under the facts. */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
          {call.link ? (
            <Button href={call.link} target="_blank" rel="noreferrer" size="sm" variant="outline">
              Celá výzva
              <ExternalIcon />
              <span className="sr-only">(otvorí sa v novom okne)</span>
            </Button>
          ) : null}
          <button
            type="button"
            onClick={onCopyLink}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-leaf text-xs font-semibold text-muted focus-ring transition-colors hover:text-navy"
          >
            <LinkIcon />
            {copied ? 'Skopírované' : 'Kopírovať odkaz'}
            <span className="sr-only"> na výzvu {call.title}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default CallCard
