'use client'

import { useEffect, useState } from 'react'

import type { CallsResult } from '@/app/(web)/vyzvy/_lib/types'
import { getCalls } from '@/app/(web)/vyzvy/actions'
import { editPasswordFor, passwordFor, useEditAccess } from '@/lib/access/client'

/**
 * The calls, fetched once the access gate has let the page through: the
 * sheet's data only travels to a browser that sends the password along. A
 * stored edit password goes along from the start, so an admin sees drafts on
 * the first load; unlocking later loads again. While a reload runs, the
 * previous calls stay on screen.
 */
const useCalls = () => {
  const [result, setResult] = useState<CallsResult | undefined>()
  const [reloads, setReloads] = useState(0)
  const [loadedReloads, setLoadedReloads] = useState(-1)
  const edit = useEditAccess('/vyzvy')

  useEffect(() => {
    let isActive = true
    void getCalls(passwordFor('/vyzvy'), editPasswordFor('/vyzvy'))
      .catch(() => ({ ok: false as const, error: 'Výzvy sa nepodarilo načítať. Skús to znova.' }))
      .then((loaded) => {
        if (isActive) {
          setResult(loaded)
          setLoadedReloads(reloads)
        }
      })

    return () => {
      isActive = false
    }
  }, [reloads])

  const reload = () => setReloads((count) => count + 1)

  /** The edit password unlocks drafts and the sheet check: load them right away. */
  const unlock = async (password: string) => {
    const granted = await edit.unlock(password)
    if (granted) {
      reload()
    }

    return granted
  }

  return {
    result,
    isLoading: loadedReloads !== reloads,
    isEditor: result?.ok === true && result.data.isEditor,
    editState: edit.state,
    unlock,
    reload,
  }
}

export type CallsState = ReturnType<typeof useCalls>

export default useCalls
