// Reads the Google Sheet that sits behind the candidacy's Q&A form and turns it
// into the payload the archived site consumes. Server-side only: the sheet's
// private columns (contact details, moderation status, unpublished rows) never
// leave the server. The Google plumbing itself is shared — see
// `src/lib/google-sheets/`.

import 'server-only'

import type {
  SheetContent,
  SheetEvent,
  SheetQuestion,
} from '@/app/archiv/kandidatka2026/_lib/sheetContent'
import { cell, columnFinder, isTruthyCell, normalize } from '@/lib/google-sheets/cells'
import { getValues, type Rows } from '@/lib/google-sheets/client'
import { spreadsheetId } from '@/lib/google-sheets/spreadsheet'

/** Both sheets carry two rows of instructions above the header row. */
const HEADER_ROW = 3

const QUESTIONS_RANGE = `otazky!A1:H1000`
const EVENTS_RANGE = `eventy!A1:D1000`

/** How long a fetched payload is reused within one warm function instance. */
const CACHE_TTL_MS = 60_000

/** `8/22/2026 16:57:20` (the form's US-formatted stamp) → `2026-08-22`. */
const toIsoDate = (timestamp: string): string | undefined => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(timestamp.trim())
  if (match) {
    const [, month, day, year] = match

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // Anything else (someone pasting a row by hand) — let Date have a go.
  const parsed = new Date(timestamp)

  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10)
}

const toIso = (year: number, month: number, day: number): string | undefined => {
  const date = new Date(Date.UTC(year, month - 1, day))
  // Rejects 31. 2. and friends, which Date would quietly roll into March.
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return undefined
  }

  return date.toISOString().slice(0, 10)
}

/**
 * The first date written in a free-text “Termín” — `12. 10. 2026 o 18:00`,
 * `štvrtok 12.10.` or `2026-10-12`. A missing year means this year. Terms with
 * no date in them (“piatok večer”) give nothing, and such events never count
 * as past.
 */
const dateFromTerm = (term: string): string | undefined => {
  const iso = /(\d{4})-(\d{2})-(\d{2})/.exec(term)
  if (iso) {
    return toIso(Number(iso[1]), Number(iso[2]), Number(iso[3]))
  }

  const slovak = /(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?/.exec(term)
  if (slovak) {
    const year = slovak[3] ? Number(slovak[3]) : new Date().getFullYear()

    return toIso(year, Number(slovak[2]), Number(slovak[1]))
  }

  return undefined
}

const parseQuestions = (rows: Rows): SheetQuestion[] => {
  // The sheet can be shorter than the header row if someone empties it.
  const headerRow = rows.at(HEADER_ROW - 1)
  if (!headerRow) {
    return []
  }

  const find = columnFinder(headerRow)
  const timestampAt = find((header) => header.includes('timestamp') || header.includes('casova'), 0)
  const questionAt = find((header) => header.startsWith('otazka'), 1)
  const nameAt = find((header) => header.includes('meno') && !header.includes('bez'), 2)
  const answerAt = find((header) => header.startsWith('odpoved'), 3)
  const publishAt = find((header) => header.startsWith('zverejnit'), 5)
  // The asker's own consent about their name — a different column to the
  // candidates' "publish this row" checkbox above.
  const nameConsentAt = find((header) => header.includes('webstranke'), 6)

  return rows
    .slice(HEADER_ROW)
    .map((row, index) => ({ row, rowNumber: HEADER_ROW + index + 1 }))
    .filter(({ row }) => isTruthyCell(cell(row, publishAt)) && cell(row, questionAt) !== '')
    .map(({ row, rowNumber }) => {
      const name = cell(row, nameAt)
      // “Áno, aj s mojim menom” vs “Áno, ale bez môjho mena”: anything
      // mentioning “bez”, and anything left blank, is treated as anonymous.
      const consent = normalize(cell(row, nameConsentAt))
      const mayShowName = name !== '' && consent !== '' && !consent.includes('bez')

      const question: SheetQuestion = {
        id: `q-${rowNumber}`,
        question: cell(row, questionAt),
        answer: cell(row, answerAt),
      }

      if (mayShowName) {
        question.name = name
      }

      const date = toIsoDate(cell(row, timestampAt))
      if (date) {
        question.date = date
      }

      return question
    })
    .sort((a, b) => {
      // Answered questions first — an unanswered one at the top of the page
      // reads as an oversight. Newest first within each group.
      const answered = Number(b.answer !== '') - Number(a.answer !== '')

      return answered === 0 ? (b.date ?? '').localeCompare(a.date ?? '') : answered
    })
}

const parseEvents = (rows: Rows): SheetEvent[] => {
  // The sheet can be shorter than the header row if someone empties it.
  const headerRow = rows.at(HEADER_ROW - 1)
  if (!headerRow) {
    return []
  }

  const find = columnFinder(headerRow)
  const titleAt = find((header) => header.startsWith('nazov'), 0)
  const formAt = find((header) => header.startsWith('forma'), 1)
  const termAt = find((header) => header.startsWith('termin'), 2)
  const descriptionAt = find((header) => header.startsWith('popis'), 3)

  return rows
    .slice(HEADER_ROW)
    .map((row, index) => {
      // Kept in sheet order: the candidates curate the list themselves, and
      // “Termín” is free text, so it can't be sorted on reliably.
      const event: SheetEvent = {
        id: `e-${HEADER_ROW + index + 1}`,
        title: cell(row, titleAt),
        form: cell(row, formAt),
        term: cell(row, termAt),
        description: cell(row, descriptionAt),
      }

      const date = dateFromTerm(event.term)
      if (date) {
        event.date = date
      }

      return event
    })
    .filter((event) => event.title !== '' || event.term !== '')
}

let cache: { expiresAt: number; content: SheetContent } | undefined

/**
 * The published Q&A entries and meeting slots. Cached briefly so a burst of
 * visitors doesn't turn into a burst of Sheets API calls.
 */
export const loadSheetContent = async (): Promise<SheetContent> => {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.content
  }

  const [questionRows, eventRows] = await getValues(spreadsheetId(), [
    QUESTIONS_RANGE,
    EVENTS_RANGE,
  ])
  const content: SheetContent = {
    questions: parseQuestions(questionRows),
    events: parseEvents(eventRows),
  }

  cache = { expiresAt: Date.now() + CACHE_TTL_MS, content }

  return content
}
