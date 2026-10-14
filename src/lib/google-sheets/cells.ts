// Pure helpers for reading rows out of a sheet that humans edit by hand:
// headers get renamed, columns get inserted, checkboxes get typed as "áno".
// Nothing here talks to Google — see `./client` for that.

/** Lower-cases, drops diacritics and collapses spaces, for matching headers. */
export const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replaceAll(/\s+/g, ' ')
    .trim()

export const cell = (row: string[] | undefined, index: number): string =>
  (row?.[index] ?? '').trim()

/**
 * Locates a column by matching its header, falling back to the position the
 * column has today. Renaming a header in the sheet shouldn't break the site,
 * and neither should inserting a column.
 */
export const columnFinder = (headerRow: string[]) => {
  const headers = headerRow.map(normalize)

  return (matches: (header: string) => boolean, fallbackIndex: number): number => {
    const found = headers.findIndex((header) => header !== '' && matches(header))

    return found === -1 ? fallbackIndex : found
  }
}

/** `1` or a checkbox's `TRUE`; humans typing by hand write other things. */
export const isTruthyCell = (value: string): boolean =>
  ['1', 'true', 'ano', 'yes', 'x', '✓'].includes(normalize(value))

/**
 * A date cell read raw (days since 30. 12. 1899, the fraction being the time
 * of day) → a Date whose *UTC* fields are the wall-clock time the sheet shows.
 * Format it with `timeZone: 'UTC'` and it reads exactly as in the sheet.
 */
export const serialToDate = (serial: number): Date =>
  new Date(Math.round((serial - 25569) * 86_400_000))

/** 0 → `A`, 25 → `Z`, 26 → `AA`: a column index in A1 notation. */
export const columnLetter = (index: number): string => {
  let letters = ''
  for (let rest = index + 1; rest > 0; rest = Math.floor((rest - 1) / 26)) {
    letters = String.fromCharCode(65 + ((rest - 1) % 26)) + letters
  }

  return letters
}
