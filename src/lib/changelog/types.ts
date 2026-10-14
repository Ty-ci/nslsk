// Shapes of the changelog, shared by the server-side reader and the pages that
// show it. Free of server imports so client components can use them.

/** Where a change was made: on the website, or by hand in the spreadsheet. */
export type ChangeSource = 'web' | 'tabulka'

export type ChangelogEntry = {
  /** Stable-ish key for React — the sheet row number. */
  id: string
  /** As the sheet shows it, e.g. `14. 10. 2026 10:32`; empty if unparseable. */
  when: string
  /** ISO timestamp for sorting and `<time dateTime>`; empty if unparseable. */
  iso: string
  /** `undefined` for rows written by hand without a `[web]`/`[tabuľka]` tag. */
  source?: ChangeSource
  change: string
  note: string
}
