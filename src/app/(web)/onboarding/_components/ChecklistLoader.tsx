'use client'

import { useEffect, useState } from 'react'

import type { PersonKey } from '@/app/(web)/_data/people'
import Checklist from '@/app/(web)/onboarding/_components/Checklist'
import type { LoadResult } from '@/app/(web)/onboarding/_lib/types'
import { getOnboarding } from '@/app/(web)/onboarding/actions'
import { passwordFor } from '@/lib/access/client'

// The checklist isn't rendered into the page on the server: the sheet's data
// only travels to a browser that sends the password along. This fetches it
// once the access gate has let the page through.
const ChecklistLoader = ({ initialPerson }: { initialPerson: PersonKey | null }) => {
  const [result, setResult] = useState<LoadResult | undefined>()

  useEffect(() => {
    let isActive = true
    void getOnboarding(passwordFor('/onboarding'))
      .catch(() => ({
        ok: false as const,
        error: 'Checklist sa nepodarilo načítať. Skús to znova.',
      }))
      .then((loaded) => {
        if (isActive) {
          setResult(loaded)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  if (!result) {
    return (
      <p role="status" className="py-12 text-center text-sm text-muted">
        Načítavam checklist…
      </p>
    )
  }

  if (!result.ok) {
    return (
      <p role="alert" className="rounded-card bg-yellow-tint p-4 text-sm/6 font-semibold text-navy">
        {result.error}
      </p>
    )
  }

  return <Checklist data={result.data} initialPerson={initialPerson} />
}

export default ChecklistLoader
