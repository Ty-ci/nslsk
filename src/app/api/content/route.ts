// GET /api/content — the sheet-backed part of the site (published Q&A entries
// and meeting slots), as JSON. See `src/app/_services/sheets.ts` for what is
// read and what is deliberately withheld.

import { NextResponse } from 'next/server'

import { loadSheetContent } from '@/app/_services/sheets'

// The sheet is the CMS: never prerendered at build time, always read live (with
// the service's own short in-memory cache in front of it).
export const dynamic = 'force-dynamic'

export const GET = async () => {
  try {
    const content = await loadSheetContent()

    return NextResponse.json(content, {
      headers: {
        // Short cache with a long grace window: the page stays fast, an answer
        // added in the sheet shows up within about a minute.
        'cache-control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to read the content spreadsheet:', error)

    return NextResponse.json(
      { error: 'Content is temporarily unavailable.' },
      { status: 502, headers: { 'cache-control': 'no-store' } },
    )
  }
}
