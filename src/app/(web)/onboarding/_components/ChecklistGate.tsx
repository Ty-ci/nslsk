'use client'

import type { ReactNode } from 'react'

import EditUnlock from '@/app/(web)/_components/EditUnlock'
import type { OnboardingData } from '@/app/(web)/onboarding/_lib/types'
import type { ChecklistState } from '@/app/(web)/onboarding/_lib/useChecklist'

type ChecklistGateProps = {
  checklist: ChecklistState
  children: (data: OnboardingData) => ReactNode
}

// What every view of the checklist shows around it: a loading line or the load
// error until there's data, then why ticking may be off — and the view itself.
const ChecklistGate = ({ checklist, children }: ChecklistGateProps) => {
  const { result, isMock, edit } = checklist

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

  return (
    <>
      {isMock ? (
        <p className="mb-6 rounded-card bg-blue-tint p-4 text-sm/6 text-navy">
          Google hárok sa teraz nepodarilo načítať, takže vidíš ukážkové dáta. Zaškrtávanie je
          vypnuté — zmeny by sa nikam neuložili.
        </p>
      ) : null}

      {!isMock && edit.state === 'locked' ? (
        <EditUnlock className="mb-6" onUnlock={edit.unlock}>
          Checklist je len na čítanie. Odškrtávať môžeš po zadaní hesla na úpravy.
        </EditUnlock>
      ) : null}

      {children(result.data)}
    </>
  )
}

export default ChecklistGate
