// GET /archiv/kandidatka2026/api/content — the sheet-backed part of the archived
// candidacy site (published Q&A entries and meeting slots), as JSON. See
// `_services/content.ts` for what is read and what is deliberately withheld.
//
// Locked like the archive itself: the password (see `src/lib/navigation.ts`)
// comes URI-encoded in the `x-access-key` header, since headers can't
// carry Slovak diacritics as they are.

import { NextResponse } from 'next/server'

import { accessHeader } from '@/app/archiv/kandidatka2026/_lib/sheetContent'
import { loadSheetContent } from '@/app/archiv/kandidatka2026/_services/content'
import { hasAccess } from '@/lib/access/check'
import { accessFor } from '@/lib/navigation'

// The sheet is the CMS: never prerendered at build time, always read live (with
// the service's own short in-memory cache in front of it).
export const dynamic = 'force-dynamic'

const decode = (value: string | null): string => {
  try {
    return decodeURIComponent(value ?? '')
  } catch {
    return ''
  }
}

export const GET = async (request: Request) => {
  const password = decode(request.headers.get(accessHeader))
  if (!(await hasAccess(accessFor('/archiv/kandidatka2026'), password))) {
    return NextResponse.json(
      { error: 'Access denied.' },
      { status: 401, headers: { 'cache-control': 'no-store' } },
    )
  }

  try {
    const content = await loadSheetContent()

    return NextResponse.json(content, {
      headers: {
        // Private: the response depends on the password, so no shared cache
        // may keep it. The browser may, for a minute.
        'cache-control': 'private, max-age=60',
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
