'use server'

import { loadCalls, MissingTabError } from '@/app/(web)/vyzvy/_lib/sheet'
import type { CallsResult } from '@/app/(web)/vyzvy/_lib/types'
import { hasAccess } from '@/lib/access/check'
import { accessFor, editAccessFor } from '@/lib/navigation'

/**
 * The open calls, for a browser holding the view password. The page only
 * hides behind the password in the browser; this is what guards the sheet.
 * With the edit password too, drafts and the sheet's issues come along — a
 * wrong or missing one just leaves them out.
 */
export const getCalls = async (password: unknown, editPassword: unknown): Promise<CallsResult> => {
  if (!(await hasAccess(accessFor('/vyzvy'), password))) {
    return { ok: false, error: 'Heslo už neplatí — obnov stránku a zadaj ho znova.' }
  }

  const isEditor = await hasAccess(editAccessFor('/vyzvy'), editPassword)

  try {
    return { ok: true, data: await loadCalls(isEditor) }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to read the calls sheet:', error)

    return {
      ok: false,
      error:
        error instanceof MissingTabError
          ? 'V tabuľke webu chýba hárok „vyzvy“. Kým ho niekto nepridá, výzvy sa nedajú zobraziť.'
          : 'Výzvy sa nepodarilo načítať. Skús to znova.',
    }
  }
}
