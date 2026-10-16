'use client'

import { type ReactNode, useState } from 'react'

import Tabs from '@/app/(web)/_components/Tabs'
import Tag from '@/app/(web)/_components/Tag'
import CallsAdmin from '@/app/(web)/vyzvy/_components/CallsAdmin'
import CallsBoard, { type Filters } from '@/app/(web)/vyzvy/_components/CallsBoard'
import type { CallsData } from '@/app/(web)/vyzvy/_lib/types'
import useCalls, { type CallsState } from '@/app/(web)/vyzvy/_lib/useCalls'

type View = 'vyzvy' | 'data'

const views: View[] = ['vyzvy', 'data']

// A loading line or the load error (with a retry) until there's data.
const CallsGate = ({
  calls,
  children,
}: {
  calls: CallsState
  children: (data: CallsData) => ReactNode
}) => {
  const { result } = calls

  if (!result) {
    return (
      <p role="status" className="py-12 text-center text-sm text-muted">
        Načítavam výzvy…
      </p>
    )
  }

  if (!result.ok) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-yellow-tint p-4 text-sm/6 font-semibold text-navy"
      >
        <p>{result.error}</p>
        <button
          type="button"
          onClick={calls.reload}
          disabled={calls.isLoading}
          className="cursor-pointer rounded-leaf underline decoration-navy/30 decoration-2 underline-offset-4 focus-ring hover:decoration-navy disabled:cursor-wait"
        >
          {calls.isLoading ? 'Načítavam…' : 'Skúsiť znova'}
        </button>
      </div>
    )
  }

  return children(result.data)
}

// The calls, and — for whoever keeps the sheet — a check of it, as two tabs
// over one load: drafts unlocked in „Dáta“ show up in the list too.
const CallsTabs = ({ initialFilters }: { initialFilters: Filters }) => {
  const [view, setView] = useState<View>('vyzvy')
  const calls = useCalls()
  const errorCount =
    calls.result?.ok === true
      ? calls.result.data.issues.filter((issue) => issue.level === 'error').length
      : 0

  return (
    <Tabs
      label="Výzvy"
      selected={view}
      onSelect={(key) => setView(views.find((candidate) => candidate === key) ?? 'vyzvy')}
      tabs={[
        {
          key: 'vyzvy',
          label: 'Výzvy',
          panel: (
            <CallsGate calls={calls}>
              {(data) => <CallsBoard data={data} initialFilters={initialFilters} />}
            </CallsGate>
          ),
        },
        {
          key: 'data',
          label: (
            <span className="inline-flex items-center gap-2">
              Dáta
              {errorCount > 0 ? (
                <Tag tone="warn">
                  {errorCount}
                  <span className="sr-only"> chýb v tabuľke</span>
                </Tag>
              ) : null}
            </span>
          ),
          panel: (
            <CallsGate calls={calls}>
              {(data) => <CallsAdmin calls={calls} data={data} />}
            </CallsGate>
          ),
        },
      ]}
    />
  )
}

export default CallsTabs
