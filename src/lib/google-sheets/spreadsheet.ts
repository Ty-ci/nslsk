// The one spreadsheet behind the whole site. Its tabs: `otazky` and `eventy`
// (archive), `onboarding` (the checklist), `vyzvy` (open calls), `changelog`
// and `keys` (passwords, see
// `src/lib/access/`).

import 'server-only'

import { cleanEnv, getTabIds } from '@/lib/google-sheets/client'

const DEFAULT_SPREADSHEET_ID = '1tPsKzTG5HsgUTo_j58fy2oiBxCvrqp3PQx1CX6T2zcA'

/** Overridable through `GOOGLE_SHEET_ID`, so a copy can be used in dev. */
export const spreadsheetId = (): string =>
  cleanEnv(process.env.GOOGLE_SHEET_ID) || DEFAULT_SPREADSHEET_ID

/** Tab ids only change when a tab is deleted and re-created: looked up once. */
let tabIds: Promise<Map<string, number>> | undefined

/**
 * A link that opens the spreadsheet on the given tab, for people who edit it
 * by hand. Opening it still needs a Google account the sheet is shared with.
 * Without a tab id (lookup failed, tab renamed), it opens the first tab.
 */
export const tabUrl = async (title: string): Promise<string> => {
  const base = `https://docs.google.com/spreadsheets/d/${spreadsheetId()}/edit`

  tabIds ??= getTabIds(spreadsheetId()).catch((error: unknown) => {
    tabIds = undefined
    throw error
  })
  const gid = await tabIds.then((ids) => ids.get(title)).catch(() => undefined)

  return gid === undefined ? base : `${base}#gid=${gid}`
}
