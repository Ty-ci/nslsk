'use server'

import { hasAccess } from '@/lib/access/check'
import { isAccessKey } from '@/lib/navigation'

/** A wrong guess costs a little time, so the prompt can't be hammered quickly. */
const FAILURE_DELAY_MS = 800

/** Whether `password` unlocks `key`. Called by the password prompt. */
export const verifyAccess = async (key: unknown, password: unknown): Promise<boolean> => {
  const granted = isAccessKey(key) && (await hasAccess(key, password))

  if (!granted) {
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS))
  }

  return granted
}
