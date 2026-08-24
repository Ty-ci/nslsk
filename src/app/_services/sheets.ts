// Reads the Google Sheet that sits behind the Q&A form and turns it into the
// payload the site consumes. Runs server-side only: the service-account key
// never reaches the browser, and neither do the sheet's private columns
// (contact details, moderation status, unpublished rows).
//
// Same credentials as the safari project — GOOGLE_SERVICE_ACCOUNT_EMAIL and
// GOOGLE_PRIVATE_KEY, shared with the service account the sheet is shared with.
//
// The service-account handshake is done by hand rather than through
// `google-auth-library`: one signed JWT and one token request is all a
// read-only Sheets call needs, and it keeps the dependency out of the tree.

import 'server-only'

import { createSign } from 'node:crypto'

import type { SheetContent, SheetEvent, SheetQuestion } from '@/app/_lib/sheetContent'

/** The form's response spreadsheet. Overridable so a copy can be used in dev. */
const DEFAULT_SPREADSHEET_ID = '1tPsKzTG5HsgUTo_j58fy2oiBxCvrqp3PQx1CX6T2zcA'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly'

/** Both sheets carry two rows of instructions above the header row. */
const HEADER_ROW = 3

const QUESTIONS_RANGE = `otazky!A1:H1000`
const EVENTS_RANGE = `eventy!A1:D1000`

/** How long a fetched payload is reused within one warm function instance. */
const CACHE_TTL_MS = 60_000

type Rows = string[][]

/**
 * `.env.local` writes values as `KEY = value,` and Netlify's UI stores the key
 * with escaped newlines, so both the wrapping punctuation and the `\n` escapes
 * have to come off before anything can parse them.
 */
const cleanEnv = (value: string | undefined): string =>
  (value ?? '')
    .trim()
    .replace(/^["']/, '')
    .replace(/["',]+$/, '')
    .trim()

const readCredentials = () => {
  const email = cleanEnv(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
  const key = cleanEnv(process.env.GOOGLE_PRIVATE_KEY).replaceAll('\\n', '\n')

  if (!email || !key) {
    throw new Error(
      'Missing Google credentials — set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY.',
    )
  }

  return { email, key }
}

const base64Url = (value: string): string => Buffer.from(value).toString('base64url')

let token: { value: string; expiresAt: number } | undefined

/**
 * An OAuth access token for the service account, via the JWT-bearer flow:
 * sign `{header}.{claims}` with the account's private key, hand the assertion
 * to Google, get a bearer token back. Reused until shortly before it expires.
 */
const getAccessToken = async (): Promise<string> => {
  if (token && token.expiresAt > Date.now()) {
    return token.value
  }

  const { email, key } = readCredentials()
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload = [
    base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
    base64Url(
      JSON.stringify({
        iss: email,
        scope: SCOPE,
        aud: TOKEN_URL,
        iat: issuedAt,
        exp: issuedAt + 3600,
      }),
    ),
  ].join('.')

  const signature = createSign('RSA-SHA256').update(payload).sign(key, 'base64url')

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${payload}.${signature}`,
    }),
  })

  if (!response.ok) {
    throw new Error(`Google refused the service-account assertion (${response.status}).`)
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: number }
  if (!data.access_token) {
    throw new Error('Google returned no access token for the service account.')
  }

  // A minute of head room, so a token never expires mid-request.
  token = {
    value: data.access_token,
    expiresAt: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000,
  }

  return token.value
}

/** Reads several ranges of the spreadsheet in a single API call. */
const fetchRanges = async (ranges: string[]): Promise<Rows[]> => {
  const spreadsheetId = cleanEnv(process.env.GOOGLE_SHEET_ID) || DEFAULT_SPREADSHEET_ID
  const accessToken = await getAccessToken()

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet`,
  )
  ranges.forEach((range) => url.searchParams.append('ranges', range))
  // Empty trailing cells come back as missing rather than as empty strings, so
  // every row has to be read defensively below.
  url.searchParams.set('majorDimension', 'ROWS')

  const response = await fetch(url, { headers: { authorization: `Bearer ${accessToken}` } })

  if (!response.ok) {
    throw new Error(`Google Sheets API returned ${response.status}: ${await response.text()}`)
  }

  const data = (await response.json()) as { valueRanges?: { values?: Rows }[] }

  return ranges.map((_, index) => data.valueRanges?.[index]?.values ?? [])
}

/** Lower-cases, drops diacritics and collapses spaces, for matching headers. */
const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replaceAll(/\s+/g, ' ')
    .trim()

const cell = (row: string[] | undefined, index: number): string => (row?.[index] ?? '').trim()

/**
 * Locates a column by matching its header, falling back to the position the
 * column has today. Renaming a header in the sheet shouldn't break the site,
 * and neither should inserting a column.
 */
const columnFinder = (headerRow: string[]) => {
  const headers = headerRow.map(normalize)

  return (matches: (header: string) => boolean, fallbackIndex: number): number => {
    const found = headers.findIndex((header) => header !== '' && matches(header))

    return found === -1 ? fallbackIndex : found
  }
}

/** A checkbox column reads as `TRUE`; humans typing by hand write other things. */
const isTruthyCell = (value: string): boolean =>
  ['true', 'ano', 'áno', 'yes', 'x', '1', '✓'].includes(normalize(value))

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
    .map((row, index) => ({
      // Kept in sheet order: the candidates curate the list themselves, and
      // “Termín” is free text, so it can't be sorted on reliably.
      id: `e-${HEADER_ROW + index + 1}`,
      title: cell(row, titleAt),
      form: cell(row, formAt),
      term: cell(row, termAt),
      description: cell(row, descriptionAt),
    }))
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

  const [questionRows, eventRows] = await fetchRanges([QUESTIONS_RANGE, EVENTS_RANGE])
  const content: SheetContent = {
    questions: parseQuestions(questionRows),
    events: parseEvents(eventRows),
  }

  cache = { expiresAt: Date.now() + CACHE_TTL_MS, content }

  return content
}
