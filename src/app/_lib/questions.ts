import type { SheetQuestion } from '@/app/_lib/sheetContent'

const dateFormat = new Intl.DateTimeFormat('sk-SK', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
})

/** `2026-08-22` → `22. 8. 2026`, the way the date is printed on the entry. */
export const formatQuestionDate = (isoDate: string) =>
  dateFormat.format(new Date(`${isoDate}T00:00:00`))

/** Lower-cases and drops diacritics, so „odpoveď" is found by typing „odpoved". */
const normalize = (value: string): string =>
  value.normalize('NFD').replaceAll(/\p{Diacritic}/gu, '').toLowerCase()

/**
 * Everything a question can be found by, flattened into one string: the
 * question, the answer, and the date in the forms people actually type it —
 * as printed (`22. 8. 2026`), without the spaces (`22.8.2026`) and as ISO.
 */
export const questionHaystack = (question: SheetQuestion): string => {
  const printedDate = question.date ? formatQuestionDate(question.date) : ''

  return normalize(
    [
      question.question,
      question.answer,
      printedDate,
      printedDate.replaceAll(' ', ''),
      question.date ?? '',
    ].join('\n'),
  )
}

/** Splits a query into words; a question matches when it contains all of them. */
export const queryTerms = (query: string): string[] =>
  normalize(query).split(/\s+/).filter(Boolean)
