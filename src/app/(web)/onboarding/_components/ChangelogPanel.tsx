'use client'

import { useEffect, useState } from 'react'

import SheetLink from '@/app/(web)/_components/SheetLink'
import type { ChangelogResult } from '@/app/(web)/onboarding/_lib/types'
import { getOnboardingChangelog } from '@/app/(web)/onboarding/actions'
import { passwordFor } from '@/lib/access/client'
import type { ChangelogEntry } from '@/lib/changelog/types'

const sourceLabels = { web: 'web', tabulka: 'tabuľka' } as const

/** Entries shown at first; „Zobraziť staršie" adds this many more. */
const PAGE = 30

// Timestamps arrive as the sheet's wall-clock time stored in UTC, so they're
// formatted in UTC too — and "today" is today in Bratislava, where the sheet runs.
const dayLabel = new Intl.DateTimeFormat('sk-SK', {
  timeZone: 'UTC',
  weekday: 'long',
  day: 'numeric',
  month: 'numeric',
})
const timeLabel = new Intl.DateTimeFormat('sk-SK', {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
})

const relativeDays = () => {
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Bratislava' }).format(
    new Date(),
  )
  const yesterday = new Date(Date.parse(today) - 86_400_000).toISOString().slice(0, 10)

  return new Map([
    [today, 'Dnes'],
    [yesterday, 'Včera'],
  ])
}

type Day = { key: string; label: string; entries: { entry: ChangelogEntry; time: string }[] }

// Consecutive entries of one day under one heading, so each row only needs
// its time. An entry with a hand-typed timestamp keeps that text as its time.
const groupByDay = (entries: ChangelogEntry[]): Day[] => {
  const relative = relativeDays()

  return entries.reduce<Day[]>((days, entry) => {
    const date = entry.iso ? new Date(entry.iso) : undefined
    const key = date ? entry.iso.slice(0, 10) : 'bez-datumu'
    const time = date ? timeLabel.format(date) : entry.when
    const last = days.at(-1)

    if (last?.key === key) {
      last.entries.push({ entry, time })
    } else {
      const label = date ? (relative.get(key) ?? dayLabel.format(date)) : 'Bez dátumu'
      days.push({ key, label, entries: [{ entry, time }] })
    }

    return days
  }, [])
}

const ChangelogList = ({ entries }: { entries: ChangelogEntry[] }) => {
  const [shown, setShown] = useState(PAGE)
  const hidden = entries.length - shown

  return (
    <>
      {groupByDay(entries.slice(0, shown)).map((day) => (
        <section key={day.key} aria-label={day.label} className="mt-3">
          <h3 className="pb-1 text-xs font-semibold text-navy first-letter:uppercase">
            {day.label}
          </h3>
          <ol>
            {day.entries.map(({ entry, time }) => (
              <li
                key={entry.id}
                className="grid grid-cols-[3rem_1fr_auto] gap-x-3 border-t border-line py-1.5 text-sm/5"
              >
                {entry.iso ? (
                  <time dateTime={entry.iso} className="text-muted tabular-nums">
                    {time}
                  </time>
                ) : (
                  <span className="truncate text-muted">{time}</span>
                )}
                <div className="min-w-0">
                  <p className="text-ink">{entry.change}</p>
                  {entry.note ? (
                    <p className="text-[0.8125rem]/5 text-muted">
                      <span className="sr-only">Poznámka: </span>↳ {entry.note}
                    </p>
                  ) : null}
                </div>
                <span className="text-xs/5 text-muted">
                  {entry.source ? sourceLabels[entry.source] : null}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setShown((count) => count + PAGE)}
          className="mt-2 cursor-pointer rounded-leaf text-sm font-semibold text-navy underline decoration-line decoration-2 underline-offset-4 focus-ring hover:decoration-yellow"
        >
          Zobraziť staršie ({hidden})
        </button>
      ) : null}
    </>
  )
}

type ChangelogPanelProps = {
  active: boolean
  /** Bumped by the tabs each time this panel is opened — each opening reloads. */
  openings: number
}

// The checklist's history, from the `changelog` tab. Read again every time the
// tab is opened (and on „Obnoviť"), so a tick made a moment ago shows up; the
// previous list stays on screen while the new one loads.
const ChangelogPanel = ({ active, openings }: ChangelogPanelProps) => {
  const [reloads, setReloads] = useState(0)
  // Each response remembers which request it answers; loading is simply
  // "the latest request hasn't been answered yet".
  const request = `${openings}:${reloads}`
  const [loaded, setLoaded] = useState<{ request: string; result: ChangelogResult }>()
  const result = loaded?.result
  const isLoading = active && loaded?.request !== request

  useEffect(() => {
    if (!active) {
      return undefined
    }

    let isActive = true
    void getOnboardingChangelog(passwordFor('/onboarding'))
      .catch(() => ({
        ok: false as const,
        error: 'Históriu zmien sa nepodarilo načítať. Skús to znova.',
      }))
      .then((answer) => {
        if (isActive) {
          setLoaded({ request, result: answer })
        }
      })

    return () => {
      isActive = false
    }
  }, [active, request])

  return (
    <section
      aria-labelledby="changelog-title"
      aria-busy={isLoading}
      className="rounded-card border border-line bg-white px-4 py-3"
    >
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 id="changelog-title" className="font-semibold text-navy">
          História zmien
        </h2>
        <div className="ml-auto flex items-baseline gap-4">
          {result?.ok ? <SheetLink href={result.sheetUrl}>Hárok</SheetLink> : null}
          <button
            type="button"
            onClick={() => setReloads((count) => count + 1)}
            disabled={isLoading}
            className="cursor-pointer rounded-leaf text-sm font-semibold text-navy underline decoration-line decoration-2 underline-offset-4 focus-ring hover:decoration-yellow disabled:cursor-wait disabled:text-muted"
          >
            {isLoading ? 'Načítavam…' : 'Obnoviť'}
          </button>
        </div>
      </div>
      <p className="text-[0.8125rem]/5 text-muted">
        Zmeny z webu aj z tabuľky. Poznámky sa dopisujú v hárku do stĺpca „Note (manual)“.
      </p>

      {!result ? (
        <p role="status" className="mt-3 text-sm text-muted">
          Načítavam históriu zmien…
        </p>
      ) : !result.ok ? (
        <p
          role="alert"
          className="mt-3 rounded-card bg-yellow-tint p-3 text-sm/6 font-semibold text-navy"
        >
          {result.error}
        </p>
      ) : result.entries.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Zatiaľ tu nie sú žiadne zmeny.</p>
      ) : (
        <ChangelogList entries={result.entries} />
      )}
    </section>
  )
}

export default ChangelogPanel
