import { useEffect } from 'react'

const baseTitle = 'Spolu do toho · Kandidatúra do N-SLSK 2026'

/**
 * Sets the tab title for a route and puts the one-pager's title back on the
 * way out — the site has no framework-level head management.
 */
export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} · ${baseTitle}` : baseTitle

    return () => {
      document.title = baseTitle
    }
  }, [title])
}
