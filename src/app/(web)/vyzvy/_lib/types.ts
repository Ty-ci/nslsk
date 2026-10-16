// Shapes shared by the server-side sheet reader, the server action and the
// client page. Kept free of server imports so the client can use them.

/**
 * Where a call stands today. Worked out on the server from the dates and the
 * `Stav` cell, so nobody has to close a call by hand:
 * - `draft` — `Stav` is „Koncept“; only people with the edit password see it.
 * - `scheduled` — `Zverejniť od` is still ahead.
 * - `open` — open, with the deadline more than a week away (or none at all).
 * - `closing` — open, with the deadline within a week.
 * - `closed` — the deadline passed, or `Stav` closes it by hand.
 */
export type CallStatus = 'draft' | 'scheduled' | 'open' | 'closing' | 'closed'

/** Why a call is closed: its deadline passed, or which `Stav` closed it. */
export type ClosedReason = 'deadline' | 'filled' | 'cancelled' | 'closed'

/** A date cell as the sheet shows it. */
export type SheetDate = {
  /** The sheet's wall-clock time as an ISO string — for sorting and `<time>`. */
  iso: string
  /** `24. 10. 2026`, or `24. 10. 2026 o 18:00` when the cell holds a time. */
  label: string
}

export type OpenCall = {
  /** From the `ID` column, or made from the title — the card's `#anchor`. */
  id: string
  /** The row in the sheet, for pointing an admin at it. */
  row: number
  title: string
  /** As the sheet spells it (the first spelling, when rows differ in case or accents); `''` when empty. */
  type: string
  process: string
  description: string
  /** Time commitment, free text: „2 – 4 h mesačne“. */
  commitment: string
  /** A name, or an e-mail address (then it's a `mailto:` link). */
  contact: string
  /** The full call document; `''` when missing or not a web address. */
  link: string
  publishFrom?: SheetDate
  /** No deadline means a rolling call („priebežne“). */
  deadline?: SheetDate
  /** A deadline typed as something that isn't a date, shown as it is. */
  deadlineText?: string
  status: CallStatus
  closedReason?: ClosedReason
  /** Calendar days until the deadline, in Bratislava: 0 = today. Only while open. */
  daysLeft?: number
}

/** Something in the sheet the site had to skip, guess or ignore. */
export type SheetIssue = {
  row: number
  title: string
  level: 'error' | 'warning'
  message: string
}

export type CallsData = {
  calls: OpenCall[]
  /** Only for people with the edit password — empty for everyone else. */
  issues: SheetIssue[]
  /** Opens the `vyzvy` tab in Google Sheets. */
  sheetUrl: string
  /** Whether the edit password came along: then drafts and issues are included. */
  isEditor: boolean
}

export type CallsResult = { ok: true; data: CallsData } | { ok: false; error: string }
