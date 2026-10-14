/**
 * Changelog for edits made BY HAND in the infoweb spreadsheet.
 *
 * Install once: in the spreadsheet, Extensions → Apps Script, paste this whole
 * file into Code.gs and Save. That's all — `onEdit` is a simple trigger, it
 * runs by itself on every manual edit, no authorisation or trigger setup.
 *
 * Edits in a logged tab add rows to the `changelog` tab:
 *   Timestamp | Route | Change | Note (manual)
 * with the Change tagged `[tabuľka]`. Changes made on the website are logged
 * by the website itself (tagged `[web]`); Google doesn't run edit triggers for
 * writes through the API, so nothing is logged twice.
 *
 * One task row, one entry: edits to the same row within MERGE_MINUTES of each
 * other are gathered into a single line —
 *   „Úloha“ — Funo: hotovo; Termín: „do 25. 10.“ → „do 31. 10.“
 * Each new edit rewrites that line (and moves its timestamp to the latest
 * edit). A cell changed back and forth shows only its net change; a row whose
 * changes all cancel out removes its entry. Once someone writes a Note on the
 * entry, or MERGE_MINUTES pass without an edit, the next edit starts a new one.
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
/** A paste larger than this is logged as one line, not row by row. */
const MAX_CELLS = 20
/** How long a row's entry stays open for further edits after the last one. */
const MERGE_MINUTES = 10

const normalize = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

const asText = (value) => (value === undefined || value === null ? '' : String(value))

function onEdit(e) {
  const sheet = e.range.getSheet()
  const route = LOGGED_TABS[sheet.getName()]
  const log = e.source.getSheetByName(CHANGELOG_TAB)
  if (!route || !log) {
    return
  }

  // Quick edits fire overlapping triggers; without the lock two of them could
  // both miss the open entry and log the same row twice.
  const lock = LockService.getDocumentLock()
  lock.waitLock(20000)
  try {
    logEdit(e, sheet, route, log)
  } finally {
    lock.releaseLock()
  }
}

function logEdit(e, sheet, route, log) {
  const header = sheet.getRange(HEADER_ROW, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
  const find = (matches, fallback) => {
    const index = header.findIndex((name) => matches(normalize(name)))
    return index === -1 ? fallback : index + 1
  }
  const tab = {
    sheet,
    route,
    log,
    header,
    idColumn: find((name) => name === 'id', 1),
    titleColumn: find((name) => name.startsWith('uloha'), 3),
    // `Tím` and the people after it hold 1 / 0 — shown as hotovo / nehotovo.
    firstStatusColumn: find((name) => name === 'tim', 7),
  }

  const range = e.range
  const cells = range.getNumRows() * range.getNumColumns()
  const now = new Date()

  if (cells > MAX_CELLS) {
    appendEntry(log, [
      now,
      route,
      `[tabuľka] Hromadná úprava ${range.getA1Notation()} (${cells} buniek)`,
      '',
    ])
    return
  }

  range.getDisplayValues().forEach((rowValues, r) => {
    const row = range.getRow() + r
    const edits = rowValues.map((value, c) => ({
      column: range.getColumn() + c,
      // `oldValue` is only given for single cells; a cell that was empty has none.
      from: cells === 1 ? asText(e.oldValue) : undefined,
      to: value,
    }))

    if (row <= HEADER_ROW) {
      edits.forEach((edit) =>
        appendEntry(log, [now, route, `[tabuľka] ${describeHeaderEdit(tab, row, edit)}`, '']),
      )
    } else {
      logRowEdits(tab, row, edits, now)
    }
  })
}

/** Folds this edit into the row's open entry, or opens a new one. */
function logRowEdits(tab, row, edits, now) {
  const { sheet, route, log, header } = tab
  const id = sheet.getRange(row, tab.idColumn).getDisplayValue()
  const task = sheet.getRange(row, tab.titleColumn).getDisplayValue() || id || `riadok ${row}`
  // By ID, so the entry follows the task even if the rows get sorted meanwhile.
  const key = `changelog:${sheet.getName()}:${id || `riadok-${row}`}`
  const cache = CacheService.getDocumentCache()
  const saved = JSON.parse(cache.get(key) || 'null')
  const open = saved && isStillOpen(log, route, saved) ? saved : null

  const changes = open ? open.changes : {}
  edits.forEach(({ column, from, to }) => {
    const earlier = changes[column]
    changes[column] = {
      column,
      name: header[column - 1] || `stĺpec ${column}`,
      // The first known value stays, so a cell edited twice shows one net change.
      from: earlier ? earlier.from : from,
      to,
    }
  })

  const text = describeRow(tab, task, changes)

  if (!text) {
    // Everything was changed back: the entry has nothing left to say.
    if (open) {
      log.deleteRow(open.logRow)
    }
    cache.remove(key)
    return
  }

  let logRow
  if (open) {
    logRow = open.logRow
    log.getRange(logRow, 1, 1, 3).setValues([[now, route, text]])
  } else {
    logRow = appendEntry(log, [now, route, text, ''])
  }

  cache.put(key, JSON.stringify({ logRow, text, changes }), MERGE_MINUTES * 60)
}

/**
 * The remembered entry is still the row it was: nobody sorted or deleted rows
 * in `changelog`, rewrote the text, or started a note on it.
 */
function isStillOpen(log, route, saved) {
  if (saved.logRow > log.getLastRow()) {
    return false
  }
  const [, entryRoute, change, note] = log.getRange(saved.logRow, 1, 1, 4).getValues()[0]
  return entryRoute === route && change === saved.text && asText(note) === ''
}

/** Appends a row and returns its number. */
function appendEntry(log, entry) {
  log.appendRow(entry)
  const last = log.getLastRow()
  // The website may append at the same moment; find our row if it slipped.
  for (let row = last; row > Math.max(HEADER_ROW, last - 5); row -= 1) {
    if (log.getRange(row, 3).getValue() === entry[2]) {
      return row
    }
  }
  return last
}

function describeValue(tab, value, column) {
  const text = asText(value)
  if (column >= tab.firstStatusColumn && (text === '1' || text === '0')) {
    return text === '1' ? 'hotovo' : 'nehotovo'
  }
  return text === '' ? '(prázdne)' : `„${text}“`
}

function describeChange(tab, { column, name, from, to }) {
  const isStatus = column >= tab.firstStatusColumn && /^[01]$/.test(asText(to))
  if (isStatus || from === undefined) {
    // A 1 / 0 box only has one other state — the new one says it all.
    return `${name}: ${describeValue(tab, to, column)}`
  }
  return `${name}: ${describeValue(tab, from, column)} → ${describeValue(tab, to, column)}`
}

/** `[tabuľka] „Úloha“ — Funo: hotovo; Termín: „a“ → „b“`, or '' if nothing is left. */
function describeRow(tab, task, changes) {
  const parts = Object.values(changes)
    .filter(({ from, to }) => from === undefined || asText(from) !== asText(to))
    .sort((a, b) => a.column - b.column)
    .map((change) => describeChange(tab, change))

  return parts.length > 0 ? `[tabuľka] „${task}“ — ${parts.join('; ')}` : ''
}

function describeHeaderEdit(tab, row, { column, from, to }) {
  const a1 = tab.sheet.getRange(row, column).getA1Notation()
  const before = from === undefined ? '' : `${describeValue(tab, from, 0)} → `
  return `Hlavička / inštrukcie ${a1}: ${before}${describeValue(tab, to, 0)}`
}
