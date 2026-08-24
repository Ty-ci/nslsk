import { useEffect, useState } from 'react'

import { emptySheetContent, fetchSheetContent, type SheetContent } from '../sheetContent.ts'

export type SheetContentState = {
  content: SheetContent
  isLoading: boolean
  /** The request failed — the page should say so instead of showing nothing. */
  hasFailed: boolean
}

// One request per page load, shared by everything that asks: the payload holds
// both the Q&A entries and the meeting slots, and the Q&A page and the meetings
// section shouldn't fetch it twice.
let cached: SheetContent | undefined
let pending: Promise<SheetContent> | undefined

const load = (): Promise<SheetContent> => {
  pending ??= fetchSheetContent()
    .then((content) => {
      cached = content

      return content
    })
    .catch((error: unknown) => {
      // Drop the shared promise so a later mount (or a re-visit of the page)
      // gets a fresh attempt instead of the cached failure.
      pending = undefined

      throw error
    })

  return pending
}

/** Published Q&A entries and meeting slots, read from the Google Sheet. */
export const useSheetContent = (): SheetContentState => {
  const [state, setState] = useState<SheetContentState>(() =>
    cached
      ? { content: cached, isLoading: false, hasFailed: false }
      : { content: emptySheetContent, isLoading: true, hasFailed: false },
  )

  useEffect(() => {
    let isActive = true

    if (!cached) {
      load()
        .then((content) => {
          if (isActive) {
            setState({ content, isLoading: false, hasFailed: false })
          }
        })
        .catch(() => {
          if (isActive) {
            setState({ content: emptySheetContent, isLoading: false, hasFailed: true })
          }
        })
    }

    return () => {
      isActive = false
    }
  }, [])

  return state
}
