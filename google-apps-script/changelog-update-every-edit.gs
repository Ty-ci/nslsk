/**
 * Changelog for edits made BY HAND in the infoweb spreadsheet.
 *
 * Install once: in the spreadsheet, Extensions → Apps Script, paste this whole
 * file into Code.gs and Save. That's all — `onEdit` is a simple trigger, it
 * runs by itself on every manual edit, no authorisation or trigger setup.
 *
 * Every edit in a logged tab adds a row to the `changelog` tab:
 *   Timestamp | Route | Change | Note (manual)
 * with the Change tagged `[tabuľka]`. Changes made on the website are logged
 * by the website itself (tagged `[web]`); Google doesn't run edit triggers for
 * writes through the API, so nothing is logged twice.
 *
 * Not seen by `onEdit` (a Google limitation): inserting or deleting whole rows
 * and columns, sorting, and edits made by other scripts.
 *
 * Timestamps use the spreadsheet's time zone (File → Settings) — keep it on
 * (GMT+01:00) Bratislava so they line up with the website's rows.
 */

/** Which tabs are logged, and the website route each one belongs to. */
const LOGGED_TABS = { onboarding: '/onboarding' }

const CHANGELOG_TAB = 'changelog'
/** Rows 1–2 are instructions, row 3 the header — in every tab. */
const HEADER_ROW = 3
/** A paste larger than this is logged as one line, not cell by cell. */
const MAX_CELLS = 20

const normalize = (value) => String(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

function onEdit(e) {
  const sheet = e.range.getSheet()
  const route = LOGGED_TABS[sheet.getName()]
  const log = e.source.getSheetByName(CHANGELOG_TAB)
  if (!route || !log) {
    return
  }

  const header = sheet.getRange(HEADER_ROW, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
  const find = (matches, fallback) => {
    const index = header.findIndex((name) => matches(normalize(name)))
    return index === -1 ? fallback : index + 1
  }
  const idColumn = find((name) => name === 'id', 1)
  const titleColumn = find((name) => name.startsWith('uloha'), 3)
  // `Tím` and the people after it hold 1 / 0 — shown as hotovo / nehotovo.
  const firstStatusColumn = find((name) => name === 'tim', 7)

  const describeValue = (value, column) => {
    const text = value === undefined || value === null ? '' : String(value)
    if (column >= firstStatusColumn && (text === '1' || text === '0')) {
      return text === '1' ? 'hotovo' : 'nehotovo'
    }
    return text === '' ? '(prázdne)' : `„${text}“`
  }

  const describeCell = (row, column, oldValue, newValue) => {
    const columnName = header[column - 1] || `stĺpec ${column}`
    const a1 = sheet.getRange(row, column).getA1Notation()
    if (row <= HEADER_ROW) {
      return `Hlavička / inštrukcie ${a1}: ${describeValue(oldValue, 0)} → ${describeValue(newValue, 0)}`
    }
    const task =
      sheet.getRange(row, titleColumn).getDisplayValue() ||
      sheet.getRange(row, idColumn).getDisplayValue() ||
      `riadok ${row}`
    const change =
      oldValue === undefined
        ? `nastavené na ${describeValue(newValue, column)}`
        : `${describeValue(oldValue, column)} → ${describeValue(newValue, column)}`
    return `${columnName} — „${task}“: ${change}`
  }

  const range = e.range
  const cells = range.getNumRows() * range.getNumColumns()
  const lines = []

  if (cells === 1) {
    // `oldValue` is only given for single cells; a cell that was empty has none.
    lines.push(
      describeCell(range.getRow(), range.getColumn(), e.oldValue ?? '', range.getDisplayValue()),
    )
  } else if (cells <= MAX_CELLS) {
    const values = range.getDisplayValues()
    values.forEach((rowValues, r) =>
      rowValues.forEach((value, c) =>
        lines.push(describeCell(range.getRow() + r, range.getColumn() + c, undefined, value)),
      ),
    )
  } else {
    lines.push(`Hromadná úprava ${range.getA1Notation()} (${cells} buniek)`)
  }

  const now = new Date()
  lines.forEach((line) => log.appendRow([now, route, `[tabuľka] ${line}`, '']))
}
