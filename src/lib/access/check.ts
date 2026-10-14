// Checks a password against the `keys` tab of the spreadsheet (rows 1–2 are
// instructions, the header `Key | Value | Note` is row 3). Server-side only:
// the passwords never leave the server, the browser only ever learns yes/no.

import 'server-only'

import { createHash, timingSafeEqual } from 'node:crypto'

import { cell, columnFinder } from '@/lib/google-sheets/cells'
import { getValues } from '@/lib/google-sheets/client'
import { spreadsheetId } from '@/lib/google-sheets/spreadsheet'
import type { AccessKey } from '@/lib/navigation'

const RANGE = 'keys!A1:C200'
const HEADER_ROW = 3

/** A password changed in the sheet takes effect within about this long. */
const CACHE_TTL_MS = 60_000

let cache: { expiresAt: number; keys: Map<string, string> } | undefined

const loadKeys = async (): Promise<Map<string, string>> => {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.keys
  }

  const [rows] = await getValues(spreadsheetId(), [RANGE])
  const headerRow = rows.at(HEADER_ROW - 1) ?? []
  const find = columnFinder(headerRow)
  const keyAt = find((header) => header === 'key', 0)
  const valueAt = find((header) => header === 'value', 1)

  const keys = new Map(
    rows
      .slice(HEADER_ROW)
      .map((row) => [cell(row, keyAt), cell(row, valueAt)] as const)
      .filter(([key, value]) => key !== '' && value !== ''),
  )

  cache = { expiresAt: Date.now() + CACHE_TTL_MS, keys }

  return keys
}

// Hashing first makes both sides the same length, which `timingSafeEqual`
// needs, without leaking the password's length through timing.
const digest = (value: string) => createHash('sha256').update(value).digest()

/**
 * Whether `password` unlocks `key`. Fails closed: an unknown key, an empty
 * value in the sheet or an unreadable sheet all mean no.
 */
export const hasAccess = async (key: AccessKey | null, password: unknown): Promise<boolean> => {
  if (key === null) {
    return true
  }

  if (typeof password !== 'string' || password === '' || password.length > 256) {
    return false
  }

  try {
    const expected = (await loadKeys()).get(key)

    return expected !== undefined && timingSafeEqual(digest(password), digest(expected))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to read the keys sheet:', error)

    return false
  }
}
