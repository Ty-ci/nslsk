// Shapes shared by the server-side sheet reader, the server action and the
// client checklist. Kept free of server imports so the client can use them.

import type { PersonKey } from '@/app/(web)/_data/people'
import type { ChangelogEntry } from '@/lib/changelog/types'

/** Who a task's checkbox belongs to: the whole team, or one person. */
export type AssigneeKey = 'tim' | PersonKey

export type OnboardingTask = {
  /** Stable id from the sheet's `ID` column — the server action finds the row by it. */
  id: string
  /** Matches a `phases` label; anything else is grouped under „Ostatné". */
  phase: string
  title: string
  description: string
  owner: string
  due: string
  /** Which documents the task comes from. Absent in the seed. */
  source?: string
  /** `vysoká`, `stredná` or `nízka`. Absent in the seed. */
  importance?: string
  /**
   * One entry per assignee the task applies to: `true` done, `false` to do. An
   * assignee missing here means the task isn't theirs (an empty cell).
   */
  status: Partial<Record<AssigneeKey, boolean>>
}

export type OnboardingData = {
  tasks: OnboardingTask[]
  /**
   * `sheet` — live from the spreadsheet, ticks are saved back.
   * `seed` — the bundled mock data, read-only: the sheet couldn't be read.
   */
  source: 'sheet' | 'seed'
  /** Opens the `onboarding` tab in Google Sheets — handed out only with the data. */
  sheetUrl: string
}

export type LoadResult = { ok: true; data: OnboardingData } | { ok: false; error: string }

export type ToggleResult = { ok: true } | { ok: false; error: string }

export type ChangelogResult =
  | {
      ok: true
      entries: ChangelogEntry[]
      /** Opens the `changelog` tab in Google Sheets — handed out only with the entries. */
      sheetUrl: string
    }
  | { ok: false; error: string }
