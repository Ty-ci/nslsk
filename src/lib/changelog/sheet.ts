// The site's changelog: tab `changelog` of the spreadsheet. Two rows of
// instructions sit above the header on row 3:
//
//   Timestamp | Route | Change | Note (manual)
//
// Rows come from two writers, and never from both for the same edit:
//   - the website, for changes made through it (`logChange` below) — tagged
//     `[web]`;
//   - the spreadsheet's Apps Script (`google-apps-script/changelog.gs`), for
//     edits made by hand in the sheet — tagged `[tabuľka]`. Google doesn't run
//     edit triggers for API writes, so the website's own writes aren't logged
//     twice.
// `Note (manual)` is left for people to fill in.

import 'server-only'

import type { ChangelogEntry, ChangeSource } from '@/lib/changelog/types'
import { cell, columnFinder, normalize, serialToDate } from '@/lib/google-sheets/cells'
import { appendValues, getValues } from '@/lib/google-sheets/client'
import { spreadsheetId, tabUrl } from '@/lib/google-sheets/spreadsheet'

const TAB = 'changelog'
const HEADER_ROW = 3
const MAX_ENTRIES = 300

/** Same zone the spreadsheet runs in, so web rows and script rows line up. */
const TIME_ZONE = 'Europe/Bratislava'

/** `2026-10-14 10:32:05` in Bratislava time — Sheets reads it as a date. */
const timestamp = (date: Date): string =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: TIME_ZONE,
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date)

/**
 * Appends one row for a change made through the website. Never throws: a
 * change that went through shouldn't be reported as failed because its log
 * line didn't.
 */
export const logChange = async (route: string, change: string): Promise<void> => {
  try {
    await appendValues(spreadsheetId(), `${TAB}!A:D`, [
      [timestamp(new Date()), route, `[web] ${change}`, ''],
    ])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to write the changelog:', error)
  }
}

const sourceTag = /^\[(web|tabuľka|tabulka)\]\s*/i

const display = new Intl.DateTimeFormat('sk-SK', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Opens the spreadsheet on the `changelog` tab — for adding notes by hand. */
export const changelogUrl = (): Promise<string> => tabUrl(TAB)

/** Route paths compared without a trailing slash. */
const sameRoute = (a: string, b: string) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '')

/** The changes logged for `route`, newest first. */
export const readChangelog = async (route: string): Promise<ChangelogEntry[]> => {
  const [rows] = await getValues(spreadsheetId(), [`${TAB}!A1:D5000`], { raw: true })
  const headerRow = rows.at(HEADER_ROW - 1)
  if (!headerRow) {
    return []
  }

  const find = columnFinder(headerRow)
  const timestampAt = find(
    (header) => header.startsWith('timestamp') || header.startsWith('cas'),
    0,
  )
  const routeAt = find((header) => header.startsWith('route') || header.startsWith('stranka'), 1)
  const changeAt = find((header) => header.startsWith('change') || header.startsWith('zmena'), 2)
  const noteAt = find((header) => header.startsWith('note') || header.startsWith('poznamka'), 3)

  return rows
    .map((row, index) => ({ row, rowNumber: index + 1 }))
    .slice(HEADER_ROW)
    .filter(({ row }) => sameRoute(cell(row, routeAt), route) && cell(row, changeAt) !== '')
    .map(({ row, rowNumber }): ChangelogEntry => {
      const rawTime = cell(row, timestampAt)
      const serial = Number(rawTime)
      const date = rawTime !== '' && Number.isFinite(serial) ? serialToDate(serial) : undefined
      const text = cell(row, changeAt)
      const tag = sourceTag.exec(text)?.[1]

      return {
        id: `c-${rowNumber}`,
        // A timestamp typed as text by hand is shown as it is.
        when: date ? display.format(date) : rawTime,
        iso: date ? date.toISOString() : '',
        source: tag
          ? ((normalize(tag) === 'web' ? 'web' : 'tabulka') satisfies ChangeSource)
          : undefined,
        change: text.replace(sourceTag, ''),
        note: cell(row, noteAt),
      }
    })
    .sort((a, b) => b.iso.localeCompare(a.iso))
    .slice(0, MAX_ENTRIES)
}
