// The onboarding checklist's storage: tab `onboarding` of the site's
// spreadsheet. Like the archive's tabs, two rows of instructions sit above the
// header on row 3:
//
//   ID | Fáza | Úloha | Popis | Zodpovedný | Termín | Tím | Funo | Barča | … | Žubro
//
// Under `Tím` and each person: 1 = done, 0 = to do, empty = not theirs. When Google fails, the page falls back to the bundled
// seed (`_data/seed.json`) and becomes read-only.

import 'server-only'

import { people } from '@/app/(web)/_data/people'
import seed from '@/app/(web)/onboarding/_data/seed.json'
import type {
  AssigneeKey,
  OnboardingData,
  OnboardingTask,
  ToggleResult,
} from '@/app/(web)/onboarding/_lib/types'
import { logChange } from '@/lib/changelog/sheet'
import {
  cell,
  columnFinder,
  columnLetter,
  isTruthyCell,
  normalize,
} from '@/lib/google-sheets/cells'
import { getValues, type Rows, updateValues } from '@/lib/google-sheets/client'
import { spreadsheetId, tabUrl } from '@/lib/google-sheets/spreadsheet'

const TAB = 'onboarding'
const RANGE = `${TAB}!A1:Z500`
const HEADER_ROW = 3

/** Header of each assignee column, in sheet order. */
const assigneeHeaders: { key: AssigneeKey; header: string }[] = [
  { key: 'tim', header: 'Tím' },
  ...people.map(({ key, nickname }) => ({ key, header: nickname })),
]

/** Where each column sits, by header — with today's positions as fallbacks. */
const locateColumns = (headerRow: string[]) => {
  const find = columnFinder(headerRow)

  return {
    id: find((header) => header === 'id', 0),
    phase: find((header) => header.startsWith('faza'), 1),
    title: find((header) => header.startsWith('uloha'), 2),
    description: find((header) => header.startsWith('popis'), 3),
    owner: find((header) => header.startsWith('zodpoved'), 4),
    due: find((header) => header.startsWith('termin'), 5),
    assignees: assigneeHeaders.map(({ key, header }, index) => ({
      key,
      at: find((value) => value === normalize(header), 6 + index),
    })),
  }
}

const parseTasks = (rows: Rows): OnboardingTask[] => {
  const headerRow = rows.at(HEADER_ROW - 1)
  if (!headerRow) {
    return []
  }

  const columns = locateColumns(headerRow)

  return rows
    .slice(HEADER_ROW)
    .filter((row) => cell(row, columns.id) !== '' && cell(row, columns.title) !== '')
    .map((row) => {
      const status: OnboardingTask['status'] = {}
      columns.assignees.forEach(({ key, at }) => {
        const value = cell(row, at)
        if (value !== '') {
          status[key] = isTruthyCell(value)
        }
      })

      return {
        id: cell(row, columns.id),
        phase: cell(row, columns.phase),
        title: cell(row, columns.title),
        description: cell(row, columns.description),
        owner: cell(row, columns.owner),
        due: cell(row, columns.due),
        status,
      }
    })
}

/**
 * The checklist, read fresh on every call — ticks change while people watch,
 * and the tab is small. Never throws: an unreadable sheet means the seed.
 */
export const loadOnboarding = async (): Promise<OnboardingData> => {
  const sheetUrl = tabUrl(TAB)

  try {
    const [rows] = await getValues(spreadsheetId(), [RANGE])

    return { tasks: parseTasks(rows), source: 'sheet', sheetUrl: await sheetUrl }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to read the onboarding sheet:', error)

    return { tasks: seed as OnboardingTask[], source: 'seed', sheetUrl: await sheetUrl }
  }
}

/**
 * Ticks or unticks one cell. The row and column are looked up again right
 * before writing, so someone sorting or inserting rows in the sheet meanwhile
 * can't make this write into the wrong task.
 */
export const writeStatus = async (
  taskId: string,
  assignee: AssigneeKey,
  done: boolean,
): Promise<ToggleResult> => {
  const id = spreadsheetId()
  const [rows] = await getValues(id, [RANGE])
  const headerRow = rows.at(HEADER_ROW - 1)
  if (!headerRow) {
    return { ok: false, error: 'V hárku chýba hlavička.' }
  }

  const columns = locateColumns(headerRow)
  const column = columns.assignees.find(({ key }) => key === assignee)?.at
  const rowIndex = rows.findIndex(
    (row, index) => index >= HEADER_ROW && cell(row, columns.id) === taskId,
  )

  if (column === undefined || rowIndex === -1) {
    return { ok: false, error: 'Úloha sa v hárku nenašla — obnov stránku.' }
  }

  if (cell(rows[rowIndex], column) === '') {
    return { ok: false, error: 'Táto úloha sa tohto človeka netýka.' }
  }

  await updateValues(id, `${TAB}!${columnLetter(column)}${rowIndex + 1}`, [[done ? 1 : 0]])

  const who = assigneeHeaders.find(({ key }) => key === assignee)?.header ?? assignee
  const title = cell(rows[rowIndex], columns.title) || taskId
  await logChange('/onboarding', `${who} — „${title}“: ${done ? 'hotovo' : 'nehotovo'}`)

  return { ok: true }
}
