'use server'

import { isPersonKey } from '@/app/(web)/_data/people'
import { loadOnboarding, writeStatus } from '@/app/(web)/onboarding/_lib/sheet'
import type {
  AssigneeKey,
  ChangelogResult,
  LoadResult,
  ToggleResult,
} from '@/app/(web)/onboarding/_lib/types'
import { hasAccess } from '@/lib/access/check'
import { changelogUrl, readChangelog } from '@/lib/changelog/sheet'
import { accessFor, editAccessFor } from '@/lib/navigation'

const isAssignee = (value: unknown): value is AssigneeKey => value === 'tim' || isPersonKey(value)

// The page itself only hides behind the password in the browser; these
// actions are what actually guard the sheet, so each one checks it again.
// Reading takes the view password, writing the edit password.
const isAllowed = (password: unknown) => hasAccess(accessFor('/onboarding'), password)
const isAllowedToEdit = (password: unknown) => hasAccess(editAccessFor('/onboarding'), password)

const denied = { ok: false, error: 'Heslo už neplatí — obnov stránku a zadaj ho znova.' } as const
const editDenied = {
  ok: false,
  error: 'Heslo na úpravy už neplatí — obnov stránku a zadaj ho znova.',
} as const

/** The checklist, for a browser holding the onboarding password. */
export const getOnboarding = async (password: unknown): Promise<LoadResult> => {
  if (!(await isAllowed(password))) {
    return denied
  }

  return { ok: true, data: await loadOnboarding() }
}

/** The checklist's history — ticks from the web and edits made in the sheet. */
export const getOnboardingChangelog = async (password: unknown): Promise<ChangelogResult> => {
  if (!(await isAllowed(password))) {
    return denied
  }

  try {
    const [entries, sheetUrl] = await Promise.all([readChangelog('/onboarding'), changelogUrl()])

    return { ok: true, entries, sheetUrl }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to read the changelog:', error)

    return { ok: false, error: 'Históriu zmien sa nepodarilo načítať. Skús to znova.' }
  }
}

/**
 * Saves one checkbox of the onboarding checklist into the sheet, for a browser
 * holding the edit password. Arguments arrive from the browser, so every one
 * is checked before anything is written.
 */
export const setTaskStatus = async (
  editPassword: unknown,
  taskId: unknown,
  assignee: unknown,
  done: unknown,
): Promise<ToggleResult> => {
  if (typeof taskId !== 'string' || !/^[\w-]{1,64}$/.test(taskId)) {
    return { ok: false, error: 'Neplatná úloha.' }
  }

  if (!isAssignee(assignee) || typeof done !== 'boolean') {
    return { ok: false, error: 'Neplatná zmena.' }
  }

  if (!(await isAllowedToEdit(editPassword))) {
    return editDenied
  }

  try {
    return await writeStatus(taskId, assignee, done)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to write the onboarding sheet:', error)

    return { ok: false, error: 'Zmenu sa nepodarilo uložiť. Skús to znova.' }
  }
}
