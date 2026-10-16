// The open calls' storage: tab `vyzvy` of the site's spreadsheet. Like the
// other tabs, two rows of instructions sit above the header on row 3:
//
//   ID | Názov | Typ | Proces | Popis | Náročnosť | Kontakt | Odkaz | Zverejniť od | Uzávierka | Stav
//
// Only `Názov` is required. A call's status follows from its dates — nobody
// closes it by hand — unless `Stav` says otherwise (Koncept, Obsadené, Zrušené,
// Uzavreté). Anything the site has to skip or guess is reported as an issue,
// which people with the edit password see in the page's „Dáta“ tab.

import 'server-only'

import { slug } from '@/app/(web)/vyzvy/_lib/slug'
import type {
  CallsData,
  CallStatus,
  ClosedReason,
  OpenCall,
  SheetDate,
  SheetIssue,
} from '@/app/(web)/vyzvy/_lib/types'
import { cell, columnFinder, normalize, serialToDate } from '@/lib/google-sheets/cells'
import { getValues, type Rows } from '@/lib/google-sheets/client'
import { spreadsheetId, tabUrl } from '@/lib/google-sheets/spreadsheet'

const TAB = 'vyzvy'
const RANGE = `${TAB}!A1:Z500`
const HEADER_ROW = 3

/** The sheet's dates are Bratislava wall-clock time. */
const TIME_ZONE = 'Europe/Bratislava'

/** An open call turns `closing` this many days before its deadline. */
const CLOSING_DAYS = 7

const DAY_MS = 86_400_000

/** Thrown when the spreadsheet has no `vyzvy` tab, so the page can say so. */
export class MissingTabError extends Error {}

/** Where each column sits, by header — with today's positions as fallbacks. */
const locateColumns = (headerRow: string[]) => {
  const find = columnFinder(headerRow)

  return {
    id: find((header) => header === 'id', 0),
    title: find((header) => header.startsWith('nazov'), 1),
    type: find((header) => header.startsWith('typ'), 2),
    process: find((header) => header.startsWith('proces'), 3),
    // „Popis“ or „Krátky popis“.
    description: find((header) => header.includes('popis'), 4),
    commitment: find((header) => header.startsWith('narocnost') || header.startsWith('casova'), 5),
    contact: find((header) => header.startsWith('kontakt'), 6),
    link: find((header) => header.startsWith('odkaz'), 7),
    publishFrom: find((header) => header.startsWith('zverejnit'), 8),
    deadline: find((header) => header.startsWith('uzavierk'), 9),
    state: find((header) => header.startsWith('stav'), 10),
  }
}

// ── Dates ────────────────────────────────────────────────────────────────────
// Every date here is a Date whose *UTC* fields are the wall-clock time in
// Bratislava — the same convention as `serialToDate` — so they compare with
// „now“ taken the same way, and print with `getUTC…`.

type WallClock = { at: Date; hasTime: boolean }

/** Serials outside 2000–2099 are a stray number, not a date. */
const isDateSerial = (serial: number) => serial >= 36_526 && serial < 73_051

const fromParts = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): Date | undefined => {
  const at = new Date(Date.UTC(year, month - 1, day, hour, minute))
  // `Date.UTC` rolls 31. 2. over into March; a real date survives the round trip.
  const isReal =
    at.getUTCFullYear() === year &&
    at.getUTCMonth() === month - 1 &&
    at.getUTCDate() === day &&
    hour < 24 &&
    minute < 60

  return isReal ? at : undefined
}

/**
 * A date cell, read raw: a date the sheet recognised arrives as a serial
 * number; one it didn't (another locale, typed as text) arrives as text, so
 * `24. 10. 2026`, `24.10.2026 18:00` and `2026-10-24` are read too.
 * `undefined` for an empty cell, `'invalid'` for anything else.
 */
const readDate = (value: string): WallClock | 'invalid' | undefined => {
  if (value === '') {
    return undefined
  }

  const serial = Number(value)
  if (Number.isFinite(serial)) {
    if (!isDateSerial(serial)) {
      return 'invalid'
    }
    const at = serialToDate(serial)

    return { at, hasTime: at.getUTCHours() !== 0 || at.getUTCMinutes() !== 0 }
  }

  const slovak = /^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})(?:,?\s*(?:o\s*)?(\d{1,2}):(\d{2}))?$/.exec(
    value,
  )
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[\sT](\d{1,2}):(\d{2}))?$/.exec(value)
  const [year, month, day, hour, minute] = slovak
    ? [slovak[3], slovak[2], slovak[1], slovak[4], slovak[5]]
    : iso
      ? [iso[1], iso[2], iso[3], iso[4], iso[5]]
      : []
  if (year === undefined) {
    return 'invalid'
  }

  const hasTime = hour !== undefined
  const at = fromParts(
    Number(year),
    Number(month),
    Number(day),
    hasTime ? Number(hour) : 0,
    hasTime ? Number(minute) : 0,
  )

  return at ? { at, hasTime } : 'invalid'
}

/** Right now, on a Bratislava wall clock. */
const wallClockNow = (): Date => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((candidate) => candidate.type === type)?.value ?? 0)

  return new Date(
    Date.UTC(
      part('year'),
      part('month') - 1,
      part('day'),
      part('hour'),
      part('minute'),
      part('second'),
    ),
  )
}

const startOfDay = (date: Date): number =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

const twoDigits = (value: number) => String(value).padStart(2, '0')

/** `24. 10. 2026`, plus ` o 18:00` when the cell holds a time (DESIGN_SPECS.md §9). */
const toSheetDate = ({ at, hasTime }: WallClock): SheetDate => {
  const day = `${at.getUTCDate()}. ${at.getUTCMonth() + 1}. ${at.getUTCFullYear()}`

  return {
    iso: at.toISOString().slice(0, hasTime ? 16 : 10),
    label: hasTime ? `${day} o ${at.getUTCHours()}:${twoDigits(at.getUTCMinutes())}` : day,
  }
}

/** A deadline without a time runs to the end of its day. */
const deadlineMoment = ({ at, hasTime }: WallClock): number =>
  hasTime ? at.getTime() : startOfDay(at) + DAY_MS - 1

// ── Other cells ──────────────────────────────────────────────────────────────

type ManualState = { kind: 'none' } | { kind: 'draft' } | { kind: 'closed'; reason: ClosedReason }

/** The `Stav` cell; `undefined` for a value the site doesn't know. */
const readState = (value: string): ManualState | undefined => {
  const state = normalize(value)
  if (state === '' || state.startsWith('otvoren')) {
    return { kind: 'none' }
  }
  if (state.startsWith('koncept')) {
    return { kind: 'draft' }
  }
  if (state.startsWith('obsaden')) {
    return { kind: 'closed', reason: 'filled' }
  }
  if (state.startsWith('zrusen')) {
    return { kind: 'closed', reason: 'cancelled' }
  }
  if (state.startsWith('uzavret') || state.startsWith('ukoncen')) {
    return { kind: 'closed', reason: 'closed' }
  }

  return undefined
}

/** A web address, with a bare `www.…` completed; `undefined` for anything else. */
const readUrl = (value: string): string | undefined => {
  if (/^https?:\/\/\S+$/i.test(value)) {
    return value
  }

  return /^www\.\S+$/i.test(value) ? `https://${value}` : undefined
}

/** Long cell values cut short for an issue message. */
const quote = (value: string) => {
  const shown = value.length > 40 ? `${value.slice(0, 40)}…` : value

  return `„${shown}“`
}

// ── Rows → calls ─────────────────────────────────────────────────────────────

/**
 * One spelling per group of values that differ only in case or accents —
 * „Dobrovoľník“ and „dobrovolnik“ are one type. The first spelling wins, and
 * every other one is reported.
 */
const spellingKeeper = (column: string, issues: SheetIssue[]) => {
  const first = new Map<string, { spelling: string; row: number }>()

  return (value: string, row: number, title: string): string => {
    if (value === '') {
      return ''
    }

    const key = normalize(value)
    const known = first.get(key)
    if (!known) {
      first.set(key, { spelling: value, row })

      return value
    }
    if (known.spelling !== value) {
      issues.push({
        row,
        title,
        level: 'warning',
        message: `${column} ${quote(value)} je napísaný inak ako ${quote(known.spelling)} v riadku ${known.row}. Web ich berie ako jeden, zjednoť ich.`,
      })
    }

    return known.spelling
  }
}

const statusOf = (
  manual: ManualState,
  publishFrom: WallClock | undefined,
  deadline: WallClock | undefined,
  now: Date,
): { status: CallStatus; closedReason?: ClosedReason; daysLeft?: number } => {
  if (manual.kind === 'draft') {
    return { status: 'draft' }
  }
  if (manual.kind === 'closed') {
    return { status: 'closed', closedReason: manual.reason }
  }
  if (deadline && deadlineMoment(deadline) < now.getTime()) {
    return { status: 'closed', closedReason: 'deadline' }
  }
  if (publishFrom && publishFrom.at.getTime() > now.getTime()) {
    return { status: 'scheduled' }
  }
  if (!deadline) {
    return { status: 'open' }
  }

  const daysLeft = Math.round((startOfDay(deadline.at) - startOfDay(now)) / DAY_MS)

  return { status: daysLeft <= CLOSING_DAYS ? 'closing' : 'open', daysLeft }
}

const parseCalls = (rows: Rows): { calls: OpenCall[]; issues: SheetIssue[] } => {
  const headerRow = rows.at(HEADER_ROW - 1)
  if (!headerRow) {
    return { calls: [], issues: [] }
  }

  const columns = locateColumns(headerRow)
  const now = wallClockNow()
  const issues: SheetIssue[] = []
  const keepType = spellingKeeper('Typ', issues)
  const keepProcess = spellingKeeper('Proces', issues)
  const ids = new Map<string, number>()
  const calls: OpenCall[] = []

  rows.forEach((row, index) => {
    const rowNumber = index + 1
    if (rowNumber <= HEADER_ROW || row.every((value) => value.trim() === '')) {
      return
    }

    const title = cell(row, columns.title)
    const report = (level: SheetIssue['level'], message: string) =>
      issues.push({ row: rowNumber, title: title || '(bez názvu)', level, message })

    if (title === '') {
      report('error', 'Chýba názov, takže sa riadok na webe nezobrazí.')

      return
    }

    // The anchor: the `ID` cell, else the title. A clash gets the row number.
    const wantedId = slug(cell(row, columns.id)) || slug(title) || `vyzva-${rowNumber}`
    const clash = ids.get(wantedId)
    const id = clash === undefined ? wantedId : `${wantedId}-${rowNumber}`
    if (clash !== undefined) {
      report(
        'warning',
        `Má rovnaké ID ako riadok ${clash}, preto dostal ID „${id}“. Vpíš mu do stĺpca ID vlastné, aby sa odkaz naň nemenil.`,
      )
    }
    ids.set(id, rowNumber)

    const rawLink = cell(row, columns.link)
    const link = readUrl(rawLink)
    if (rawLink === '') {
      report('warning', 'Chýba odkaz na výzvu, takže karta nemá tlačidlo „Celá výzva“.')
    } else if (!link) {
      report(
        'error',
        `Odkaz ${quote(rawLink)} nie je webová adresa (má začínať https://). Karta je bez tlačidla.`,
      )
    }

    const rawPublishFrom = cell(row, columns.publishFrom)
    const publishFrom = readDate(rawPublishFrom)
    if (publishFrom === 'invalid') {
      report(
        'error',
        `Zverejniť od ${quote(rawPublishFrom)} nie je dátum, takže sa výzva zobrazuje hneď. Zadaj dátum, napr. 24. 10. 2026.`,
      )
    }

    const rawDeadline = cell(row, columns.deadline)
    const deadline = readDate(rawDeadline)
    if (deadline === 'invalid') {
      report(
        'error',
        `Uzávierka ${quote(rawDeadline)} nie je dátum, takže sa výzva sama neuzavrie. Zadaj dátum, napr. 24. 10. 2026.`,
      )
    }

    const validPublishFrom = publishFrom === 'invalid' ? undefined : publishFrom
    const validDeadline = deadline === 'invalid' ? undefined : deadline
    if (
      validPublishFrom &&
      validDeadline &&
      validPublishFrom.at.getTime() > deadlineMoment(validDeadline)
    ) {
      report('warning', 'Zverejniť od je až po uzávierke, takže sa výzva nikdy neotvorí.')
    }

    const rawState = cell(row, columns.state)
    const manual = readState(rawState)
    if (!manual) {
      report(
        'warning',
        `Stav ${quote(rawState)} web nepozná (pozná Koncept, Obsadené, Zrušené a Uzavreté), preto ho ignoruje.`,
      )
    }

    const rawType = cell(row, columns.type)
    if (rawType === '') {
      report('warning', 'Chýba typ, takže sa výzva nedá nájsť filtrom podľa typu.')
    }

    const description = cell(row, columns.description)
    if (description === '') {
      report('warning', 'Chýba popis. Karta ukáže len názov.')
    }

    calls.push({
      id,
      row: rowNumber,
      title,
      type: keepType(rawType, rowNumber, title),
      process: keepProcess(cell(row, columns.process), rowNumber, title),
      description,
      commitment: cell(row, columns.commitment),
      contact: cell(row, columns.contact),
      link: link ?? '',
      publishFrom: validPublishFrom ? toSheetDate(validPublishFrom) : undefined,
      deadline: validDeadline ? toSheetDate(validDeadline) : undefined,
      deadlineText: deadline === 'invalid' ? rawDeadline : undefined,
      ...statusOf(manual ?? { kind: 'none' }, validPublishFrom, validDeadline, now),
    })
  })

  return { calls, issues }
}

/**
 * The calls, read fresh on every call — the admin edits the sheet and expects
 * the page to follow at once, and the tab is small. Drafts and issues are left
 * out unless `isEditor`.
 */
export const loadCalls = async (isEditor: boolean): Promise<CallsData> => {
  const sheetUrl = tabUrl(TAB)

  let rows: Rows
  try {
    ;[rows] = await getValues(spreadsheetId(), [RANGE], { raw: true })
  } catch (error) {
    // Google's answer to a range on a tab that doesn't exist.
    if (error instanceof Error && error.message.includes('Unable to parse range')) {
      throw new MissingTabError(error.message)
    }
    throw error
  }

  const { calls, issues } = parseCalls(rows)

  return {
    calls: isEditor ? calls : calls.filter((call) => call.status !== 'draft'),
    issues: isEditor ? issues : [],
    sheetUrl: await sheetUrl,
    isEditor,
  }
}
