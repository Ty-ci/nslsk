// Live content that comes out of the Google Sheet behind the Q&A form, rather
// than out of `content.ts`. The sheet is the CMS: candidates answer questions
// and add meeting slots there, and the site picks the changes up without a
// redeploy.
//
// The types live here (and not next to the reader) because both sides need
// them: the server-only `_services/sheets.ts` imports them as types, the React
// code imports the fetcher below.

/** One published question, as it may be shown on the site. */
export type SheetQuestion = {
  /** Stable-ish key for React — the sheet row number. */
  id: string
  question: string
  /** Answer in Markdown, empty until someone writes one. */
  answer: string
  /** Only set when the asker allowed their name to be published. */
  name?: string
  /** ISO date (`2026-08-22`) of the submission, if the timestamp parsed. */
  date?: string
}

/** One meeting / event from the `eventy` sheet. */
export type SheetEvent = {
  id: string
  title: string
  /** Online, or the place — free text. */
  form: string
  /** When it happens — free text, so “piatok večer” works too. */
  term: string
  /** Markdown, may contain `[text](url)` links. */
  description: string
}

export type SheetContent = {
  questions: SheetQuestion[]
  events: SheetEvent[]
}

/** Where the browser asks for the sheet content (`src/app/api/content`). */
export const sheetContentEndpoint = '/api/content'

export const emptySheetContent: SheetContent = { questions: [], events: [] }

/** Fetches the published sheet content. Throws on anything but a clean 200. */
export const fetchSheetContent = async (signal?: AbortSignal): Promise<SheetContent> => {
  const response = await fetch(sheetContentEndpoint, {
    signal,
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Sheet content request failed with ${response.status}`)
  }

  const data = (await response.json()) as Partial<SheetContent>

  return {
    questions: data.questions ?? [],
    events: data.events ?? [],
  }
}
