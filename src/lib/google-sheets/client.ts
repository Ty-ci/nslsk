// Server-side access to Google Sheets, shared by every part of the site that
// uses a spreadsheet as its CMS. Runs server-side only: the service-account key
// never reaches the browser.
//
// Credentials come from GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY; a
// spreadsheet has to be shared with that service account (Viewer to be read,
// Editor to be written).
//
// The service-account handshake is done by hand rather than through
// `google-auth-library`: one signed JWT and one token request is all a Sheets
// call needs, and it keeps the dependency out of the tree.

import 'server-only'

import { createSign } from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

/** Read-only is asked for unless a call actually writes. */
const READ_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly'
const WRITE_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

type Scope = typeof READ_SCOPE | typeof WRITE_SCOPE

export type Rows = string[][]

/** What a cell can hold when written, or when read raw. */
type CellValue = string | number | boolean

/**
 * `.env.local` writes values as `KEY = value,` and Netlify's UI stores the key
 * with escaped newlines, so both the wrapping punctuation and the `\n` escapes
 * have to come off before anything can parse them.
 */
export const cleanEnv = (value: string | undefined): string =>
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

/** One cached token per scope, so a write never runs on a read-only token. */
const tokens = new Map<Scope, { value: string; expiresAt: number }>()

/**
 * An OAuth access token for the service account, via the JWT-bearer flow:
 * sign `{header}.{claims}` with the account's private key, hand the assertion
 * to Google, get a bearer token back. Reused until shortly before it expires.
 */
const getAccessToken = async (scope: Scope): Promise<string> => {
  const cached = tokens.get(scope)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value
  }

  const { email, key } = readCredentials()
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload = [
    base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
    base64Url(
      JSON.stringify({
        iss: email,
        scope,
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
  tokens.set(scope, {
    value: data.access_token,
    expiresAt: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000,
  })

  return data.access_token
}

/**
 * Reads several ranges of a spreadsheet in a single API call. Empty trailing
 * cells come back as missing rather than as empty strings, so callers have to
 * read every row defensively (see `cell` in `./cells`).
 *
 * `raw` reads values as stored rather than as displayed — dates then arrive as
 * serial numbers (see `serialToDate` in `./cells`), the same in every locale.
 */
export const getValues = async (
  spreadsheetId: string,
  ranges: string[],
  { raw = false }: { raw?: boolean } = {},
): Promise<Rows[]> => {
  const accessToken = await getAccessToken(READ_SCOPE)

  const url = new URL(`${SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values:batchGet`)
  ranges.forEach((range) => url.searchParams.append('ranges', range))
  url.searchParams.set('majorDimension', 'ROWS')
  if (raw) {
    url.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE')
    url.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER')
  }

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Google Sheets API returned ${response.status}: ${await response.text()}`)
  }

  // Raw reads return numbers and booleans too; everything leaves here a string.
  const data = (await response.json()) as {
    valueRanges?: { values?: CellValue[][] }[]
  }

  return ranges.map((_, index) =>
    (data.valueRanges?.[index]?.values ?? []).map((row) => row.map(String)),
  )
}

/** Tab title → its numeric id (the `gid` in a spreadsheet's URL). */
export const getTabIds = async (spreadsheetId: string): Promise<Map<string, number>> => {
  const accessToken = await getAccessToken(READ_SCOPE)

  const url = new URL(`${SHEETS_API}/${encodeURIComponent(spreadsheetId)}`)
  url.searchParams.set('fields', 'sheets.properties(sheetId,title)')

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Google Sheets API returned ${response.status}: ${await response.text()}`)
  }

  const data = (await response.json()) as {
    sheets?: { properties?: { sheetId?: number; title?: string } }[]
  }

  return new Map(
    (data.sheets ?? []).flatMap(({ properties }) =>
      properties?.title !== undefined && properties.sheetId !== undefined
        ? [[properties.title, properties.sheetId] as const]
        : [],
    ),
  )
}

/**
 * Overwrites one A1 range (`onboarding!H12`) with the given rows. Values are
 * entered as if typed, so `TRUE` lands as a boolean and keeps a checkbox cell a
 * checkbox. Needs the service account to be an Editor of the spreadsheet.
 */
export const updateValues = async (
  spreadsheetId: string,
  range: string,
  values: CellValue[][],
): Promise<void> => {
  const accessToken = await getAccessToken(WRITE_SCOPE)

  const url = new URL(
    `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`,
  )
  url.searchParams.set('valueInputOption', 'USER_ENTERED')

  const response = await fetch(url, {
    method: 'PUT',
    headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Google Sheets API returned ${response.status}: ${await response.text()}`)
  }
}

/**
 * Adds rows under the last filled row of a table (`changelog!A:D`). Values are
 * entered as if typed, so `2026-10-14 10:32:05` lands as a real date.
 */
export const appendValues = async (
  spreadsheetId: string,
  range: string,
  values: CellValue[][],
): Promise<void> => {
  const accessToken = await getAccessToken(WRITE_SCOPE)

  const url = new URL(
    `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append`,
  )
  url.searchParams.set('valueInputOption', 'USER_ENTERED')
  url.searchParams.set('insertDataOption', 'INSERT_ROWS')

  const response = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ majorDimension: 'ROWS', values }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Google Sheets API returned ${response.status}: ${await response.text()}`)
  }
}
