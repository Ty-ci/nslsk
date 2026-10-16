'use client'

import { useEffect, useId, useRef, useState } from 'react'

import CallCard from '@/app/(web)/vyzvy/_components/CallCard'
import FilterChips from '@/app/(web)/vyzvy/_components/FilterChips'
import ProcessTimeline from '@/app/(web)/vyzvy/_components/ProcessTimeline'
import {
  byRecency,
  byUrgency,
  isActive,
  openCount,
  optionsOf,
  plural,
} from '@/app/(web)/vyzvy/_lib/calls'
import { slug } from '@/app/(web)/vyzvy/_lib/slug'
import type { CallsData, OpenCall } from '@/app/(web)/vyzvy/_lib/types'

export type Filters = {
  /** Slugs of the selected type and process; `null` for all. */
  type: string | null
  process: string | null
  showClosed: boolean
}

/** `?typ=dobrovolnik&proces=volba-predsedov&uzavrete=1` — what a shared link reopens. */
const filtersUrl = ({ type, process, showClosed }: Filters, hash = '') => {
  const params = new URLSearchParams()
  if (type) {
    params.set('typ', type)
  }
  if (process) {
    params.set('proces', process)
  }
  if (showClosed) {
    params.set('uzavrete', '1')
  }
  const query = params.size > 0 ? `?${params.toString()}` : ''

  return `${window.location.pathname}${query}${hash}`
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

type CallsBoardProps = {
  data: CallsData
  initialFilters: Filters
}

// Every call on one page: the open ones by urgency, the closed ones behind a
// toggle. Filters live in the URL, so a filtered view can be shared, and each
// card has an `#anchor` that opens the page with that card in view — whatever
// filters would otherwise hide it.
const CallsBoard = ({ data, initialFilters }: CallsBoardProps) => {
  const { calls } = data
  const closedListId = useId()
  const [filters, setFilters] = useState(initialFilters)
  const [focus, setFocus] = useState<{ id: string; nonce: number } | null>(null)
  const [copied, setCopied] = useState<{ id: string; ok: boolean } | null>(null)

  const types = optionsOf(calls, 'type')
  const processes = optionsOf(calls, 'process')
  // A slug the sheet no longer has (renamed since the link was shared) means all.
  const type = types.some((option) => option.slug === filters.type) ? filters.type : null
  const process = processes.find((option) => option.slug === filters.process)

  const matches = (call: OpenCall) =>
    (type === null || slug(call.type) === type) &&
    (process === undefined || slug(call.process) === process.slug)
  const shown = calls.filter(matches)
  const current = shown.filter(isActive).sort(byUrgency)
  const closed = shown.filter((call) => !isActive(call)).sort(byRecency)
  const isFiltered = type !== null || process !== undefined

  const openNow = current.filter(
    (call) => call.status === 'open' || call.status === 'closing',
  ).length
  const scheduled = current.filter((call) => call.status === 'scheduled').length
  const drafts = calls.filter((call) => call.status === 'draft').length

  const apply = (next: Filters, hash = '') => {
    setFilters(next)
    window.history.replaceState(null, '', filtersUrl(next, hash))
  }

  const changeFilters = (change: Partial<Filters>) => {
    setFocus(null)
    apply({ ...filters, type, process: process?.slug ?? null, ...change })
  }

  /** Brings one card into view: drops the filters that hide it, opens the closed list if needed. */
  const reveal = (id: string) => {
    const call = calls.find((candidate) => candidate.id === id)
    if (!call) {
      return
    }

    apply(
      {
        type: type !== null && slug(call.type) !== type ? null : type,
        process:
          process !== undefined && slug(call.process) !== process.slug
            ? null
            : (process?.slug ?? null),
        showClosed: filters.showClosed || !isActive(call),
      },
      `#${id}`,
    )
    // A new nonce scrolls again, even to the card already in focus.
    setFocus((previous) => ({ id, nonce: (previous?.nonce ?? 0) + 1 }))
  }

  // Arriving with `#id` (a shared link), or the hash changing later. The
  // listener is added once, so it reaches the current `reveal` through a ref
  // (Next 15's bundled React has no `useEffectEvent` yet).
  const revealRef = useRef(reveal)
  useEffect(() => {
    revealRef.current = reveal
  })
  useEffect(() => {
    const revealFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (id) {
        revealRef.current(id)
      }
    }

    revealFromHash()
    window.addEventListener('hashchange', revealFromHash)

    return () => window.removeEventListener('hashchange', revealFromHash)
  }, [])

  // After the card has rendered: scroll to it and move focus there.
  useEffect(() => {
    if (!focus) {
      return
    }

    const card = document.getElementById(focus.id)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    card?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    card?.focus({ preventScroll: true })
  }, [focus])

  useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timer = window.setTimeout(() => setCopied(null), 2500)

    return () => window.clearTimeout(timer)
  }, [copied])

  const copyLink = async (call: OpenCall) => {
    const url = `${window.location.origin}${window.location.pathname}#${call.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied({ id: call.id, ok: true })
    } catch {
      // No clipboard (insecure context, denied): the link goes to the address bar instead.
      window.history.replaceState(null, '', `#${call.id}`)
      setCopied({ id: call.id, ok: false })
    }
  }

  const copiedTitle = calls.find((call) => call.id === copied?.id)?.title

  const card = (call: OpenCall) => (
    <li key={call.id} className="flex">
      <CallCard
        call={call}
        highlighted={focus?.id === call.id}
        copied={copied?.id === call.id && copied.ok}
        onCopyLink={() => void copyLink(call)}
        onSelectProcess={
          call.process && slug(call.process) !== process?.slug
            ? () => changeFilters({ process: slug(call.process) })
            : undefined
        }
      />
    </li>
  )

  return (
    <div>
      <p role="status" className="sr-only">
        {copied && copiedTitle
          ? copied.ok
            ? `Odkaz na výzvu ${copiedTitle} je skopírovaný.`
            : `Odkaz na výzvu ${copiedTitle} je v adresnom riadku.`
          : ''}
      </p>

      {types.length > 1 || processes.length > 0 ? (
        <div className="mb-6 flex flex-col gap-3">
          {types.length > 1 ? (
            <FilterChips
              label="Typ"
              allLabel="Všetky"
              allActive={calls.filter(isActive).length}
              options={types}
              selected={type}
              onSelect={(next) => changeFilters({ type: next })}
            />
          ) : null}
          {processes.length > 0 ? (
            <FilterChips
              label="Proces"
              allLabel="Všetky"
              allActive={calls.filter(isActive).length}
              options={processes}
              selected={process?.slug ?? null}
              onSelect={(next) => changeFilters({ process: next })}
            />
          ) : null}
        </div>
      ) : null}

      {process ? (
        <ProcessTimeline
          process={process.label}
          calls={calls.filter((call) => slug(call.process) === process.slug)}
          onReveal={reveal}
          onClear={() => changeFilters({ type: null, process: null })}
        />
      ) : null}

      <p className="mb-4 text-sm font-semibold text-navy">
        {openCount(openNow)}
        {scheduled > 0
          ? ` · ${scheduled} ${plural(scheduled, ['pripravovaná', 'pripravované', 'pripravovaných'])}`
          : ''}
        {isFiltered ? <span className="font-normal text-muted"> v tomto výbere</span> : null}
      </p>

      {data.isEditor && drafts > 0 ? (
        <p className="mb-4 rounded-card bg-blue-tint p-4 text-sm/6 text-navy">
          Vidíš aj {drafts} {plural(drafts, ['koncept', 'koncepty', 'konceptov'])}. Ostatní ich
          uvidia, keď v tabuľke zo stĺpca Stav zmažeš „Koncept“.
        </p>
      ) : null}

      {current.length > 0 ? (
        <ul className="flex flex-col gap-4">{current.map(card)}</ul>
      ) : (
        <div className="rounded-card border border-line bg-white p-6 text-center md:p-8">
          <p className="font-semibold text-navy">
            {isFiltered
              ? 'V tomto výbere nie je žiadna otvorená výzva.'
              : 'Momentálne nie je otvorená žiadna výzva.'}
          </p>
          <p className="mt-1 text-sm text-muted">
            {isFiltered
              ? 'Skús iný typ alebo proces, prípadne sa pozri na uzavreté výzvy.'
              : 'Nové výzvy sa objavia tu, hneď ako ich zverejníme.'}
          </p>
          {isFiltered ? (
            <button
              type="button"
              onClick={() => changeFilters({ type: null, process: null })}
              className="mt-4 cursor-pointer rounded-leaf text-sm font-semibold text-navy underline decoration-line decoration-2 underline-offset-4 focus-ring hover:decoration-yellow"
            >
              Zrušiť filtre
            </button>
          ) : null}
        </div>
      )}

      {closed.length > 0 ? (
        <div className="mt-10">
          <button
            type="button"
            aria-expanded={filters.showClosed}
            aria-controls={closedListId}
            onClick={() => changeFilters({ showClosed: !filters.showClosed })}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-leaf text-sm font-semibold text-navy underline decoration-line decoration-2 underline-offset-4 focus-ring hover:decoration-yellow"
          >
            {filters.showClosed
              ? 'Skryť uzavreté výzvy'
              : `Zobraziť uzavreté výzvy (${closed.length})`}
            <Chevron open={filters.showClosed} />
          </button>
          <ul
            id={closedListId}
            hidden={!filters.showClosed}
            aria-label="Uzavreté výzvy"
            className="mt-4 flex flex-col gap-4"
          >
            {closed.map(card)}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default CallsBoard
