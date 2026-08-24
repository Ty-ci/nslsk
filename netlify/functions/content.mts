// GET /api/content — the sheet-backed part of the site (published Q&A entries
// and meeting slots), as JSON. See `netlify.toml` for the /api rewrite and
// `netlify/lib/sheets.mts` for what is read and what is deliberately withheld.

import { loadSheetContent } from '../lib/sheets.mts'

export default async () => {
  try {
    const content = await loadSheetContent()

    return Response.json(content, {
      headers: {
        // Short cache with a long grace window: the page stays fast, an answer
        // added in the sheet shows up within about a minute.
        'cache-control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to read the content spreadsheet:', error)

    return Response.json(
      { error: 'Content is temporarily unavailable.' },
      { status: 502, headers: { 'cache-control': 'no-store' } },
    )
  }
}
