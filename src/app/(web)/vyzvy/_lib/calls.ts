// Pure helpers the call views share: Slovak labels, sorting and the filter
// options read out of the calls themselves.

import { slug } from '@/app/(web)/vyzvy/_lib/slug'
import type { CallStatus, OpenCall } from '@/app/(web)/vyzvy/_lib/types'

/** Slovak plural: `plural(3, ['deň', 'dni', 'dní'])` → `dni`. */
export const plural = (count: number, [one, few, many]: [string, string, string]) =>
  count === 1 ? one : count >= 2 && count <= 4 ? few : many

/** `3 otvorené výzvy`, `5 otvorených výziev`. */
export const openCount = (count: number) =>
  count === 0
    ? 'Žiadna otvorená výzva'
    : `${count} ${plural(count, ['otvorená výzva', 'otvorené výzvy', 'otvorených výziev'])}`

const closedLabels = {
  deadline: 'Uzavretá',
  filled: 'Obsadená',
  cancelled: 'Zrušená',
  closed: 'Uzavretá',
} as const

/** `Končí dnes`, `Končí zajtra`, `Končí o 3 dni`. */
const closingLabel = (daysLeft: number) =>
  daysLeft === 0
    ? 'Končí dnes'
    : daysLeft === 1
      ? 'Končí zajtra'
      : `Končí o ${daysLeft} ${plural(daysLeft, ['deň', 'dni', 'dní'])}`

/** The short status a card's tag says. */
export const statusLabel = (call: OpenCall): string => {
  const labels: Record<CallStatus, () => string> = {
    draft: () => 'Koncept',
    scheduled: () => (call.publishFrom ? `Otvoríme ${call.publishFrom.label}` : 'Pripravujeme'),
    open: () => 'Otvorená',
    closing: () => closingLabel(call.daysLeft ?? 0),
    closed: () => closedLabels[call.closedReason ?? 'closed'],
  }

  return labels[call.status]()
}

export const isActive = (call: OpenCall) => call.status !== 'closed'

/** Sort key for the date a call is about: its deadline, or when it opens. */
const keyDate = (call: OpenCall) => call.deadline?.iso ?? call.publishFrom?.iso

const rank: Record<CallStatus, number> = {
  closing: 0,
  open: 0,
  draft: 0,
  scheduled: 1,
  closed: 2,
}

/** Earlier first (`-1`: later first); a missing date goes last either way. */
const compareDates = (dateA: string | undefined, dateB: string | undefined, direction = 1) =>
  dateA === dateB
    ? 0
    : dateA === undefined
      ? 1
      : dateB === undefined
        ? -1
        : direction * dateA.localeCompare(dateB)

/**
 * What's still open first, soonest deadline on top and rolling calls after
 * them; then what opens later, soonest first. Ties keep the sheet's order.
 */
export const byUrgency = (a: OpenCall, b: OpenCall): number =>
  rank[a.status] - rank[b.status] ||
  (a.status === 'scheduled'
    ? compareDates(a.publishFrom?.iso, b.publishFrom?.iso)
    : compareDates(a.deadline?.iso, b.deadline?.iso)) ||
  a.row - b.row

/** Closed calls: the most recently closed first. */
export const byRecency = (a: OpenCall, b: OpenCall): number =>
  compareDates(keyDate(a), keyDate(b), -1) || a.row - b.row

/** A process's calls in the order they happen. */
export const byDate = (a: OpenCall, b: OpenCall): number =>
  compareDates(keyDate(a), keyDate(b)) || a.row - b.row

export type FilterOption = { slug: string; label: string; active: number }

/**
 * The distinct values of a column, in the sheet's order of first use, each
 * with how many calls not yet closed carry it. The sheet decides which types
 * and processes exist — nothing is listed in code.
 */
export const optionsOf = (calls: OpenCall[], field: 'type' | 'process'): FilterOption[] => {
  const options = new Map<string, FilterOption>()
  ;[...calls]
    .sort((a, b) => a.row - b.row)
    .forEach((call) => {
      const label = call[field]
      if (label === '') {
        return
      }

      const key = slug(label)
      const option = options.get(key) ?? { slug: key, label, active: 0 }
      option.active += isActive(call) ? 1 : 0
      options.set(key, option)
    })

  return [...options.values()]
}
